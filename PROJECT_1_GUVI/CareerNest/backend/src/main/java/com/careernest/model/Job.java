package com.careernest.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document("jobs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Job {
    @Id
    private String id;
    private String title;
    private String description;
    private String location;
    private String salary;
    private LocalDate deadline;
    private String employerId;
    private String employerName;
}
