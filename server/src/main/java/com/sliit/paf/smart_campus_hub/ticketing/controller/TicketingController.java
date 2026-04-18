package com.sliit.paf.smart_campus_hub.ticketing.controller;

import com.sliit.paf.smart_campus_hub.ticketing.dto.TicketCreateRequest;
import com.sliit.paf.smart_campus_hub.ticketing.dto.TicketResponseCreateRequest;
import com.sliit.paf.smart_campus_hub.ticketing.dto.TicketResponseUpdateRequest;
import com.sliit.paf.smart_campus_hub.ticketing.dto.TicketStatusUpdateRequest;
import com.sliit.paf.smart_campus_hub.ticketing.dto.TicketUpdateRequest;
import com.sliit.paf.smart_campus_hub.ticketing.service.TicketingService;
import com.sliit.paf.smart_campus_hub.usermanagement.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class TicketingController {

    private final TicketingService ticketingService;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getTickets() {
        return ResponseEntity.ok(new ApiResponse(true, "Tickets retrieved successfully", ticketingService.getTicketsForCurrentUser()));
    }

    @GetMapping("/{ticketId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getTicketById(@PathVariable String ticketId) {
        return ResponseEntity.ok(new ApiResponse(true, "Ticket retrieved successfully", ticketingService.getTicketById(ticketId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> createTicket(@Valid @RequestBody TicketCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Ticket created successfully", ticketingService.createTicket(request)));
    }

    @PutMapping("/{ticketId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateTicket(@PathVariable String ticketId, @Valid @RequestBody TicketUpdateRequest request) {
        return ResponseEntity.ok(new ApiResponse(true, "Ticket updated successfully", ticketingService.updateTicket(ticketId, request)));
    }

    @PatchMapping("/{ticketId}/status")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateTicketStatus(@PathVariable String ticketId, @Valid @RequestBody TicketStatusUpdateRequest request) {
        return ResponseEntity.ok(new ApiResponse(true, "Ticket status updated successfully", ticketingService.updateTicketStatus(ticketId, request)));
    }

    @DeleteMapping("/{ticketId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteTicket(@PathVariable String ticketId) {
        ticketingService.deleteTicket(ticketId);
        return ResponseEntity.ok(new ApiResponse(true, "Ticket deleted successfully"));
    }

    @PostMapping("/{ticketId}/responses")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addResponse(@PathVariable String ticketId, @Valid @RequestBody TicketResponseCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Ticket response added successfully", ticketingService.addResponse(ticketId, request)));
    }

    @PutMapping("/{ticketId}/responses/{responseId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateResponse(
            @PathVariable String ticketId,
            @PathVariable String responseId,
            @Valid @RequestBody TicketResponseUpdateRequest request) {
        return ResponseEntity.ok(new ApiResponse(true, "Ticket response updated successfully", ticketingService.updateResponse(ticketId, responseId, request)));
    }

    @DeleteMapping("/{ticketId}/responses/{responseId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteResponse(@PathVariable String ticketId, @PathVariable String responseId) {
        return ResponseEntity.ok(new ApiResponse(true, "Ticket response deleted successfully", ticketingService.deleteResponse(ticketId, responseId)));
    }
}
