package com.antonintacchi.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmdbPersonCreditsResponse {

    private Long id;

    /** Movies / shows where this person appeared as an actor */
    private List<TmdbPersonCreditEntry> cast;

    /** Movies / shows where this person worked behind the camera */
    private List<TmdbPersonCreditEntry> crew;
}
