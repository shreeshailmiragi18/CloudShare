package com.shree.Backend.service;

import com.shree.Backend.documents.UserCreditsDocument;
import com.shree.Backend.repository.UserCreditsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCreditsService {

    private final UserCreditsRepository userCreditsRepository;

    public UserCreditsDocument createInitialCredits(String clerkId) {
        UserCreditsDocument userCredits = UserCreditsDocument.builder()
                .clerkId(clerkId)
                .credits(5)
                .plan("BASIC")
                .build();

        userCreditsRepository.save(userCredits);

        return UserCreditsDocument.builder()
                .id(userCredits.getId())
                .clerkId(userCredits.getClerkId())
                .credits(userCredits.getCredits())
                .plan(userCredits.getPlan())
                .build();
    }

}
