package com.antonintacchi.social.dto.rating;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateRatingRequest {

    @NotNull
    private Long tmdbId;

    @NotBlank
    @Pattern(regexp = "movie|tv")
    private String mediaType;

    @NotNull
    @Min(1)
    @Max(10)
    private Byte score;

}
