package com.sliit.paf.smart_campus_hub.ticketing.service.impl;

import com.sliit.paf.smart_campus_hub.exception.ResourceNotFoundException;
import com.sliit.paf.smart_campus_hub.exception.UnauthorizedException;
import com.sliit.paf.smart_campus_hub.ticketing.dto.TicketCreateRequest;
import com.sliit.paf.smart_campus_hub.ticketing.dto.TicketResponseCreateRequest;
import com.sliit.paf.smart_campus_hub.ticketing.dto.TicketResponseUpdateRequest;
import com.sliit.paf.smart_campus_hub.ticketing.dto.TicketStatusUpdateRequest;
import com.sliit.paf.smart_campus_hub.ticketing.dto.TicketUpdateRequest;
import com.sliit.paf.smart_campus_hub.ticketing.entity.SupportTicket;
import com.sliit.paf.smart_campus_hub.ticketing.entity.TicketResponse;
import com.sliit.paf.smart_campus_hub.ticketing.entity.TicketStatus;
import com.sliit.paf.smart_campus_hub.ticketing.repository.SupportTicketRepository;
import com.sliit.paf.smart_campus_hub.ticketing.service.TicketingService;
import com.sliit.paf.smart_campus_hub.usermanagement.entity.Role;
import com.sliit.paf.smart_campus_hub.usermanagement.entity.User;
import com.sliit.paf.smart_campus_hub.usermanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TicketingServiceImpl implements TicketingService {

    private final SupportTicketRepository ticketRepository;
    private final UserRepository userRepository;

    @Override
    public List<SupportTicket> getTicketsForCurrentUser() {
        User currentUser = getCurrentUser();
        if (isAdmin(currentUser)) {
            return ticketRepository.findAllByOrderByCreatedAtDesc();
        }
        return ticketRepository.findByCreatedByUserIdOrderByCreatedAtDesc(currentUser.getId());
    }

    @Override
    public SupportTicket getTicketById(String ticketId) {
        SupportTicket ticket = findTicket(ticketId);
        validateTicketAccess(ticket, getCurrentUser());
        return ticket;
    }

    @Override
    public SupportTicket createTicket(TicketCreateRequest request) {
        User currentUser = getCurrentUser();
        LocalDateTime now = LocalDateTime.now();

        SupportTicket ticket = SupportTicket.builder()
                .ticketCode(generateTicketCode())
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .issueType(request.getIssueType())
            .facilityOrAssetName(normalizeOptionalText(request.getFacilityOrAssetName()))
                .location(request.getLocation().trim())
                .status(TicketStatus.OPEN)
                .createdByUserId(currentUser.getId())
                .createdByName(currentUser.getFirstName() + " " + currentUser.getLastName())
                .createdByEmail(currentUser.getEmail())
                .createdAt(now)
                .updatedAt(now)
                .build();

        return ticketRepository.save(ticket);
    }

    @Override
    public SupportTicket updateTicket(String ticketId, TicketUpdateRequest request) {
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            throw new UnauthorizedException("Only admins can update ticket details");
        }

        SupportTicket ticket = findTicket(ticketId);
        ticket.setTitle(request.getTitle().trim());
        ticket.setDescription(request.getDescription().trim());
        ticket.setIssueType(request.getIssueType());
        ticket.setFacilityOrAssetName(normalizeOptionalText(request.getFacilityOrAssetName()));
        ticket.setLocation(request.getLocation().trim());
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    @Override
    public SupportTicket updateTicketStatus(String ticketId, TicketStatusUpdateRequest request) {
        User currentUser = getCurrentUser();
        SupportTicket ticket = findTicket(ticketId);

        if (!canUpdateStatus(ticket, currentUser, request.getStatus())) {
            throw new UnauthorizedException("You are not allowed to change this ticket status");
        }

        if (!isValidTransition(ticket.getStatus(), request.getStatus())) {
            throw new IllegalArgumentException("Invalid workflow transition: " + ticket.getStatus() + " -> " + request.getStatus());
        }

        if (request.getStatus() == TicketStatus.RESOLVED) {
            String notes = request.getResolutionNotes() == null ? "" : request.getResolutionNotes().trim();
            if (notes.isEmpty()) {
                throw new IllegalArgumentException("Resolution notes are required when setting status to RESOLVED");
            }
            ticket.setResolutionNotes(notes);
            ticket.setResolvedAt(LocalDateTime.now());
        }

        if (request.getStatus() == TicketStatus.CLOSED) {
            ticket.setClosedAt(LocalDateTime.now());
        }

        if (request.getStatus() == TicketStatus.REJECTED) {
            ticket.setRejectedAt(LocalDateTime.now());
        }

        ticket.setStatus(request.getStatus());
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    @Override
    public void deleteTicket(String ticketId) {
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            throw new UnauthorizedException("Only admins can delete tickets");
        }
        SupportTicket ticket = findTicket(ticketId);
        ticketRepository.delete(ticket);
    }

    @Override
    public SupportTicket addResponse(String ticketId, TicketResponseCreateRequest request) {
        User currentUser = getCurrentUser();
        SupportTicket ticket = findTicket(ticketId);

        if (!isAdmin(currentUser) && !ticket.getCreatedByUserId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only respond to your own tickets");
        }

        LocalDateTime now = LocalDateTime.now();
        TicketResponse response = TicketResponse.builder()
                .id(UUID.randomUUID().toString())
                .message(request.getMessage().trim())
                .createdByUserId(currentUser.getId())
                .createdByName(currentUser.getFirstName() + " " + currentUser.getLastName())
                .createdByRole(currentUser.getRole())
                .createdAt(now)
                .updatedAt(now)
                .build();

        ticket.getResponses().add(response);
        ticket.setUpdatedAt(now);
        return ticketRepository.save(ticket);
    }

    @Override
    public SupportTicket updateResponse(String ticketId, String responseId, TicketResponseUpdateRequest request) {
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            throw new UnauthorizedException("Only admins can update responses");
        }

        SupportTicket ticket = findTicket(ticketId);
        TicketResponse response = findResponse(ticket, responseId);
        response.setMessage(request.getMessage().trim());
        response.setUpdatedAt(LocalDateTime.now());

        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    @Override
    public SupportTicket deleteResponse(String ticketId, String responseId) {
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            throw new UnauthorizedException("Only admins can delete responses");
        }

        SupportTicket ticket = findTicket(ticketId);
        ticket.getResponses().removeIf(response -> response.getId().equals(responseId));
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new UnauthorizedException("No authenticated user found");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));
    }

    private SupportTicket findTicket(String ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + ticketId));
    }

    private TicketResponse findResponse(SupportTicket ticket, String responseId) {
        return ticket.getResponses().stream()
                .filter(response -> response.getId().equals(responseId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Ticket response not found with ID: " + responseId));
    }

    private void validateTicketAccess(SupportTicket ticket, User user) {
        if (!isAdmin(user) && !ticket.getCreatedByUserId().equals(user.getId())) {
            throw new UnauthorizedException("You can only view your own tickets");
        }
    }

    private boolean canUpdateStatus(SupportTicket ticket, User user, TicketStatus nextStatus) {
        if (isAdmin(user)) {
            return true;
        }
        return ticket.getCreatedByUserId().equals(user.getId()) && nextStatus == TicketStatus.CLOSED;
    }

    private boolean isAdmin(User user) {
        return user.getRole() == Role.ADMIN;
    }

    private boolean isValidTransition(TicketStatus currentStatus, TicketStatus nextStatus) {
        if (currentStatus == nextStatus) {
            return true;
        }

        if (currentStatus == TicketStatus.OPEN) {
            return nextStatus == TicketStatus.RESOLVED || nextStatus == TicketStatus.REJECTED;
        }

        if (currentStatus == TicketStatus.RESOLVED) {
            return nextStatus == TicketStatus.CLOSED;
        }

        return false;
    }

    private String generateTicketCode() {
        String code;
        do {
            code = "TCK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (ticketRepository.existsByTicketCode(code));
        return code;
    }

    private String normalizeOptionalText(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
