package com.sliit.paf.smart_campus_hub.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class systemCheckRunner implements CommandLineRunner {

    @Autowired
    private ApplicationContext applicationContext;
    @Autowired
    private MongoTemplate mongoTemplate;

    @Value("${server.port:8080}")
    private String port;

    @Value("${spring.security.oauth2.client.registration.google.client-id:NOT_SET}")
    private String clientId;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("checking backend system status...");
        System.out.println("Server is running on port: " + port);
        System.out.println("Google OAuth Client ID: " + clientId);

        try {
            boolean isDbUp = mongoTemplate.getDb().getName() != null;
            if (isDbUp) {
                System.out.println("Database connection: UP");
            } else {
                System.out.println("Database connection: DOWN");
            }
        } catch (Exception e) {
            System.out.println("Error occurred while checking database connection: " + e.getMessage());
        }

        if (!clientId.equals("NOT_SET")) {
            System.out.println("Google OAuth Client ID is set correctly.");
        } else {
            System.out.println("Google OAuth Client ID is NOT set. Please check your configuration.");
        }

    }

}
