package com.sliit.paf.smart_campus_hub.adminresources.repository;

import com.sliit.paf.smart_campus_hub.adminresources.entity.Facility;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityRepository extends MongoRepository<Facility, String> {
    boolean existsByFId(String fId);
    boolean existsByFIdAndIdNot(String fId, String id);
}
