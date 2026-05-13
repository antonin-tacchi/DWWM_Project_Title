package com.antonintacchi.social.controller;

import com.antonintacchi.social.dto.list.*;
import com.antonintacchi.social.service.ListService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lists")
@RequiredArgsConstructor
public class ListController {

    private final ListService listService;

    @GetMapping
    public ResponseEntity<List<ListDto>> getLists(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(listService.getLists(userId));
    }

    @PostMapping
    public ResponseEntity<ListDto> createList(@RequestHeader("X-User-Id") Long userId,
                                              @Valid @RequestBody CreateListRequest request) {
        return ResponseEntity.status(201).body(listService.createList(userId, request));
    }

    @GetMapping("/{listId}")
    public ResponseEntity<ListDto> getList(@RequestHeader("X-User-Id") Long userId,
                                           @PathVariable Long listId) {
        return ResponseEntity.ok(listService.getList(userId, listId));
    }

    @PutMapping("/{listId}")
    public ResponseEntity<ListDto> updateList(@RequestHeader("X-User-Id") Long userId,
                                              @PathVariable Long listId,
                                              @Valid @RequestBody UpdateListRequest request) {
        return ResponseEntity.ok(listService.updateList(userId, listId, request));
    }

    @DeleteMapping("/{listId}")
    public ResponseEntity<Void> deleteList(@RequestHeader("X-User-Id") Long userId,
                                           @PathVariable Long listId) {
        listService.deleteList(userId, listId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{listId}/items")
    public ResponseEntity<List<ListItemDto>> getListItems(@RequestHeader("X-User-Id") Long userId,
                                                          @PathVariable Long listId) {
        return ResponseEntity.ok(listService.getListItems(userId, listId));
    }

    @PostMapping("/{listId}/items")
    public ResponseEntity<ListItemDto> addListItem(@RequestHeader("X-User-Id") Long userId,
                                                   @PathVariable Long listId,
                                                   @Valid @RequestBody AddListItemRequest request) {
        return ResponseEntity.status(201).body(listService.addListItem(userId, listId, request));
    }

    @DeleteMapping("/{listId}/items/{itemId}")
    public ResponseEntity<Void> removeListItem(@RequestHeader("X-User-Id") Long userId,
                                               @PathVariable Long listId,
                                               @PathVariable Long itemId) {
        listService.removeListItem(userId, listId, itemId);
        return ResponseEntity.noContent().build();
    }

}
