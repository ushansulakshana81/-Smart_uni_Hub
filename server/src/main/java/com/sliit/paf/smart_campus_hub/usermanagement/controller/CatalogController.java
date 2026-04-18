package com.sliit.paf.smart_campus_hub.usermanagement.controller;

import com.sliit.paf.smart_campus_hub.adminresources.entity.Asset;
import com.sliit.paf.smart_campus_hub.adminresources.entity.Facility;
import com.sliit.paf.smart_campus_hub.adminresources.repository.AssetRepository;
import com.sliit.paf.smart_campus_hub.adminresources.repository.FacilityRepository;
import com.sliit.paf.smart_campus_hub.usermanagement.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/catalog")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class CatalogController {

    private final FacilityRepository facilityRepository;
    private final AssetRepository assetRepository;

    @GetMapping("/facilities")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getFacilities() {
        try {
            List<Facility> facilities = facilityRepository.findAll();
            return ResponseEntity.ok(new ApiResponse(true, "Facilities retrieved successfully", facilities));
        } catch (Exception e) {
            log.error("Get catalog facilities error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/assets")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAssets() {
        try {
            List<Asset> assets = assetRepository.findAll();
            return ResponseEntity.ok(new ApiResponse(true, "Assets retrieved successfully", assets));
        } catch (Exception e) {
            log.error("Get catalog assets error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}