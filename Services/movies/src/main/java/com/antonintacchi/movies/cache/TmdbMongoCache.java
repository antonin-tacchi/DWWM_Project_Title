package com.antonintacchi.movies.cache;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TmdbMongoCache {

    private final TmdbCacheRepository repository;
    private final ObjectMapper         objectMapper;

    /**
     * Récupère une entrée du cache par sa clé.
     *
     * @param key  identifiant unique (ex. "detail:movie:550:fr")
     * @param type classe cible pour la désérialisation JSON
     * @return l'objet désérialisé, ou {@code Optional.empty()} si absent ou erreur
     */
    public <T> Optional<T> get(String key, Class<T> type) {
        try {
            return repository.findById(key)
                    .map(doc -> {
                        try {
                            return objectMapper.readValue(doc.getPayload(), type);
                        } catch (Exception e) {
                            log.warn("[TmdbCache] Désérialisation échouée pour la clé '{}' : {}", key, e.getMessage());
                            return null;
                        }
                    });
        } catch (Exception e) {
            log.warn("[TmdbCache] Lecture MongoDB échouée pour la clé '{}' : {}", key, e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Sauvegarde une réponse dans le cache MongoDB.
     * Silencieux en cas d'erreur (ne bloque jamais la réponse principale).
     *
     * @param key   identifiant unique
     * @param value objet à sérialiser et stocker
     */
    public <T> void put(String key, T value) {
        try {
            TmdbCacheDocument doc = new TmdbCacheDocument();
            doc.setId(key);
            doc.setPayload(objectMapper.writeValueAsString(value));
            doc.setCreatedAt(new Date());
            repository.save(doc);
            log.debug("[TmdbCache] Entrée mise en cache : '{}'", key);
        } catch (Exception e) {
            log.warn("[TmdbCache] Écriture MongoDB échouée pour la clé '{}' : {}", key, e.getMessage());
        }
    }

    public void evict(String key) {
        try {
            repository.deleteById(key);
        } catch (Exception e) {
            log.warn("[TmdbCache] Suppression MongoDB échouée pour la clé '{}' : {}", key, e.getMessage());
        }
    }
}
