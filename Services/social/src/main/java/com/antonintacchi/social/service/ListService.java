package com.antonintacchi.social.service;

import com.antonintacchi.social.dto.list.*;
import com.antonintacchi.social.entity.ListItem;
import com.antonintacchi.social.entity.MediaList;
import com.antonintacchi.social.repository.ListItemRepository;
import com.antonintacchi.social.repository.MediaListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListService {

    private final MediaListRepository mediaListRepository;
    private final ListItemRepository listItemRepository;

    public List<ListDto> getLists(Long userId) {
        return mediaListRepository.findByUserId(userId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ListDto createList(Long userId, CreateListRequest request) {
        MediaList list = MediaList.builder()
                .userId(userId)
                .name(request.getName())
                .description(request.getDescription())
                .isDefault(false)
                .isPublic(request.getIsPublic() != null ? request.getIsPublic() : false)
                .build();
        return toDto(mediaListRepository.save(list));
    }

    public ListDto getList(Long userId, Long listId) {
        MediaList list = mediaListRepository.findById(listId)
                .orElseThrow(() -> new NoSuchElementException("List not found"));
        if (!list.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your list");
        }
        return toDto(list);
    }

    public ListDto updateList(Long userId, Long listId, UpdateListRequest request) {
        MediaList list = mediaListRepository.findById(listId)
                .orElseThrow(() -> new NoSuchElementException("List not found"));
        if (!list.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your list");
        }
        list.setName(request.getName());
        list.setDescription(request.getDescription());
        if (request.getIsPublic() != null) {
            list.setIsPublic(request.getIsPublic());
        }
        return toDto(mediaListRepository.save(list));
    }

    public void deleteList(Long userId, Long listId) {
        MediaList list = mediaListRepository.findById(listId)
                .orElseThrow(() -> new NoSuchElementException("List not found"));
        if (!list.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your list");
        }
        mediaListRepository.delete(list);
    }

    public List<ListItemDto> getListItems(Long userId, Long listId) {
        MediaList list = mediaListRepository.findById(listId)
                .orElseThrow(() -> new NoSuchElementException("List not found"));
        if (!list.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your list");
        }
        return listItemRepository.findByListId(listId)
                .stream()
                .map(this::toItemDto)
                .collect(Collectors.toList());
    }

    public ListItemDto addListItem(Long userId, Long listId, AddListItemRequest request) {
        MediaList list = mediaListRepository.findById(listId)
                .orElseThrow(() -> new NoSuchElementException("List not found"));
        if (!list.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your list");
        }
        if (listItemRepository.existsByListIdAndTmdbIdAndMediaType(listId, request.getTmdbId(), request.getMediaType())) {
            throw new IllegalStateException("Item already in list");
        }
        ListItem item = ListItem.builder()
                .listId(listId)
                .tmdbId(request.getTmdbId())
                .mediaType(request.getMediaType())
                .build();
        return toItemDto(listItemRepository.save(item));
    }

    public void removeListItem(Long userId, Long listId, Long itemId) {
        MediaList list = mediaListRepository.findById(listId)
                .orElseThrow(() -> new NoSuchElementException("List not found"));
        if (!list.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your list");
        }
        ListItem item = listItemRepository.findById(itemId)
                .orElseThrow(() -> new NoSuchElementException("Item not found"));
        listItemRepository.delete(item);
    }

    private ListDto toDto(MediaList list) {
        return ListDto.builder()
                .id(list.getId())
                .userId(list.getUserId())
                .name(list.getName())
                .description(list.getDescription())
                .isDefault(list.getIsDefault())
                .isPublic(list.getIsPublic())
                .createdAt(list.getCreatedAt())
                .build();
    }

    private ListItemDto toItemDto(ListItem item) {
        return ListItemDto.builder()
                .id(item.getId())
                .listId(item.getListId())
                .tmdbId(item.getTmdbId())
                .mediaType(item.getMediaType())
                .addedAt(item.getAddedAt())
                .build();
    }

}
