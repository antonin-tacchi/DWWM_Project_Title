package com.antonintacchi.social.dto.favorite;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FavoriteDto {

    private Long id;
    private Long userId;
    private Long tmdbId;
    private String mediaType;
    private LocalDateTime addedAt;

}
