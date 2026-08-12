package com.shree.Backend.controller;

import com.shree.Backend.documents.UserCreditsDocument;
import com.shree.Backend.dto.FileMetadataDTO;
import com.shree.Backend.service.FileMetadataService;
import com.shree.Backend.service.UserCreditsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> download(@PathVariable String id) throws IOException {
        log.info("reached download controller");
        FileMetadataDTO downloadableFile = fileMetadataService.getDownloadableFile(id);
        Path path = Paths.get(downloadableFile.getFileLocation());
        Resource resource = new UrlResource(path.toUri());
        //replace file name which Contains unsupported Unicode character which are not supported in header
        String filename = downloadableFile.getName()
                .replaceAll("[^\\x20-\\x7E]", "");
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=\"" +filename+"\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable String id){
        log.info("reached deleteFile controller");
        fileMetadataService.deleteFile(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> togglePublic(@PathVariable String id){
        log.info("reached togglePublicFile controller");
        FileMetadataDTO file = fileMetadataService.togglePublic(id);
        log.info("file with id: "+ id + "toggled to " +file.getIsPublic());
        return ResponseEntity.ok(file);
    }
}
