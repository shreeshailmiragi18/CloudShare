package com.shree.Backend.service;

import com.mongodb.DuplicateKeyException;
import com.shree.Backend.documents.ProfileDocument;
import com.shree.Backend.dto.ProfileDto;

import com.shree.Backend.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileDto createProfile(ProfileDto profileDto) throws DuplicateKeyException {

        ProfileDocument profile = ProfileDocument.builder()
                .clerkId(profileDto.getClerkId())
                .email(profileDto.getEmail())
                .firstName(profileDto.getFirstName())
                .lastName(profileDto.getLastName())
                .credits(5)
                .photoUrl(profileDto.getPhotoUrl())
                .createdAt(Instant.now())
                .build();
       try{
           profile = profileRepository.save(profile);
       } catch (DuplicateKeyException e) {
           throw new RuntimeException("User already exists");
       }


        return ProfileDto.builder()
                .id(profile.getId())
                .clerkId(profile.getClerkId())
                .email(profile.getEmail())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .credits(profile.getCredits())
                .photoUrl(profileDto.getPhotoUrl())
                .createdAt(profile.getCreatedAt())
                .build();
    }
}
