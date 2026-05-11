package com.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlyComplaintStats {

    private String month;

    private long complaints;
}