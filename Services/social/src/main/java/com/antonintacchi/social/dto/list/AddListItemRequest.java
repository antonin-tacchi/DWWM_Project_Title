package com.antonintacchi.social.dto.list;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AddListItemRequest {

    @NotNull
    private Long tmdbId;

    @NotBlank
    @Pattern(regexp = "movie|tv")
    private String mediaType;

}
