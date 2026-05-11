package com.antonintacchi.movies.dto.history;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class HistoryEntryDto {

    private Long id;
    private Long tmdbId;
    private String mediaType;
    private LocalDateTime consultedAt;

}
