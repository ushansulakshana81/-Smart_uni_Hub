package com.sliit.paf.smart_campus_hub.notifications.controller;

import com.sliit.paf.smart_campus_hub.notifications.service.NotificationService;
import com.sliit.paf.smart_campus_hub.usermanagement.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getMyNotifications(@RequestParam(defaultValue = "false") boolean unreadOnly) {
        return ResponseEntity.ok(new ApiResponse(true, "Notifications retrieved successfully", notificationService.getMyNotifications(unreadOnly)));
    }

    @GetMapping("/unread-count")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getUnreadCount() {
        return ResponseEntity.ok(new ApiResponse(true, "Unread count retrieved successfully", Map.of("count", notificationService.getUnreadCount())));
    }

    @PatchMapping("/{notificationId}/read")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> markAsRead(@PathVariable String notificationId) {
        return ResponseEntity.ok(new ApiResponse(true, "Notification marked as read", notificationService.markAsRead(notificationId)));
    }

    @PatchMapping("/read-all")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> markAllAsRead() {
        return ResponseEntity.ok(new ApiResponse(true, "Notifications marked as read", Map.of("updated", notificationService.markAllAsRead())));
    }
}
