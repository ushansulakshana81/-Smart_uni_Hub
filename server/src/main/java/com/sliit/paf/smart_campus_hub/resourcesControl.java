package com.sliit.paf.smart_campus_hub;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class resourcesControl {

	@GetMapping("/")
	public Map<String, Object> root() {
		Map<String, Object> response = new HashMap<>();
		response.put("success", true);
		response.put("message", "Smart Campus Hub backend is running");
		response.put("service", "smart-campus-hub");
		return response;
	}
}
