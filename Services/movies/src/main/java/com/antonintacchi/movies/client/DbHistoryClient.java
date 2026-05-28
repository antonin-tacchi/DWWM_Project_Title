package com.antonintacchi.movies.client;

import com.antonintacchi.movies.dto.history.HistoryEntryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(name = "db-service", contextId = "dbHistoryClient")
public interface DbHistoryClient {

    @GetMapping("/db/history")
    List<HistoryEntryDto> findByUser(@RequestParam Long userId);

    @GetMapping("/db/history/exists")
    Boolean exists(@RequestParam Long userId,
                   @RequestParam Long tmdbId,
                   @RequestParam String mediaType);

    @PostMapping("/db/history")
    HistoryEntryDto save(@RequestBody Map<String, Object> history);

}
