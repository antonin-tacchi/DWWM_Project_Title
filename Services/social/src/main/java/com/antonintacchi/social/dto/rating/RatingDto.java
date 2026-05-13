package com.antonintacchi.social.dto.rating;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RatingDto {

    private Long id;
    private Long userId;
    private Long tmdbId;
    private String mediaType;
    private Byte score;
    private LocalDateTime createdAt;

}
