package com.antonintacchi.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmdbCreditsResponse {

    private List<TmdbCastMember> cast;
    private List<TmdbCrewMember> crew;

}
