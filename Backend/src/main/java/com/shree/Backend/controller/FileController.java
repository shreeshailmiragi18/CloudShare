package com.shree.Backend.controller;

import com.shree.Backend.documents.UserCreditsDocument;
import com.shree.Backend.dto.FileMetadataDTO;
import com.shree.Backend.service.FileMetadataService;
import com.shree.Backend.service.UserCreditsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
@Slf4j
public class FileController {
    private final FileMetadataService fileMetadataService;
    private final UserCreditsService userCreditsService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFiles(@RequestPart("files")MultipartFile[] files) throws IOException {
        log.info("reached file upload controller");
        String userClerkId = SecurityContextHolder.getContext().getAuthentication().getName();
        Map<String,Object> response = new HashMap<>();
       List<FileMetadataDTO> list =  fileMetadataService.uploadFiles(files);
       UserCreditsDocument finalCredits = userCreditsService.getUserCredits();
       response.put("files",list);
       response.put("remainingCredits",finalCredits.getCredits());
       log.info(userClerkId+" file uploaded successfully,"+"remainingCredits: "+finalCredits.getCredits());
       return ResponseEntity.ok(response);
    }

    @GetMapping("/my-files")
    public ResponseEntity<?> getFilesForCurrentUser(){
        log.info("reached the getFilesForCurrentUser(read all files) controller");
       List<FileMetadataDTO> files = fileMetadataService.getFile();
       return ResponseEntity.ok(files);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<?> getPublicFile(@PathVariable String id){
        log.info("reached getPublicFile controller");
        FileMetadataDTO file = fileMetadataService.getPublicFile(id);
        return ResponseEntity.ok(file);
    }
}
