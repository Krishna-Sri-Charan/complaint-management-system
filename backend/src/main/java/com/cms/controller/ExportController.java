package com.cms.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.service.ExcelExportService;

@RestController
@RequestMapping("/api/v1/export")
@PreAuthorize("hasRole('ADMIN')")
public class ExportController {

    @Autowired
    private ExcelExportService
            excelExportService;

    @GetMapping("/complaints")
    public ResponseEntity<InputStreamResource> exportComplaints()
            throws IOException {

        ByteArrayInputStream file =
                excelExportService
                        .exportComplaints();

        return ResponseEntity.ok()

                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=complaints.xlsx"
                )

                .contentType(
                        MediaType.APPLICATION_OCTET_STREAM
                )

                .body(
                        new InputStreamResource(file)
                );
    }
}