package com.sliit.paf.smart_campus_hub.notifications.service;

import com.sliit.paf.smart_campus_hub.notifications.entity.NotificationType;
import com.sliit.paf.smart_campus_hub.notifications.entity.UserNotification;

import java.util.Collection;
import java.util.List;

public interface NotificationService {
    List<UserNotification> getMyNotifications(boolean unreadOnly);
    long getUnreadCount();
    UserNotification markAsRead(String notificationId);
    int markAllAsRead();

    UserNotification notifyUser(String userId, NotificationType type, String title, String message, String relatedEntityType, String relatedEntityId);
    void notifyUsers(Collection<String> userIds, NotificationType type, String title, String message, String relatedEntityType, String relatedEntityId);
}
