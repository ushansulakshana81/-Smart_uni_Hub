# Sample Data Initialization - 15 Records

## Overview
A `SampleDataInitializer` service has been created that automatically populates the database with 15 sample records (8 facilities + 7 assets) when the application starts for the first time.

**File Location:** `server/src/main/java/com/sliit/paf/smart_campus_hub/adminresources/service/SampleDataInitializer.java`

---

## Sample Facilities (8 records)

| ID | Name | Type | Location | Capacity | Availability |
|----|------|------|----------|----------|----------------|
| FAC-XXXXXXXX | Main Auditorium | Auditorium | Building A, Ground Floor | 500 | Available |
| FAC-XXXXXXXX | Computer Lab 1 | Lab | Building B, 2nd Floor | 40 | Available |
| FAC-XXXXXXXX | Library - Main Branch | Library | Building C, 1st & 2nd Floor | 200 | Available |
| FAC-XXXXXXXX | Physics Lab | Lab | Building D, 3rd Floor | 30 | Under Maintenance |
| FAC-XXXXXXXX | Chemistry Lab | Lab | Building D, 4th Floor | 35 | Available |
| FAC-XXXXXXXX | Cafeteria | Dining | Building E, Ground Floor | 300 | Available |
| FAC-XXXXXXXX | Sports Gymnasium | Sports | Sports Complex, Main Campus | 400 | Available |
| FAC-XXXXXXXX | Meeting Room 1 | Meeting Room | Building A, 5th Floor | 20 | Available |

---

## Sample Assets (7 records)

| ID | Name | Category | Location | Status | Condition |
|----|------|----------|----------|--------|-----------|
| AST-XXXXXXXX | Dell Laptop - ThinkPad X1 | Computing | Building B, Computer Lab 1 | Active | Good |
| AST-XXXXXXXX | HP Projector | Audio Visual | Building A, Main Auditorium | Active | Good |
| AST-XXXXXXXX | Microscope - Zeiss Professional | Laboratory Equipment | Building D, Biology Lab | Active | Excellent |
| AST-XXXXXXXX | Office Desk Chair | Furniture | Building A, Admin Office | Active | Good |
| AST-XXXXXXXX | Smart Board 65 inch | Audio Visual | Building B, Classroom 201 | Active | Good |
| AST-XXXXXXXX | Coffee Machine | Appliances | Building E, Cafeteria | Active | Fair |
| AST-XXXXXXXX | Printer HP M428 | Computing | Building A, Office | Active | Good |

---

## Key Features

✅ **Automatic Initialization**
- Runs automatically when the application starts
- Implements `CommandLineRunner` interface
- Executes during Spring Boot startup phase

✅ **Idempotent Design**
- Checks if collections are empty before inserting
- Won't create duplicate data if run multiple times
- Safe to restart the application without worrying about duplicates

✅ **Timestamp Management**
- Sets `createdAt` and `updatedAt` to current time
- Matches the entity requirements

✅ **Unique IDs**
- Generates unique 8-character UUID-based IDs
- Facilities prefixed with `FAC-`
- Assets prefixed with `AST-`

---

## How It Works

1. **On Application Startup:**
   - Spring Boot loads and initializes beans
   - `SampleDataInitializer` is created as a Spring Service
   - `run()` method is automatically called by Spring

2. **Data Population:**
   - Checks facility collection count
   - If count = 0, inserts 8 sample facilities
   - Checks asset collection count
   - If count = 0, inserts 7 sample assets

3. **Logging:**
   - Logs "Initializing sample facilities data..." when starting
   - Logs "Initializing sample assets data..." when starting
   - Logs "Sample data initialization completed!" when finished

---

## Next Steps

When you start the backend application:

1. Start the Spring Boot server
2. Check the console logs for:
   ```
   Initializing sample facilities data...
   Saved 8 sample facilities
   Initializing sample assets data...
   Saved 7 sample assets
   Sample data initialization completed!
   ```
3. Access the admin pages to view the sample data:
   - Admin → Facilities Management (8 records)
   - Admin → Assets Catalogue (7 records)

---

## Technical Details

- **Framework:** Spring Boot with MongoDB
- **Pattern:** CommandLineRunner for automatic initialization
- **Thread Safety:** Safe for concurrent access (bean initialization is single-threaded)
- **Database:** Data persists in MongoDB collections
- **Logging:** Uses SLF4J logger for diagnostics

---

## Backup & Restore

To reset the sample data:

1. **Clear Collections (via MongoDB CLI):**
   ```javascript
   db.facilities.deleteMany({})
   db.assets.deleteMany({})
   ```

2. **Restart Application:**
   - Stop the backend server
   - Start the backend server again
   - Sample data will be re-initialized

Alternatively, just restart the application if you haven't added real data yet.

---

## Build Status
✅ Backend compilation successful with SampleDataInitializer integrated
