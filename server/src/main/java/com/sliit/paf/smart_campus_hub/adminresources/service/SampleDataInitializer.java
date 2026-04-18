package com.sliit.paf.smart_campus_hub.adminresources.service;

import com.sliit.paf.smart_campus_hub.adminresources.entity.Asset;
import com.sliit.paf.smart_campus_hub.adminresources.entity.Facility;
import com.sliit.paf.smart_campus_hub.adminresources.repository.AssetRepository;
import com.sliit.paf.smart_campus_hub.adminresources.repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SampleDataInitializer implements CommandLineRunner {

    private final FacilityRepository facilityRepository;
    private final AssetRepository assetRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if collections are empty
        if (facilityRepository.count() == 0) {
            log.info("Initializing sample facilities data...");
            initializeFacilities();
        }

        if (assetRepository.count() == 0) {
            log.info("Initializing sample assets data...");
            initializeAssets();
        }

        log.info("Sample data initialization completed!");
    }

    private void initializeFacilities() {
        List<Facility> facilities = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        facilities.add(Facility.builder()
                .fId("FAC-" + generateUUID())
                .facilityName("Main Auditorium")
                .type("Auditorium")
                .location("Building A, Ground Floor")
                .capacity(500)
                .availability("Available")
                .createdAt(now)
                .updatedAt(now)
                .build());

        facilities.add(Facility.builder()
                .fId("FAC-" + generateUUID())
                .facilityName("Computer Lab 1")
                .type("Lab")
                .location("Building B, 2nd Floor")
                .capacity(40)
                .availability("Available")
                .createdAt(now)
                .updatedAt(now)
                .build());

        facilities.add(Facility.builder()
                .fId("FAC-" + generateUUID())
                .facilityName("Library - Main Branch")
                .type("Library")
                .location("Building C, 1st & 2nd Floor")
                .capacity(200)
                .availability("Available")
                .createdAt(now)
                .updatedAt(now)
                .build());

        facilities.add(Facility.builder()
                .fId("FAC-" + generateUUID())
                .facilityName("Physics Lab")
                .type("Lab")
                .location("Building D, 3rd Floor")
                .capacity(30)
                .availability("Under Maintenance")
                .createdAt(now)
                .updatedAt(now)
                .build());

        facilities.add(Facility.builder()
                .fId("FAC-" + generateUUID())
                .facilityName("Chemistry Lab")
                .type("Lab")
                .location("Building D, 4th Floor")
                .capacity(35)
                .availability("Available")
                .createdAt(now)
                .updatedAt(now)
                .build());

        facilities.add(Facility.builder()
                .fId("FAC-" + generateUUID())
                .facilityName("Cafeteria")
                .type("Dining")
                .location("Building E, Ground Floor")
                .capacity(300)
                .availability("Available")
                .createdAt(now)
                .updatedAt(now)
                .build());

        facilities.add(Facility.builder()
                .fId("FAC-" + generateUUID())
                .facilityName("Sports Gymnasium")
                .type("Sports")
                .location("Sports Complex, Main Campus")
                .capacity(400)
                .availability("Available")
                .createdAt(now)
                .updatedAt(now)
                .build());

        facilities.add(Facility.builder()
                .fId("FAC-" + generateUUID())
                .facilityName("Meeting Room 1")
                .type("Meeting Room")
                .location("Building A, 5th Floor")
                .capacity(20)
                .availability("Available")
                .createdAt(now)
                .updatedAt(now)
                .build());

        facilityRepository.saveAll(facilities);
        log.info("Saved {} sample facilities", facilities.size());
    }

    private void initializeAssets() {
        List<Asset> assets = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        assets.add(Asset.builder()
                .assetId("AST-" + generateUUID())
                .name("Dell Laptop - ThinkPad X1")
                .category("Computing")
                .location("Building B, Computer Lab 1")
                .status("Active")
                .condition("Good")
                .createdAt(now)
                .updatedAt(now)
                .build());

        assets.add(Asset.builder()
                .assetId("AST-" + generateUUID())
                .name("HP Projector")
                .category("Audio Visual")
                .location("Building A, Main Auditorium")
                .status("Active")
                .condition("Good")
                .createdAt(now)
                .updatedAt(now)
                .build());

        assets.add(Asset.builder()
                .assetId("AST-" + generateUUID())
                .name("Microscope - Zeiss Professional")
                .category("Laboratory Equipment")
                .location("Building D, Biology Lab")
                .status("Active")
                .condition("Excellent")
                .createdAt(now)
                .updatedAt(now)
                .build());

        assets.add(Asset.builder()
                .assetId("AST-" + generateUUID())
                .name("Office Desk Chair")
                .category("Furniture")
                .location("Building A, Admin Office")
                .status("Active")
                .condition("Good")
                .createdAt(now)
                .updatedAt(now)
                .build());

        assets.add(Asset.builder()
                .assetId("AST-" + generateUUID())
                .name("Smart Board 65 inch")
                .category("Audio Visual")
                .location("Building B, Classroom 201")
                .status("Active")
                .condition("Good")
                .createdAt(now)
                .updatedAt(now)
                .build());

        assets.add(Asset.builder()
                .assetId("AST-" + generateUUID())
                .name("Coffee Machine")
                .category("Appliances")
                .location("Building E, Cafeteria")
                .status("Active")
                .condition("Fair")
                .createdAt(now)
                .updatedAt(now)
                .build());

        assets.add(Asset.builder()
                .assetId("AST-" + generateUUID())
                .name("Printer HP M428")
                .category("Computing")
                .location("Building A, Office")
                .status("Active")
                .condition("Good")
                .createdAt(now)
                .updatedAt(now)
                .build());

        facilityRepository.saveAll(new ArrayList<>());
        assetRepository.saveAll(assets);
        log.info("Saved {} sample assets", assets.size());
    }

    private String generateUUID() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
