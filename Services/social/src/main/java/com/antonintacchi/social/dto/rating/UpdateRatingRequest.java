package com.antonintacchi.social.dto.rating;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateRatingRequest {

    @NotNull
    @Min(1)
    @Max(10)
    private Byte score;

}
