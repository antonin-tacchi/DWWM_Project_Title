package com.antonintacchi.dbservice.repository;

import com.antonintacchi.dbservice.entity.MediaList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediaListRepository extends JpaRepository<MediaList, Long> {
    List<MediaList> findByUserId(Long userId);
}
