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
public class ListDto {

    private Long id;
    private Long userId;
    private String name;
    private String description;
    private Boolean isDefault;
    private Boolean isPublic;
    private LocalDateTime createdAt;

}
