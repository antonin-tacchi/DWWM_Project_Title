package com.antonintacchi.social.dto.list;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateListRequest {

    @NotBlank
    private String name;

    private String description;
    private Boolean isPublic;

}
