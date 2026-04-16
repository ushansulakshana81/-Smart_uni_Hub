package com.sliit.paf.smart_campus_hub.adminresources.repository;

import com.sliit.paf.smart_campus_hub.adminresources.entity.ResourceRequestRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRequestRepository extends MongoRepository<ResourceRequestRecord, String> {
	boolean existsByRequestId(String requestId);
}
