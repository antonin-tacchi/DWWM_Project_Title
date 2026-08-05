package com.antonintacchi.auth.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TurnstileVerificationResponse {

    private boolean success;
    private String action;
    private String hostname;

    @JsonProperty("error-codes")
    private List<String> errorCodes;

}
