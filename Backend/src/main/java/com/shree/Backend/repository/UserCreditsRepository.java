package com.shree.Backend.repository;

import com.shree.Backend.documents.UserCreditsDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCreditsRepository extends MongoRepository<UserCreditsDocument, String> {
    Optional<UserCreditsDocument> findByClerkId(String clerkId);
}
