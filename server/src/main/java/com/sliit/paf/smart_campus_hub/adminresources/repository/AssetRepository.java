package com.sliit.paf.smart_campus_hub.adminresources.repository;

import com.sliit.paf.smart_campus_hub.adminresources.entity.Asset;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetRepository extends MongoRepository<Asset, String> {
    boolean existsByAssetId(String assetId);
    boolean existsByAssetIdAndIdNot(String assetId, String id);
}
