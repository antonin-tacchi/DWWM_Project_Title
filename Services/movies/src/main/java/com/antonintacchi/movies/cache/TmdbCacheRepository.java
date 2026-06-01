package com.antonintacchi.movies.cache;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TmdbCacheRepository extends MongoRepository<TmdbCacheDocument, String> {
}
