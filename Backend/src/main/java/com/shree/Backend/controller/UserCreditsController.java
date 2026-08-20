package com.shree.Backend.controller;

import com.shree.Backend.documents.UserCreditsDocument;
import com.shree.Backend.dto.UserCreditsDTO;
import com.shree.Backend.service.UserCreditsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserCreditsController {
    private final UserCreditsService userCreditsService;

    @GetMapping("/credits")
    public ResponseEntity<?> getUserCredits(){
        UserCreditsDocument userCredits = userCreditsService.getUserCredits();
       UserCreditsDTO response =  UserCreditsDTO.builder()
                .credits(userCredits.getCredits())
                .plan(userCredits.getPlan())
                .build();

       return ResponseEntity.ok(response);
    }
}
