package com.antonintacchi.social.dto.comment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {

    private Long id;
    private Long userId;
    private String username;
    private String avatarUrl;
    private Long tmdbId;
    private String mediaType;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
