package com.shree.Backend.repository;

import com.shree.Backend.documents.UserCreditsDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserCreditsRepository extends MongoRepository<UserCreditsDocument, String> {


}
