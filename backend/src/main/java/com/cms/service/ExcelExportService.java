package com.cms.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cms.model.Complaint;
import com.cms.repository.ComplaintRepository;

@Service
public class ExcelExportService {

    @Autowired
    private ComplaintRepository complaintRepository;

    public ByteArrayInputStream
    exportComplaints() throws IOException {

        Workbook workbook =
                new XSSFWorkbook();

        Sheet sheet =
                workbook.createSheet(
                        "Complaints"
                );

        Row header =
                sheet.createRow(0);

        String[] columns = {

                "ID",
                "Title",
                "Status",
                "Priority",
                "Category",
                "User",
                "Technician",
                "Created At"
        };

        for(int i=0;i<columns.length;i++) {

            header.createCell(i)
                    .setCellValue(
                            columns[i]
                    );
        }

        List<Complaint> complaints =
                complaintRepository.findAll();

        int rowNum = 1;

        for(Complaint complaint : complaints) {

            Row row =
                    sheet.createRow(
                            rowNum++
                    );

            row.createCell(0)
                    .setCellValue(
                            complaint.getId()
                    );

            row.createCell(1)
                    .setCellValue(
                            complaint.getTitle()
                    );

            row.createCell(2)
                    .setCellValue(
                            complaint.getStatus()
                                    .name()
                    );

            row.createCell(3)
                    .setCellValue(
                            complaint.getPriority()
                                    .name()
                    );

            row.createCell(4)
                    .setCellValue(
                            complaint.getCategory() != null
                                    ? complaint.getCategory().getName()
                                    : ""
                    );

            row.createCell(5)
                    .setCellValue(
                            complaint.getUser() != null
                                    ? complaint.getUser().getName()
                                    : ""
                    );

            row.createCell(6)
                    .setCellValue(
                            complaint.getTechnician() != null
                                    ? complaint.getTechnician().getName()
                                    : ""
                    );

            row.createCell(7)
                    .setCellValue(
                            complaint.getCreatedAt().toString()
                    );
        }

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        workbook.write(out);

        workbook.close();

        return new ByteArrayInputStream(
                out.toByteArray()
        );
    }
}