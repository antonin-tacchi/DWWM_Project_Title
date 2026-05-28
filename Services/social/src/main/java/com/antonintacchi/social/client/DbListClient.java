package com.antonintacchi.social.client;

import com.antonintacchi.social.dto.list.ListDto;
import com.antonintacchi.social.dto.list.ListItemDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(name = "db-service", contextId = "dbListClient")
public interface DbListClient {

    /* ── Lists ───────────────────────────────────────────────────── */

    @GetMapping("/db/lists")
    List<ListDto> findByUser(@RequestParam Long userId);

    @GetMapping("/db/lists/{id}")
    ListDto findById(@PathVariable Long id);

    @PostMapping("/db/lists")
    ListDto save(@RequestBody Map<String, Object> list);

    @PutMapping("/db/lists/{id}")
    ListDto update(@PathVariable Long id, @RequestBody Map<String, Object> patch);

    @DeleteMapping("/db/lists/{id}")
    void delete(@PathVariable Long id);

    /* ── List Items ──────────────────────────────────────────────── */

    @GetMapping("/db/list-items")
    List<ListItemDto> findItems(@RequestParam Long listId);

    @GetMapping("/db/list-items/{id}")
    ListItemDto findItemById(@PathVariable Long id);

    @GetMapping("/db/list-items/exists")
    Boolean itemExists(@RequestParam Long listId,
                       @RequestParam Long tmdbId,
                       @RequestParam String mediaType);

    @PostMapping("/db/list-items")
    ListItemDto saveItem(@RequestBody Map<String, Object> item);

    @DeleteMapping("/db/list-items/{id}")
    void deleteItem(@PathVariable Long id);

}
