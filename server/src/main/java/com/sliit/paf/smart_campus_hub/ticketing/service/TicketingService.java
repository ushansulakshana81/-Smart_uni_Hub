package com.sliit.paf.smart_campus_hub.ticketing.service;

import com.sliit.paf.smart_campus_hub.ticketing.dto.TicketCreateRequest;
import com.sliit.paf.smart_campus_hub.ticketing.dto.TicketResponseCreateRequest;
import com.sliit.paf.smart_campus_hub.ticketing.dto.TicketResponseUpdateRequest;
import com.sliit.paf.smart_campus_hub.ticketing.dto.TicketStatusUpdateRequest;
import com.sliit.paf.smart_campus_hub.ticketing.dto.TicketUpdateRequest;
import com.sliit.paf.smart_campus_hub.ticketing.entity.SupportTicket;

import java.util.List;

public interface TicketingService {
    List<SupportTicket> getTicketsForCurrentUser();
    SupportTicket getTicketById(String ticketId);
    SupportTicket createTicket(TicketCreateRequest request);
    SupportTicket updateTicket(String ticketId, TicketUpdateRequest request);
    SupportTicket updateTicketStatus(String ticketId, TicketStatusUpdateRequest request);
    void deleteTicket(String ticketId);

    SupportTicket addResponse(String ticketId, TicketResponseCreateRequest request);
    SupportTicket updateResponse(String ticketId, String responseId, TicketResponseUpdateRequest request);
    SupportTicket deleteResponse(String ticketId, String responseId);
}
