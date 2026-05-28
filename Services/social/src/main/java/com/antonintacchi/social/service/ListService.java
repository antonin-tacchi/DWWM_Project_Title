package com.antonintacchi.social.service;

import com.antonintacchi.social.client.DbListClient;
import com.antonintacchi.social.dto.list.*;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ListService {

    private final DbListClient dbListClient;

    /* ── Lists ───────────────────────────────────────────────────── */

    public List<ListDto> getLists(Long userId) {
        return dbListClient.findByUser(userId);
    }

    public ListDto createList(Long userId, CreateListRequest request) {
        Map<String, Object> body = Map.of(
                "userId",      userId,
                "name",        request.getName(),
                "description", request.getDescription() != null ? request.getDescription() : "",
                "isDefault",   false,
                "isPublic",    request.getIsPublic() != null ? request.getIsPublic() : false
        );
        return dbListClient.save(body);
    }

    public ListDto getList(Long userId, Long listId) {
        ListDto list = findListOrThrow(listId);
        if (!list.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your list");
        }
        return list;
    }

    public ListDto updateList(Long userId, Long listId, UpdateListRequest request) {
        ListDto list = findListOrThrow(listId);
        if (!list.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your list");
        }
        Map<String, Object> patch = new java.util.HashMap<>();
        patch.put("name", request.getName());
        patch.put("description", request.getDescription() != null ? request.getDescription() : "");
        if (request.getIsPublic() != null) patch.put("isPublic", request.getIsPublic());
        return dbListClient.update(listId, patch);
    }

    public void deleteList(Long userId, Long listId) {
        ListDto list = findListOrThrow(listId);
        if (!list.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your list");
        }
        dbListClient.delete(listId);
    }

    /* ── List Items ──────────────────────────────────────────────── */

    public List<ListItemDto> getListItems(Long userId, Long listId) {
        ListDto list = findListOrThrow(listId);
        if (!list.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your list");
        }
        return dbListClient.findItems(listId);
    }

    public ListItemDto addListItem(Long userId, Long listId, AddListItemRequest request) {
        ListDto list = findListOrThrow(listId);
        if (!list.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your list");
        }
        if (Boolean.TRUE.equals(dbListClient.itemExists(listId, request.getTmdbId(), request.getMediaType()))) {
            throw new IllegalStateException("Item already in list");
        }
        Map<String, Object> body = Map.of(
                "listId",    listId,
                "tmdbId",    request.getTmdbId(),
                "mediaType", request.getMediaType()
        );
        return dbListClient.saveItem(body);
    }

    public void removeListItem(Long userId, Long listId, Long itemId) {
        ListDto list = findListOrThrow(listId);
        if (!list.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your list");
        }
        try {
            dbListClient.findItemById(itemId);
        } catch (FeignException.NotFound e) {
            throw new NoSuchElementException("Item not found");
        }
        dbListClient.deleteItem(itemId);
    }

    /* ── Helpers ─────────────────────────────────────────────────── */

    private ListDto findListOrThrow(Long listId) {
        try {
            return dbListClient.findById(listId);
        } catch (FeignException.NotFound e) {
            throw new NoSuchElementException("List not found");
        }
    }

}
