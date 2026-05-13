package com.antonintacchi.social.dto.list;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ListItemDto {

    private Long id;
    private Long listId;
    private Long tmdbId;
    private String mediaType;
    private LocalDateTime addedAt;

}
