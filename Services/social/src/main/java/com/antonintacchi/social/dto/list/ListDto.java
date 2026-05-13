package com.antonintacchi.social.dto.list;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ListDto {

    private Long id;
    private Long userId;
    private String name;
    private String description;
    private Boolean isDefault;
    private Boolean isPublic;
    private LocalDateTime createdAt;

}
