package com.sliit.paf.smart_campus_hub.notifications.service.impl;

import com.sliit.paf.smart_campus_hub.exception.ResourceNotFoundException;
import com.sliit.paf.smart_campus_hub.exception.UnauthorizedException;
import com.sliit.paf.smart_campus_hub.notifications.entity.NotificationType;
import com.sliit.paf.smart_campus_hub.notifications.entity.UserNotification;
import com.sliit.paf.smart_campus_hub.notifications.repository.UserNotificationRepository;
import com.sliit.paf.smart_campus_hub.notifications.service.NotificationService;
import com.sliit.paf.smart_campus_hub.usermanagement.entity.User;
import com.sliit.paf.smart_campus_hub.usermanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final UserNotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public List<UserNotification> getMyNotifications(boolean unreadOnly) {
        User currentUser = getCurrentUser();
        if (unreadOnly) {
            return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(currentUser.getId());
        }
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
    }

    @Override
    public long getUnreadCount() {
        User currentUser = getCurrentUser();
        return notificationRepository.countByUserIdAndReadFalse(currentUser.getId());
    }

    @Override
    public UserNotification markAsRead(String notificationId) {
        User currentUser = getCurrentUser();
        UserNotification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + notificationId));

        if (!notification.getUserId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only mark your own notifications as read");
        }

        if (!notification.isRead()) {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
            notification = notificationRepository.save(notification);
        }

        return notification;
    }

    @Override
    public int markAllAsRead() {
        User currentUser = getCurrentUser();
        List<UserNotification> unread = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(currentUser.getId());

        if (unread.isEmpty()) {
            return 0;
        }

        LocalDateTime now = LocalDateTime.now();
        unread.forEach(notification -> {
            notification.setRead(true);
            notification.setReadAt(now);
        });

        notificationRepository.saveAll(unread);
        return unread.size();
    }

    @Override
    public UserNotification notifyUser(String userId, NotificationType type, String title, String message, String relatedEntityType, String relatedEntityId) {
        if (userId == null || userId.isBlank()) {
            return null;
        }

        UserNotification notification = UserNotification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .message(message)
                .relatedEntityType(relatedEntityType)
                .relatedEntityId(relatedEntityId)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        return notificationRepository.save(notification);
    }

    @Override
    public void notifyUsers(Collection<String> userIds, NotificationType type, String title, String message, String relatedEntityType, String relatedEntityId) {
        if (userIds == null || userIds.isEmpty()) {
            return;
        }

        Set<String> uniqueIds = userIds.stream()
                .filter(id -> id != null && !id.isBlank())
                .collect(Collectors.toSet());

        if (uniqueIds.isEmpty()) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        List<UserNotification> notifications = uniqueIds.stream()
                .map(userId -> UserNotification.builder()
                        .userId(userId)
                        .type(type)
                        .title(title)
                        .message(message)
                        .relatedEntityType(relatedEntityType)
                        .relatedEntityId(relatedEntityId)
                        .read(false)
                        .createdAt(now)
                        .build())
                .collect(Collectors.toList());

        notificationRepository.saveAll(notifications);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new UnauthorizedException("No authenticated user found");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));
    }
}
