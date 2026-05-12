package com.antonintacchi.social.dto.comment;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentDto {

    private Long id;
    private Long userId;
    private Long tmdbId;
    private String mediaType;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
