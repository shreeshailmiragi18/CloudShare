package com.shree.Backend.controller;

import com.shree.Backend.documents.UserCreditsDocument;
import com.shree.Backend.dto.FileMetadataDTO;
import com.shree.Backend.service.FileMetadataService;
import com.shree.Backend.service.UserCreditsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
public class FileController {
    private final FileMetadataService fileMetadataService;
    private final UserCreditsService userCreditsService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFiles(@RequestPart("files")MultipartFile[] files) throws IOException {
        System.out.println("reached file controller");
        Map<String,Object> response = new HashMap<>();
       List<FileMetadataDTO> list =  fileMetadataService.uloadFiles(files);
       UserCreditsDocument finalCredits = userCreditsService.getUserCredits();
       response.put("files",list);
       response.put("remainingCredits",finalCredits.getCredits());
       return ResponseEntity.ok(response);
    }
}
