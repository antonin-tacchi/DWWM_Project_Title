package com.antonintacchi.auth.service;

import com.antonintacchi.auth.dto.TurnstileVerificationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Service
public class TurnstileService {

    private static final String INVALID_CAPTCHA_MESSAGE = "CAPTCHA invalide. Merci de réessayer.";
    private static final String UNAVAILABLE_CAPTCHA_MESSAGE = "Validation CAPTCHA indisponible. Merci de réessayer.";

    private final RestTemplate restTemplate;
    private final String secretKey;
    private final String siteverifyUrl;
    private final String expectedAction;
    private final String expectedHostname;

    @Autowired
    public TurnstileService(
            RestTemplateBuilder restTemplateBuilder,
            @Value("${turnstile.secret-key}") String secretKey,
            @Value("${turnstile.siteverify-url:https://challenges.cloudflare.com/turnstile/v0/siteverify}") String siteverifyUrl,
            @Value("${turnstile.expected-action:register}") String expectedAction,
            @Value("${turnstile.expected-hostname:}") String expectedHostname
    ) {
        this(restTemplateBuilder
                .connectTimeout(Duration.ofSeconds(3))
                .readTimeout(Duration.ofSeconds(5))
                .build(), secretKey, siteverifyUrl, expectedAction, expectedHostname);
    }

    public TurnstileService(RestTemplate restTemplate, String secretKey, String siteverifyUrl,
                            String expectedAction, String expectedHostname) {
        this.restTemplate = restTemplate;
        this.secretKey = secretKey;
        this.siteverifyUrl = siteverifyUrl;
        this.expectedAction = expectedAction;
        this.expectedHostname = expectedHostname;
    }

    public void validateRegistrationToken(String token) {
        validateRegistrationToken(token, null);
    }

    public void validateRegistrationToken(String token, String remoteIp) {
        if (!StringUtils.hasText(token)) {
            throw new IllegalArgumentException("CAPTCHA requis.");
        }

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("secret", secretKey);
        form.add("response", token);
        if (StringUtils.hasText(remoteIp)) {
            form.add("remoteip", remoteIp);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        try {
            ResponseEntity<TurnstileVerificationResponse> response = restTemplate.postForEntity(
                    siteverifyUrl,
                    new HttpEntity<>(form, headers),
                    TurnstileVerificationResponse.class
            );

            TurnstileVerificationResponse body = response.getBody();
            if (!response.getStatusCode().is2xxSuccessful() || body == null || !body.isSuccess()) {
                throw new IllegalArgumentException(INVALID_CAPTCHA_MESSAGE);
            }

            if (StringUtils.hasText(expectedAction) && !expectedAction.equals(body.getAction())) {
                throw new IllegalArgumentException(INVALID_CAPTCHA_MESSAGE);
            }

            if (StringUtils.hasText(expectedHostname) && !expectedHostname.equals(body.getHostname())) {
                throw new IllegalArgumentException(INVALID_CAPTCHA_MESSAGE);
            }
        } catch (IllegalArgumentException ex) {
            throw ex;
        } catch (RestClientException ex) {
            throw new IllegalArgumentException(UNAVAILABLE_CAPTCHA_MESSAGE);
        }
    }

}
