package com.antonintacchi.notifications.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateNotificationRequest {

    @NotNull
    private Long userId;

    @NotBlank
    private String type;

    @NotBlank
    private String message;

}
