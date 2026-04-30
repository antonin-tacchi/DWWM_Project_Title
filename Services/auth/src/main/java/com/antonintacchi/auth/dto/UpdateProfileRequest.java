package com.antonintacchi.auth.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String username;
    private String email;
    private String avatarUrl;
    private String bio;
    private String language;
    private String theme;
    private Long bannerTmdbId;

}
