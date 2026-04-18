package com.sliit.paf.smart_campus_hub.ticketing.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "support_tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportTicket {
    @Id
    private String id;

    @Indexed(unique = true)
    private String ticketCode;

    private String title;
    private String description;
    private TicketIssueType issueType;
    private String facilityOrAssetName;
    private String location;

    private TicketStatus status;
    private String resolutionNotes;

    private String createdByUserId;
    private String createdByName;
    private String createdByEmail;

    @Builder.Default
    private List<TicketResponse> responses = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    private LocalDateTime rejectedAt;
}
