package com.sliit.paf.smart_campus_hub.adminresources.service;

import com.sliit.paf.smart_campus_hub.adminresources.dto.AssetRequest;
import com.sliit.paf.smart_campus_hub.adminresources.dto.FacilityRequest;
import com.sliit.paf.smart_campus_hub.adminresources.dto.ResourceRequestPayload;
import com.sliit.paf.smart_campus_hub.adminresources.entity.Asset;
import com.sliit.paf.smart_campus_hub.adminresources.entity.Facility;
import com.sliit.paf.smart_campus_hub.adminresources.entity.ResourceRequestRecord;

import java.util.List;

public interface AdminResourceService {
    List<Facility> getAllFacilities();
    Facility createFacility(FacilityRequest request);
    Facility updateFacility(String id, FacilityRequest request);
    void deleteFacility(String id);

    List<Asset> getAllAssets();
    Asset createAsset(AssetRequest request);
    Asset updateAsset(String id, AssetRequest request);
    void deleteAsset(String id);

    List<ResourceRequestRecord> getAllResourceRequests();
    ResourceRequestRecord createResourceRequest(ResourceRequestPayload request);
    ResourceRequestRecord updateResourceRequest(String id, ResourceRequestPayload request);
    void deleteResourceRequest(String id);
}
