package com.antonintacchi.movies.cache;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * Document MongoDB représentant une entrée du cache TMDB.
 *
 * Le champ {@code createdAt} est annoté avec {@code @Indexed(expireAfterSeconds)}
 * ce qui crée automatiquement un TTL index MongoDB : les documents expirent
 * et sont supprimés par MongoDB lui-même sans aucun job de nettoyage.
 *
 * TTL par défaut : 24h (86400 secondes).
 * Les données de détail (films, séries, credits, bandes-annonces) sont
 * stables sur cette durée — TMDB ne les modifie pas à la minute.
 */
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
