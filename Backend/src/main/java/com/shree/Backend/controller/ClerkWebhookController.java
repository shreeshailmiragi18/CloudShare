package com.shree.Backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shree.Backend.dto.ProfileDto;
import com.shree.Backend.service.ProfileService;
import com.shree.Backend.service.UserCreditsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;



@CrossOrigin
@RestController
@RequestMapping("/webhooks")
@RequiredArgsConstructor
@Slf4j
public class ClerkWebhookController {

    @Value("${clerk.webhook.secret}")
    private String webhookSecret;

    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;




    @PostMapping("/clerk")
    public ResponseEntity<?> handleClerkWebhook(@RequestHeader(value = "svix-id") String svixId,
                                                @RequestHeader(value = "svix-timestamp") String svixTimestamp,
                                                @RequestHeader(value = "svix-signature") String svixSignature,
                                                @RequestBody String payload ){
        log.info("🔥 Webhook HIT!");
        log.info("Headers -> id: {}, timestamp: {}, signature: {}", svixId, svixTimestamp, svixSignature);
        log.info("Payload -> {}", payload);

        try{
            boolean isValid = verifyWebhookSignature(svixId,svixTimestamp,svixSignature,payload);
            if(!isValid){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid signature");
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(payload);
            String eventType = rootNode.path("type").asText();
            log.info("📌 Event Type: {}", eventType);

            switch (eventType){
                case "user.created":
                    handleUserCreated(rootNode.path("data"));
                    break;
                case "user.updated":
                    handleUserUpdated(rootNode.path("data"));
                    break;
                case "user.deleted":
                    handleUserDeleted(rootNode.path("data"));
                    break;
            }
            return ResponseEntity.ok().build();
        }catch(Exception e){
            e.printStackTrace();   // 🔥 IMPORTANT
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }

    }


    private void handleUserDeleted(JsonNode data) {
        String clerkId = data.path("id").asText();

        profileService.deleteProfile(clerkId);
    }


    private void handleUserUpdated(JsonNode data) {
        String clerkId = data.path("id").asText();

        String email = "";
        JsonNode emailAddresses = data.path("email_addresses");
        if(emailAddresses.isArray() && !emailAddresses.isEmpty()){
            email = emailAddresses.get(0).path("email_address").asText();
        }
        String firstName = data.path("first_name").asText("");
        String lastName = data.path("last_name").asText("");
        String photoUrl = data.path("image_url").asText("");

        ProfileDto updatedProfile = ProfileDto.builder()
                .clerkId(clerkId)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .photoUrl(photoUrl)
                .build();

       updatedProfile =  profileService.updateProfile(updatedProfile);
       if(updatedProfile == null){
           handleUserCreated(data);
       }

    }

    private void handleUserCreated(JsonNode data) {
        String clerkId = data.path("id").asText();

        String email = "";
        JsonNode emailAddresses = data.path("email_addresses");
        if(emailAddresses.isArray() && !emailAddresses.isEmpty()){
            email = emailAddresses.get(0).path("email_address").asText();

        }

        String firstName = data.path("first_name").asText("");
        String lastName = data.path("last_name").asText("");
        String photoUrl = data.path("image_url").asText("");

        ProfileDto newProfile = ProfileDto.builder()
                .clerkId(clerkId)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .photoUrl(photoUrl)
                .build();

        profileService.createProfile(newProfile);
        userCreditsService.createInitialCredits(clerkId);
    }


    private boolean verifyWebhookSignature(String svixId, String svixTimestamp, String svixSignature, String payload) {
        return true;
    }
}
