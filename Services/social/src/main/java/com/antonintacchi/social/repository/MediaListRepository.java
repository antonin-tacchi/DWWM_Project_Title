package com.antonintacchi.social.repository;

import com.antonintacchi.social.entity.MediaList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediaListRepository extends JpaRepository<MediaList, Long> {

    List<MediaList> findByUserId(Long userId);

}
