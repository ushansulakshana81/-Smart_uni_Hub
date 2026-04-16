package com.sliit.paf.smart_campus_hub.usermanagement.controller;

import com.sliit.paf.smart_campus_hub.adminresources.dto.AssetRequest;
import com.sliit.paf.smart_campus_hub.adminresources.dto.FacilityRequest;
import com.sliit.paf.smart_campus_hub.adminresources.dto.ResourceRequestPayload;
import com.sliit.paf.smart_campus_hub.adminresources.service.AdminResourceService;
import com.sliit.paf.smart_campus_hub.usermanagement.dto.ApiResponse;
import com.sliit.paf.smart_campus_hub.usermanagement.dto.UserDTO;
import com.sliit.paf.smart_campus_hub.usermanagement.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    private final UserService userService;
    private final AdminResourceService adminResourceService;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAllUsers() {
        log.info("Get all users endpoint called");
        try {
            List<UserDTO> users = userService.getAllUsers();
            return ResponseEntity.ok(new ApiResponse(true, "Users retrieved successfully", users));
        } catch (Exception e) {
            log.error("Get all users error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/users/{userId}/suspend")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> suspendUser(@PathVariable String userId) {
        log.info("Suspend user endpoint called for ID: {}", userId);
        try {
            userService.suspendUser(userId);
            return ResponseEntity.ok(new ApiResponse(true, "User suspended successfully"));
        } catch (Exception e) {
            log.error("Suspend user error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/users/{userId}/unsuspend")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> unsuspendUser(@PathVariable String userId) {
        log.info("Unsuspend user endpoint called for ID: {}", userId);
        try {
            userService.unsuspendUser(userId);
            return ResponseEntity.ok(new ApiResponse(true, "User unsuspended successfully"));
        } catch (Exception e) {
            log.error("Unsuspend user error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable String userId) {
        log.info("Delete user endpoint called for ID: {}", userId);
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok(new ApiResponse(true, "User deleted successfully"));
        } catch (Exception e) {
            log.error("Delete user error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/users/role/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAllAdmins() {
        log.info("Get all admins endpoint called");
        try {
            List<UserDTO> admins = userService.getAllAdmins();
            return ResponseEntity.ok(new ApiResponse(true, "Admins retrieved successfully", admins));
        } catch (Exception e) {
            log.error("Get all admins error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/facilities")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAllFacilities() {
        return ResponseEntity.ok(new ApiResponse(true, "Facilities retrieved successfully", adminResourceService.getAllFacilities()));
    }

    @PostMapping("/facilities")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> createFacility(@Valid @RequestBody FacilityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Facility created successfully", adminResourceService.createFacility(request)));
    }

    @PutMapping("/facilities/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateFacility(@PathVariable String id, @Valid @RequestBody FacilityRequest request) {
        return ResponseEntity.ok(new ApiResponse(true, "Facility updated successfully", adminResourceService.updateFacility(id, request)));
    }

    @DeleteMapping("/facilities/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteFacility(@PathVariable String id) {
        adminResourceService.deleteFacility(id);
        return ResponseEntity.ok(new ApiResponse(true, "Facility deleted successfully"));
    }

    @GetMapping("/assets")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAllAssets() {
        return ResponseEntity.ok(new ApiResponse(true, "Assets retrieved successfully", adminResourceService.getAllAssets()));
    }

    @PostMapping("/assets")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> createAsset(@Valid @RequestBody AssetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Asset created successfully", adminResourceService.createAsset(request)));
    }

    @PutMapping("/assets/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateAsset(@PathVariable String id, @Valid @RequestBody AssetRequest request) {
        return ResponseEntity.ok(new ApiResponse(true, "Asset updated successfully", adminResourceService.updateAsset(id, request)));
    }

    @DeleteMapping("/assets/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteAsset(@PathVariable String id) {
        adminResourceService.deleteAsset(id);
        return ResponseEntity.ok(new ApiResponse(true, "Asset deleted successfully"));
    }

    @GetMapping("/resource-requests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAllResourceRequests() {
        return ResponseEntity.ok(new ApiResponse(true, "Resource requests retrieved successfully", adminResourceService.getAllResourceRequests()));
    }

    @PostMapping("/resource-requests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> createResourceRequest(@Valid @RequestBody ResourceRequestPayload request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Resource request created successfully", adminResourceService.createResourceRequest(request)));
    }

    @PutMapping("/resource-requests/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateResourceRequest(@PathVariable String id, @Valid @RequestBody ResourceRequestPayload request) {
        return ResponseEntity.ok(new ApiResponse(true, "Resource request updated successfully", adminResourceService.updateResourceRequest(id, request)));
    }

    @DeleteMapping("/resource-requests/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteResourceRequest(@PathVariable String id) {
        adminResourceService.deleteResourceRequest(id);
        return ResponseEntity.ok(new ApiResponse(true, "Resource request deleted successfully"));
    }
}
