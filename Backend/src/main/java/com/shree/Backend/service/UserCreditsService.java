package com.shree.Backend.service;

import com.shree.Backend.documents.UserCreditsDocument;
import com.shree.Backend.repository.UserCreditsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCreditsService {

    private final UserCreditsRepository userCreditsRepository;
    private final ProfileService profileService;

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

    public UserCreditsDocument getUserCredits(String clerkId) {
        return userCreditsRepository.findByClerkId(clerkId)
                .orElseGet(() -> createInitialCredits(clerkId));
    }

    public UserCreditsDocument getUserCredits() {
        String clerkId = profileService.getCurrentProfile().getClerkId();
        return getUserCredits(clerkId);
    }

    public Boolean hasEnoughCredits(int requiredCredits){
        UserCreditsDocument userCredits = getUserCredits();
        return userCredits.getCredits() >= requiredCredits;
    }

    public UserCreditsDocument consumeCredit(){
        UserCreditsDocument userCredits = getUserCredits();
        if(userCredits.getCredits() == null){
            return null;
        }
        userCredits.setCredits(userCredits.getCredits() - 1);
        return userCreditsRepository.save(userCredits);
    }

    public UserCreditsDocument addCredits(String clerkId, int creditsToAdd, String plan){
        UserCreditsDocument userCredits = userCreditsRepository.findByClerkId(clerkId)
                .orElseGet(()-> createInitialCredits(clerkId));
        userCredits.setCredits(userCredits.getCredits() + creditsToAdd);
        userCredits.setPlan(plan);
        return userCreditsRepository.save(userCredits);
    }


}
