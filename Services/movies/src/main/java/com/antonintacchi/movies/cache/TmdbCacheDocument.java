package com.antonintacchi.movies.cache;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "tmdb_cache")
public class TmdbCacheDocument {

    /** Clé unique du cache : ex. "detail:movie:550:fr" */
    @Id
    private String id;

    /** Réponse TMDB sérialisée en JSON */
    private String payload;

    /** Date de création — déclencheur du TTL index MongoDB (24h) */
    @Indexed(expireAfterSeconds = 86400)
    private Date createdAt;
}
