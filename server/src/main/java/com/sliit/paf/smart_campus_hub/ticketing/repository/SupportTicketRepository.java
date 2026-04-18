package com.sliit.paf.smart_campus_hub.ticketing.repository;

import com.sliit.paf.smart_campus_hub.ticketing.entity.SupportTicket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends MongoRepository<SupportTicket, String> {
    List<SupportTicket> findAllByOrderByCreatedAtDesc();
    List<SupportTicket> findByCreatedByUserIdOrderByCreatedAtDesc(String createdByUserId);
    boolean existsByTicketCode(String ticketCode);
}
