package com.antonintacchi.dbservice.controller;

import com.antonintacchi.dbservice.entity.AdminLog;
import com.antonintacchi.dbservice.repository.AdminLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/db/admin-logs")
@RequiredArgsConstructor
public class AdminLogController {

    private final AdminLogRepository adminLogRepository;

    @GetMapping
    public ResponseEntity<List<AdminLog>> findAll() {
        return ResponseEntity.ok(adminLogRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping
    public ResponseEntity<AdminLog> save(@RequestBody AdminLog log) {
        log.setId(null);
        return ResponseEntity.ok(adminLogRepository.save(log));
    }
}
