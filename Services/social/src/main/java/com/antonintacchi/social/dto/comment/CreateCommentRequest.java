package com.antonintacchi.social.dto.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CreateCommentRequest {

    @NotNull
    private Long tmdbId;

    @NotBlank
    @Pattern(regexp = "movie|tv")
    private String mediaType;

    @NotBlank
    private String content;

}
