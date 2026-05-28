package com.antonintacchi.movies.dto.history;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistoryEntryDto {

    private Long id;
    private Long tmdbId;
    private String mediaType;
    private LocalDateTime consultedAt;

}
