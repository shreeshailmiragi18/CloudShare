package com.shree.Backend.service;

import com.shree.Backend.documents.FileMetadataDocument;
import com.shree.Backend.documents.ProfileDocument;
import com.shree.Backend.dto.FileMetadataDTO;
import com.shree.Backend.repository.FileMetadataRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileMetadataService {
    private final FileMetadataRepository fileMetadataRepository;
    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;
    List<FileMetadataDocument> savedFiles = new ArrayList<>();

    public List<FileMetadataDTO> uploadFiles(MultipartFile files[]) throws IOException {
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        if(!userCreditsService.hasEnoughCredits(files.length)){
            log.warn("user credit not enough");
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
        log.info("reached getFile service");
        ProfileDocument currentProfile = profileService.getCurrentProfile();
       List<FileMetadataDocument> files =  fileMetadataRepository.findByClerkId(currentProfile.getClerkId());
       return files.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public FileMetadataDTO getPublicFile(String id){
        log.info("reached getPublicFile Service");
        Optional<FileMetadataDocument> fileOptional = fileMetadataRepository.findById(id);
        if(fileOptional.isEmpty() || !fileOptional.get().getIsPublic()){
            log.warn("trying to access the private file");
            throw new RuntimeException("Unable to get the file");
        }

        FileMetadataDocument document =  fileOptional.get();
        log.info("returned the public file with Id : "+ document.getId());
        return mapToDTO(document);
    }

    public FileMetadataDTO getDownloadableFile(String id){
        log.info("reached getDownloadableFile Service");
        FileMetadataDocument file = fileMetadataRepository.findById(id).orElseThrow(()-> new RuntimeException("File not found"));
        return mapToDTO(file);
    }

    public void deleteFile(String id){
        log.info("reached deleteFile Service");
        try{
            ProfileDocument currentProfile = profileService.getCurrentProfile();
            FileMetadataDocument file = fileMetadataRepository.findById(id)
                    .orElseThrow(()-> new RuntimeException("file not found"));
            if(!file.getClerkId().equals(currentProfile.getClerkId())){
                log.warn("trying to delete the others file");
                throw new RuntimeException("cannot delete file");
            }

            Path filePath = Paths.get(file.getFileLocation());
            Files.deleteIfExists(filePath);

            fileMetadataRepository.deleteById(id);
        } catch (IOException e) {
            throw new RuntimeException("Error deleting file");
        }
    }


    public FileMetadataDTO togglePublic(String id) {
            log.info("reached togglePublicFile Service");
            FileMetadataDocument file = fileMetadataRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("File not found"));

            Authentication authentication =
                    SecurityContextHolder.getContext().getAuthentication();

            String currentClerkId = authentication.getName();

            if (!file.getClerkId().equals(currentClerkId)) {
                log.warn ("unauthorized user trying to toggle with id :" +currentClerkId);
                throw new AccessDeniedException("You do not own this file");
            }

            file.setIsPublic(!file.getIsPublic());

            fileMetadataRepository.save(file);

            return mapToDTO(file);
    }

}
