package com.antonintacchi.social.dto.list;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListItemDto {

    private Long id;
    private Long listId;
    private Long tmdbId;
    private String mediaType;
    private LocalDateTime addedAt;

}
