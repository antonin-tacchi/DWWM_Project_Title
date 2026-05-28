package com.antonintacchi.dbservice.controller;

import com.antonintacchi.dbservice.entity.ListItem;
import com.antonintacchi.dbservice.entity.MediaList;
import com.antonintacchi.dbservice.repository.ListItemRepository;
import com.antonintacchi.dbservice.repository.MediaListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/db")
@RequiredArgsConstructor
public class ListController {

    private final MediaListRepository mediaListRepository;
    private final ListItemRepository  listItemRepository;

    /* ── Lists ───────────────────────────────────────────────────── */

    @GetMapping("/lists")
    public ResponseEntity<List<MediaList>> findListsByUser(@RequestParam Long userId) {
        return ResponseEntity.ok(mediaListRepository.findByUserId(userId));
    }

    @GetMapping("/lists/{id}")
    public ResponseEntity<MediaList> findListById(@PathVariable Long id) {
        return mediaListRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/lists")
    public ResponseEntity<MediaList> saveList(@RequestBody MediaList list) {
        list.setId(null);
        return ResponseEntity.ok(mediaListRepository.save(list));
    }

    @PutMapping("/lists/{id}")
    public ResponseEntity<MediaList> updateList(@PathVariable Long id, @RequestBody MediaList patch) {
        return mediaListRepository.findById(id).map(l -> {
            l.setName(patch.getName());
            l.setDescription(patch.getDescription());
            if (patch.getIsPublic() != null) l.setIsPublic(patch.getIsPublic());
            return ResponseEntity.ok(mediaListRepository.save(l));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/lists/{id}")
    public ResponseEntity<Void> deleteList(@PathVariable Long id) {
        if (!mediaListRepository.existsById(id)) return ResponseEntity.notFound().build();
        mediaListRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /* ── List Items ──────────────────────────────────────────────── */

    @GetMapping("/list-items")
    public ResponseEntity<List<ListItem>> findItemsByList(@RequestParam Long listId) {
        return ResponseEntity.ok(listItemRepository.findByListId(listId));
    }

    @GetMapping("/list-items/{id}")
    public ResponseEntity<ListItem> findItemById(@PathVariable Long id) {
        return listItemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/list-items/exists")
    public ResponseEntity<Boolean> itemExists(
            @RequestParam Long listId,
            @RequestParam Long tmdbId,
            @RequestParam String mediaType) {
        return ResponseEntity.ok(
                listItemRepository.existsByListIdAndTmdbIdAndMediaType(listId, tmdbId, mediaType));
    }

    @PostMapping("/list-items")
    public ResponseEntity<ListItem> saveItem(@RequestBody ListItem item) {
        item.setId(null);
        return ResponseEntity.ok(listItemRepository.save(item));
    }

    @DeleteMapping("/list-items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        if (!listItemRepository.existsById(id)) return ResponseEntity.notFound().build();
        listItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
