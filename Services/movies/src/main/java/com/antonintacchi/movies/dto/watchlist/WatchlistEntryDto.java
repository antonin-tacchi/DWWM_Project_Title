package com.antonintacchi.movies.dto.watchlist;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class WatchlistEntryDto {

    private Long id;
    private Long tmdbId;
    private String mediaType;
    private LocalDateTime addedAt;

}
