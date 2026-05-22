package com.antonintacchi.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmdbPersonResponse {

    private Long id;
    private String name;
    private String biography;

    @JsonProperty("profile_path")
    private String profilePath;

    private String birthday;

    private String deathday;

    @JsonProperty("place_of_birth")
    private String placeOfBirth;

    @JsonProperty("known_for_department")
    private String knownForDepartment;

    /** 0=Not specified, 1=Female, 2=Male, 3=Non-binary */
    private Integer gender;

    @JsonProperty("also_known_as")
    private List<String> alsoKnownAs;

    private Double popularity;

}
