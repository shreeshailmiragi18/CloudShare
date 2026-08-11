package com.shree.Backend.service;

import com.shree.Backend.documents.FileMetadataDocument;
import com.shree.Backend.documents.ProfileDocument;
import com.shree.Backend.dto.FileMetadataDTO;
import com.shree.Backend.repository.FileMetadataRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileMetadataService {
    private final FileMetadataRepository fileMetadataRepository;
    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;
    List<FileMetadataDocument> savedFiles = new ArrayList<>();

    public List<FileMetadataDTO> uploadFiles(MultipartFile files[]) throws IOException {
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        if(!userCreditsService.hasEnoughCredits(files.length)){
            throw new RuntimeException("Not enough credits to upload files. Please purchase the plans");
        }

        Path uploadPath = Paths.get("upload").toAbsolutePath().normalize();
        Files. createDirectories(uploadPath);

        for(MultipartFile file : files){
           String fileName =  UUID.randomUUID()+"."+ StringUtils.getFilenameExtension(file.getOriginalFilename());
           Path targetLocation = uploadPath.resolve(fileName);
           Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

           FileMetadataDocument fileMetadataDocument = FileMetadataDocument.builder()
                   .fileLocation(targetLocation.toString())
                   .name(file.getOriginalFilename())
                   .size(file.getSize())
                   .type(file.getContentType())
                   .clerkId(currentProfile.getClerkId())
                   .isPublic(false)
                   .uploadedAt(LocalDateTime.now())
                   .build();

           userCreditsService.consumeCredit();

           savedFiles.add(fileMetadataRepository.save(fileMetadataDocument));

        }
        return savedFiles.stream().map(fileMetadataDocument -> mapToDTO(fileMetadataDocument))
                .collect(Collectors.toList());
    }

    private FileMetadataDTO mapToDTO(@NonNull  FileMetadataDocument fileMetadataDocument) {
        return  FileMetadataDTO.builder()
                .id(fileMetadataDocument.getId())
                .fileLocation(fileMetadataDocument.getFileLocation())
                .name(fileMetadataDocument.getName())
                .size(fileMetadataDocument.getSize())
                .type(fileMetadataDocument.getType())
                .clerkId(fileMetadataDocument.getClerkId())
                .isPublic(fileMetadataDocument.getIsPublic())
                .uploadedAt(fileMetadataDocument.getUploadedAt())
                .build();
    }

    public List<FileMetadataDTO> getFile(){
        ProfileDocument currentProfile = profileService.getCurrentProfile();
       List<FileMetadataDocument> files =  fileMetadataRepository.findByClerkId(currentProfile.getClerkId());
       return files.stream().map(this::mapToDTO).collect(Collectors.toList());


    }
}
