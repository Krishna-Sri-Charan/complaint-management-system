package com.cms.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AiSuggestionResponse {

    private String suggestions;

    private String recommendedTeam;
}