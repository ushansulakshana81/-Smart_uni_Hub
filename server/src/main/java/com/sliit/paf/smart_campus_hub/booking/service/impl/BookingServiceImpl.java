package com.sliit.paf.smart_campus_hub.booking.service.impl;

import com.sliit.paf.smart_campus_hub.adminresources.entity.Asset;
import com.sliit.paf.smart_campus_hub.adminresources.entity.Facility;
import com.sliit.paf.smart_campus_hub.adminresources.repository.AssetRepository;
import com.sliit.paf.smart_campus_hub.adminresources.repository.FacilityRepository;
import com.sliit.paf.smart_campus_hub.booking.dto.BookingCancelRequest;
import com.sliit.paf.smart_campus_hub.booking.dto.BookingCreateRequest;
import com.sliit.paf.smart_campus_hub.booking.dto.BookingStatusUpdateRequest;
import com.sliit.paf.smart_campus_hub.booking.dto.BookingUpdateRequest;
import com.sliit.paf.smart_campus_hub.booking.entity.Booking;
import com.sliit.paf.smart_campus_hub.booking.entity.BookingDecisionType;
import com.sliit.paf.smart_campus_hub.booking.entity.BookingResourceType;
import com.sliit.paf.smart_campus_hub.booking.entity.BookingStatus;
import com.sliit.paf.smart_campus_hub.booking.repository.BookingRepository;
import com.sliit.paf.smart_campus_hub.booking.service.BookingService;
import com.sliit.paf.smart_campus_hub.exception.ResourceNotFoundException;
import com.sliit.paf.smart_campus_hub.exception.UnauthorizedException;
import com.sliit.paf.smart_campus_hub.notifications.entity.NotificationType;
import com.sliit.paf.smart_campus_hub.notifications.service.NotificationService;
import com.sliit.paf.smart_campus_hub.usermanagement.entity.Role;
import com.sliit.paf.smart_campus_hub.usermanagement.entity.User;
import com.sliit.paf.smart_campus_hub.usermanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final FacilityRepository facilityRepository;
    private final AssetRepository assetRepository;
    private final NotificationService notificationService;

    @Override
    public List<Booking> getBookings(BookingStatus status, BookingResourceType resourceType, LocalDate fromDate, LocalDate toDate, String search, boolean adminView) {
        User currentUser = getCurrentUser();
        List<Booking> bookings = adminView
                ? bookingRepository.findAllByOrderByCreatedAtDesc()
                : bookingRepository.findByCreatedByUserIdOrderByCreatedAtDesc(currentUser.getId());

        return bookings.stream()
                .filter(booking -> status == null || booking.getStatus() == status)
                .filter(booking -> resourceType == null || booking.getResourceType() == resourceType)
                .filter(booking -> fromDate == null || !booking.getBookingDate().isBefore(fromDate))
                .filter(booking -> toDate == null || !booking.getBookingDate().isAfter(toDate))
                .filter(booking -> matchesSearch(booking, search))
                .collect(Collectors.toList());
    }

    @Override
    public Booking getBookingById(String bookingId) {
        Booking booking = findBooking(bookingId);
        validateAccess(booking, getCurrentUser());
        return booking;
    }

    @Override
    public Booking createBooking(BookingCreateRequest request) {
        User currentUser = getCurrentUser();
        LocalDateTime now = LocalDateTime.now();
        BookingResourceData resourceData = resolveResource(request.getResourceType(), request.getResourceId());
        ensureResourceBookable(resourceData);
        validateTimeRange(request.getStartTime(), request.getEndTime());
        validateConflict(request.getResourceType(), request.getResourceId(), request.getBookingDate(), request.getStartTime(), request.getEndTime(), null);

        Booking booking = Booking.builder()
                .bookingCode(generateBookingCode())
                .resourceType(request.getResourceType())
                .resourceId(resourceData.resourceId())
                .resourceName(resourceData.resourceName())
                .resourceDisplayName(resourceData.resourceDisplayName())
                .location(resourceData.location())
                .bookingDate(request.getBookingDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .expectedAttendees(request.getExpectedAttendees())
                .purpose(request.getPurpose().trim())
                .status(BookingStatus.PENDING)
                .createdByUserId(currentUser.getId())
                .createdByName(currentUser.getFirstName() + " " + currentUser.getLastName())
                .createdByEmail(currentUser.getEmail())
                .createdAt(now)
                .updatedAt(now)
                .build();

        Booking saved = bookingRepository.save(booking);

        notifyAdminsExcept(
            currentUser.getId(),
            "New Booking Request",
            currentUser.getFirstName() + " requested booking " + saved.getBookingCode(),
            saved.getId()
        );

        return saved;
    }

    @Override
    public Booking updateBooking(String bookingId, BookingUpdateRequest request) {
        User currentUser = getCurrentUser();
        Booking booking = findBooking(bookingId);

        if (!isAdmin(currentUser) && !booking.getCreatedByUserId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only update your own bookings");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only PENDING bookings can be updated");
        }

        BookingResourceData resourceData = resolveResource(request.getResourceType(), request.getResourceId());
        ensureResourceBookable(resourceData);
        validateTimeRange(request.getStartTime(), request.getEndTime());
        validateConflict(request.getResourceType(), request.getResourceId(), request.getBookingDate(), request.getStartTime(), request.getEndTime(), booking.getId());

        booking.setResourceType(request.getResourceType());
        booking.setResourceId(resourceData.resourceId());
        booking.setResourceName(resourceData.resourceName());
        booking.setResourceDisplayName(resourceData.resourceDisplayName());
        booking.setLocation(resourceData.location());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setPurpose(request.getPurpose().trim());
        booking.setUpdatedAt(LocalDateTime.now());

        Booking saved = bookingRepository.save(booking);

        notifyAdminsExcept(
            currentUser.getId(),
            "Booking Updated",
            currentUser.getFirstName() + " updated booking " + saved.getBookingCode(),
            saved.getId()
        );

        return saved;
    }

    @Override
    public Booking reviewBooking(String bookingId, BookingStatusUpdateRequest request) {
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            throw new UnauthorizedException("Only admins can review bookings");
        }

        Booking booking = findBooking(bookingId);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only PENDING bookings can be reviewed");
        }

        BookingStatus nextStatus = switch (request.getDecision()) {
            case APPROVE -> BookingStatus.APPROVED;
            case REJECT -> BookingStatus.REJECTED;
            case CANCEL -> throw new IllegalArgumentException("Use the cancel endpoint for cancellations");
        };

        if (request.getStatus() != nextStatus) {
            throw new IllegalArgumentException("Status does not match the review decision");
        }

        String reason = normalizeOptionalText(request.getReason());
        if (reason == null) {
            throw new IllegalArgumentException("Reason is required for approval or rejection");
        }

        booking.setStatus(nextStatus);
        booking.setReviewReason(reason);
        booking.setReviewedByUserId(currentUser.getId());
        booking.setReviewedByName(currentUser.getFirstName() + " " + currentUser.getLastName());
        booking.setReviewedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());
        Booking saved = bookingRepository.save(booking);

        notifyBookingOwnerIfNeeded(
            saved,
            currentUser,
            "Booking " + saved.getStatus(),
            "Your booking " + saved.getBookingCode() + " is " + saved.getStatus() + ". Reason: " + reason
        );

        return saved;
    }

    @Override
    public Booking cancelBooking(String bookingId, BookingCancelRequest request) {
        User currentUser = getCurrentUser();
        Booking booking = findBooking(bookingId);

        if (!isAdmin(currentUser) && !booking.getCreatedByUserId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only cancel your own bookings");
        }

        if (booking.getStatus() != BookingStatus.APPROVED && booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only PENDING or APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelReason(normalizeOptionalText(request.getReason()));
        booking.setCancelledAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());
        Booking saved = bookingRepository.save(booking);

        if (isAdmin(currentUser)) {
            notifyBookingOwnerIfNeeded(
                saved,
                currentUser,
                "Booking Cancelled",
                "Your booking " + saved.getBookingCode() + " was cancelled by admin"
            );
        } else {
            notifyAdminsExcept(
                currentUser.getId(),
                "Booking Cancelled by User",
                currentUser.getFirstName() + " cancelled booking " + saved.getBookingCode(),
                saved.getId()
            );
        }

        return saved;
    }

    @Override
    public void deleteBooking(String bookingId) {
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            throw new UnauthorizedException("Only admins can delete bookings");
        }
        Booking booking = findBooking(bookingId);
        bookingRepository.delete(booking);

        notifyBookingOwnerIfNeeded(
            booking,
            currentUser,
            "Booking Deleted",
            "Your booking " + booking.getBookingCode() + " was deleted by admin"
        );
    }

    private Booking findBooking(String bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new UnauthorizedException("No authenticated user found");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));
    }

    private void validateAccess(Booking booking, User user) {
        if (!isAdmin(user) && !booking.getCreatedByUserId().equals(user.getId())) {
            throw new UnauthorizedException("You can only view your own bookings");
        }
    }

    private boolean isAdmin(User user) {
        return user.getRole() == Role.ADMIN;
    }

    private void validateTimeRange(LocalTime startTime, LocalTime endTime) {
        if (!startTime.isBefore(endTime)) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
    }

    private void validateConflict(BookingResourceType resourceType, String resourceId, LocalDate bookingDate, LocalTime startTime, LocalTime endTime, String bookingIdToIgnore) {
        List<BookingStatus> activeStatuses = Arrays.asList(BookingStatus.PENDING, BookingStatus.APPROVED);
        List<Booking> conflictingBookings = bookingRepository
                .findByResourceTypeAndResourceIdAndBookingDateAndStatusIn(resourceType, resourceId, bookingDate, activeStatuses)
                .stream()
                .filter(booking -> bookingIdToIgnore == null || !booking.getId().equals(bookingIdToIgnore))
                .filter(booking -> overlaps(startTime, endTime, booking.getStartTime(), booking.getEndTime()))
                .collect(Collectors.toList());

        if (!conflictingBookings.isEmpty()) {
            throw new IllegalArgumentException("This resource already has a booking that overlaps with the selected time range");
        }
    }

    private boolean overlaps(LocalTime startA, LocalTime endA, LocalTime startB, LocalTime endB) {
        return startA.isBefore(endB) && endA.isAfter(startB);
    }

    private BookingResourceData resolveResource(BookingResourceType resourceType, String resourceId) {
        return switch (resourceType) {
            case FACILITY -> facilityRepository.findById(resourceId)
                    .map(facility -> new BookingResourceData(
                            facility.getId(),
                            facility.getFacilityName(),
                            facility.getFacilityName(),
                            facility.getLocation(),
                            isBookableFacility(facility)
                    ))
                    .orElseThrow(() -> new ResourceNotFoundException("Facility not found with ID: " + resourceId));
            case ASSET -> assetRepository.findById(resourceId)
                    .map(asset -> new BookingResourceData(
                            asset.getId(),
                            asset.getName(),
                            asset.getName(),
                            asset.getLocation(),
                            isBookableAsset(asset)
                    ))
                    .orElseThrow(() -> new ResourceNotFoundException("Asset not found with ID: " + resourceId));
        };
    }

    private boolean isBookableFacility(Facility facility) {
        String availability = normalizeOptionalText(facility.getAvailability());
        return availability == null || availability.equalsIgnoreCase("available");
    }

    private boolean isBookableAsset(Asset asset) {
        String status = normalizeOptionalText(asset.getStatus());
        return status == null || !List.of("retired", "damaged", "unavailable").contains(status.toLowerCase(Locale.ROOT));
    }

    private String generateBookingCode() {
        String code;
        do {
            code = "BKG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (bookingRepository.existsByBookingCode(code));
        return code;
    }

    private boolean matchesSearch(Booking booking, String search) {
        String normalizedSearch = normalizeOptionalText(search);
        if (normalizedSearch == null) {
            return true;
        }
        String candidate = String.join(" ",
                safeText(booking.getBookingCode()),
                safeText(booking.getResourceName()),
                safeText(booking.getResourceDisplayName()),
                safeText(booking.getPurpose()),
                safeText(booking.getLocation()),
                safeText(booking.getCreatedByName()),
            safeText(booking.getStatus() == null ? null : booking.getStatus().name()));
        return candidate.toLowerCase(Locale.ROOT).contains(normalizedSearch.toLowerCase(Locale.ROOT));
    }

    private String safeText(String value) {
        return value == null ? "" : value;
    }

    private String normalizeOptionalText(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private void ensureResourceBookable(BookingResourceData resourceData) {
        if (!resourceData.bookable()) {
            throw new IllegalArgumentException("Selected resource is not currently available for booking");
        }
    }

    private void notifyBookingOwnerIfNeeded(Booking booking, User actor, String title, String message) {
        if (booking.getCreatedByUserId() == null || booking.getCreatedByUserId().equals(actor.getId())) {
            return;
        }
        notificationService.notifyUser(
                booking.getCreatedByUserId(),
                NotificationType.BOOKING,
                title,
                message,
                "BOOKING",
                booking.getId()
        );
    }

    private void notifyAdminsExcept(String excludedUserId, String title, String message, String bookingId) {
        List<String> adminIds = userRepository.findByRole(Role.ADMIN)
                .stream()
                .map(User::getId)
                .filter(id -> excludedUserId == null || !excludedUserId.equals(id))
                .collect(Collectors.toList());

        notificationService.notifyUsers(
                adminIds,
                NotificationType.BOOKING,
                title,
                message,
                "BOOKING",
                bookingId
        );
    }

    private record BookingResourceData(String resourceId, String resourceName, String resourceDisplayName, String location, boolean bookable) {
    }
}
