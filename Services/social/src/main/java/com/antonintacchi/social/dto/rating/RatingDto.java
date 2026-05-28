package com.antonintacchi.social.dto.rating;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingDto {

    private Long id;
    private Long userId;
    private Long tmdbId;
    private String mediaType;
    private Byte score;
    private LocalDateTime createdAt;

}
