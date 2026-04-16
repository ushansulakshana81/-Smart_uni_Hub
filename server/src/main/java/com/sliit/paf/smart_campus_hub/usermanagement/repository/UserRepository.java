package com.sliit.paf.smart_campus_hub.usermanagement.repository;

import com.sliit.paf.smart_campus_hub.usermanagement.entity.User;
import com.sliit.paf.smart_campus_hub.usermanagement.entity.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByGoogleId(String googleId);
    List<User> findByRole(Role role);
    boolean existsByEmail(String email);
}
