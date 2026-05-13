package com.antonintacchi.social.dto.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateCommentRequest {

    @NotBlank
    private String content;

}
