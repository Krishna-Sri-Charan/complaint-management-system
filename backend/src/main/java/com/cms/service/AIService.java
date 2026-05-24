package com.cms.service;

import com.cms.dto.AiComplaintResponse;
import com.cms.dto.AiSuggestionResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.*;

import org.springframework.stereotype.Service;

import org.springframework.web.client.RestTemplate;

@Service
public class AiService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    public AiComplaintResponse analyzeComplaint(
            String complaint
    ) {

        RestTemplate restTemplate =
                new RestTemplate();

        HttpHeaders headers =
                new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_JSON
        );

        headers.setBearerAuth(apiKey);

        String prompt = """
                Analyze the complaint and return:
                1. Category
                2. Priority

                Complaint:
                %s

                Return ONLY JSON format:
                {
                  "category": "...",
                  "priority": "..."
                }
                """.formatted(complaint);

        JSONObject message =
                new JSONObject();

        message.put("role", "user");

        message.put("content", prompt);

        JSONArray messages =
                new JSONArray();

        messages.put(message);

        JSONObject requestBody =
                new JSONObject();

        requestBody.put("model", "llama-3.3-70b-versatile");

        requestBody.put("messages", messages);

        HttpEntity<String> request =
                new HttpEntity<>(
                        requestBody.toString(),
                        headers
                );

        ResponseEntity<String> response =

                restTemplate.exchange(

                        apiUrl,

                        HttpMethod.POST,

                        request,

                        String.class
                );

        JSONObject jsonResponse =
                new JSONObject(response.getBody());

        String content =

                jsonResponse
                        .getJSONArray("choices")
                        .getJSONObject(0)
                        .getJSONObject("message")
                        .getString("content");

        JSONObject aiJson =
                new JSONObject(content);

        return AiComplaintResponse.builder()

                .category(
                        aiJson.getString("category")
                )

                .priority(
                        aiJson.getString("priority")
                )

                .build();
    }
    
    public AiSuggestionResponse generateSuggestions(
            String complaint
    ) {

        RestTemplate restTemplate =
                new RestTemplate();

        HttpHeaders headers =
                new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_JSON
        );

        headers.setBearerAuth(apiKey);

        String prompt = """
                Analyze this complaint and provide:
                1. Troubleshooting suggestions
                2. Recommended support team

                Complaint:
                %s

                Return ONLY JSON format:
                {
                  "suggestions": "...",
                  "recommendedTeam": "..."
                }
                """.formatted(complaint);

        JSONObject message =
                new JSONObject();

        message.put("role", "user");

        message.put("content", prompt);

        JSONArray messages =
                new JSONArray();

        messages.put(message);

        JSONObject requestBody =
                new JSONObject();

        requestBody.put(
                "model",
                "llama-3.3-70b-versatile"
        );

        requestBody.put("messages", messages);

        HttpEntity<String> request =
                new HttpEntity<>(
                        requestBody.toString(),
                        headers
                );

        ResponseEntity<String> response =

                restTemplate.exchange(

                        apiUrl,

                        HttpMethod.POST,

                        request,

                        String.class
                );

        JSONObject jsonResponse =
                new JSONObject(response.getBody());

        String content =

                jsonResponse
                        .getJSONArray("choices")
                        .getJSONObject(0)
                        .getJSONObject("message")
                        .getString("content");

        JSONObject aiJson =
                new JSONObject(content);

        return AiSuggestionResponse.builder()

                .suggestions(
                        aiJson.getString("suggestions")
                )

                .recommendedTeam(
                        aiJson.getString("recommendedTeam")
                )

                .build();
    }
}