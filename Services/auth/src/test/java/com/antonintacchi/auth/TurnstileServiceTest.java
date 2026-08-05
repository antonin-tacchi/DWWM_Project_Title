package com.antonintacchi.auth;

import com.antonintacchi.auth.service.TurnstileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.*;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@DisplayName("TurnstileService — validation Cloudflare")
class TurnstileServiceTest {

    private static final String SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    private MockRestServiceServer server;
    private TurnstileService turnstileService;

    @BeforeEach
    void setUp() {
        RestTemplate restTemplate = new RestTemplate();
        server = MockRestServiceServer.bindTo(restTemplate).build();
        turnstileService = new TurnstileService(
                restTemplate,
                "secret-key",
                SITEVERIFY_URL,
                "register",
                "localhost"
        );
    }

    @Test
    @DisplayName("validateRegistrationToken — accepte un token valide")
    void validateRegistrationToken_shouldAcceptValidToken() {
        server.expect(requestTo(SITEVERIFY_URL))
                .andExpect(method(HttpMethod.POST))
                .andExpect(content().string(allOf(
                        containsString("secret=secret-key"),
                        containsString("response=valid-token"),
                        containsString("remoteip=127.0.0.1")
                )))
                .andRespond(withSuccess("""
                        {
                          "success": true,
                          "action": "register",
                          "hostname": "localhost",
                          "error-codes": []
                        }
                        """, MediaType.APPLICATION_JSON));

        assertThatCode(() -> turnstileService.validateRegistrationToken("valid-token", "127.0.0.1"))
                .doesNotThrowAnyException();
        server.verify();
    }

    @Test
    @DisplayName("validateRegistrationToken — refuse un token invalide")
    void validateRegistrationToken_shouldRejectInvalidToken() {
        server.expect(requestTo(SITEVERIFY_URL))
                .andRespond(withSuccess("""
                        {
                          "success": false,
                          "error-codes": ["invalid-input-response"]
                        }
                        """, MediaType.APPLICATION_JSON));

        assertThatThrownBy(() -> turnstileService.validateRegistrationToken("invalid-token"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("CAPTCHA invalide");
        server.verify();
    }

    @Test
    @DisplayName("validateRegistrationToken — refuse une action inattendue")
    void validateRegistrationToken_shouldRejectUnexpectedAction() {
        server.expect(requestTo(SITEVERIFY_URL))
                .andRespond(withSuccess("""
                        {
                          "success": true,
                          "action": "login",
                          "hostname": "localhost",
                          "error-codes": []
                        }
                        """, MediaType.APPLICATION_JSON));

        assertThatThrownBy(() -> turnstileService.validateRegistrationToken("valid-token"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("CAPTCHA invalide");
        server.verify();
    }

    @Test
    @DisplayName("validateRegistrationToken — refuse un token absent")
    void validateRegistrationToken_shouldRejectMissingToken() {
        assertThatThrownBy(() -> turnstileService.validateRegistrationToken(" "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("CAPTCHA requis");
    }

}
