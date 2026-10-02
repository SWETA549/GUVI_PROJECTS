package com.careernest.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document("applications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JobApplication {
    @Id
    private String id;
    private String jobId;
    private String jobTitle;
    private String seekerId;
    private String seekerName;
    private String seekerEmail;
    private String employerId;
    private ApplicationStatus status;
    private Instant appliedAt;
}
