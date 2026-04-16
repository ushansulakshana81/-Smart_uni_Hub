package com.sliit.paf.smart_campus_hub.adminresources.service.impl;

import com.sliit.paf.smart_campus_hub.adminresources.dto.AssetRequest;
import com.sliit.paf.smart_campus_hub.adminresources.dto.FacilityRequest;
import com.sliit.paf.smart_campus_hub.adminresources.dto.ResourceRequestPayload;
import com.sliit.paf.smart_campus_hub.adminresources.entity.Asset;
import com.sliit.paf.smart_campus_hub.adminresources.entity.Facility;
import com.sliit.paf.smart_campus_hub.adminresources.entity.ResourceRequestRecord;
import com.sliit.paf.smart_campus_hub.adminresources.repository.AssetRepository;
import com.sliit.paf.smart_campus_hub.adminresources.repository.FacilityRepository;
import com.sliit.paf.smart_campus_hub.adminresources.repository.ResourceRequestRepository;
import com.sliit.paf.smart_campus_hub.adminresources.service.AdminResourceService;
import com.sliit.paf.smart_campus_hub.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminResourceServiceImpl implements AdminResourceService {

    private final FacilityRepository facilityRepository;
    private final AssetRepository assetRepository;
    private final ResourceRequestRepository resourceRequestRepository;

    @Override
    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    @Override
    public Facility createFacility(FacilityRequest request) {
        Facility facility = Facility.builder()
                .fId(generateFacilityId())
                .facilityName(request.getFacilityName())
                .type(request.getType())
                .location(request.getLocation())
                .capacity(request.getCapacity())
                .availability(request.getAvailability())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return facilityRepository.save(facility);
    }

    @Override
    public Facility updateFacility(String id, FacilityRequest request) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with ID: " + id));

        facility.setFacilityName(request.getFacilityName());
        facility.setType(request.getType());
        facility.setLocation(request.getLocation());
        facility.setCapacity(request.getCapacity());
        facility.setAvailability(request.getAvailability());
        facility.setUpdatedAt(LocalDateTime.now());

        return facilityRepository.save(facility);
    }

    @Override
    public void deleteFacility(String id) {
        if (!facilityRepository.existsById(id)) {
            throw new ResourceNotFoundException("Facility not found with ID: " + id);
        }
        facilityRepository.deleteById(id);
    }

    @Override
    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    @Override
    public Asset createAsset(AssetRequest request) {
        Asset asset = Asset.builder()
                .assetId(generateAssetId())
                .name(request.getName())
                .category(request.getCategory())
                .location(request.getLocation())
                .status(request.getStatus())
                .condition(request.getCondition())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return assetRepository.save(asset);
    }

    @Override
    public Asset updateAsset(String id, AssetRequest request) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with ID: " + id));

        asset.setName(request.getName());
        asset.setCategory(request.getCategory());
        asset.setLocation(request.getLocation());
        asset.setStatus(request.getStatus());
        asset.setCondition(request.getCondition());
        asset.setUpdatedAt(LocalDateTime.now());

        return assetRepository.save(asset);
    }

    @Override
    public void deleteAsset(String id) {
        if (!assetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Asset not found with ID: " + id);
        }
        assetRepository.deleteById(id);
    }

    @Override
    public List<ResourceRequestRecord> getAllResourceRequests() {
        return resourceRequestRepository.findAll();
    }

    @Override
    public ResourceRequestRecord createResourceRequest(ResourceRequestPayload request) {
        ResourceRequestRecord record = ResourceRequestRecord.builder()
                .requestId(generateResourceRequestId())
                .resourceType(request.getResourceType())
                .facilityOrAsset(request.getFacilityOrAsset())
                .date(request.getDate())
                .time(request.getTime())
                .purpose(request.getPurpose())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return resourceRequestRepository.save(record);
    }

    @Override
    public ResourceRequestRecord updateResourceRequest(String id, ResourceRequestPayload request) {
        ResourceRequestRecord record = resourceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource request not found with ID: " + id));

        record.setResourceType(request.getResourceType());
        record.setFacilityOrAsset(request.getFacilityOrAsset());
        record.setDate(request.getDate());
        record.setTime(request.getTime());
        record.setPurpose(request.getPurpose());
        record.setUpdatedAt(LocalDateTime.now());

        return resourceRequestRepository.save(record);
    }

    @Override
    public void deleteResourceRequest(String id) {
        if (!resourceRequestRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resource request not found with ID: " + id);
        }
        resourceRequestRepository.deleteById(id);
    }

    private String generateFacilityId() {
        String id;
        do {
            id = "FAC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (facilityRepository.existsByFId(id));
        return id;
    }

    private String generateAssetId() {
        String id;
        do {
            id = "AST-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (assetRepository.existsByAssetId(id));
        return id;
    }

    private String generateResourceRequestId() {
        String id;
        do {
            id = "REQ-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (resourceRequestRepository.existsByRequestId(id));
        return id;
    }
}
