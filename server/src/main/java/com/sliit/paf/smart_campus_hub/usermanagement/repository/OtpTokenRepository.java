package com.sliit.paf.smart_campus_hub.usermanagement.repository;

import com.sliit.paf.smart_campus_hub.usermanagement.entity.OtpToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpTokenRepository extends MongoRepository<OtpToken, String> {
    Optional<OtpToken> findByEmail(String email);
    void deleteByEmail(String email);
}
