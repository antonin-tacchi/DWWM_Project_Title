package com.antonintacchi.social.repository;

import com.antonintacchi.social.entity.ListItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ListItemRepository extends JpaRepository<ListItem, Long> {

    List<ListItem> findByListId(Long listId);
    boolean existsByListIdAndTmdbIdAndMediaType(Long listId, Long tmdbId, String mediaType);

}
