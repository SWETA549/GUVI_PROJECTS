package com.careernest.repository;

import com.careernest.model.JobApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface JobApplicationRepository extends MongoRepository<JobApplication, String> {
    List<JobApplication> findBySeekerIdOrderByAppliedAtDesc(String seekerId);
    List<JobApplication> findByEmployerIdOrderByAppliedAtDesc(String employerId);
    boolean existsByJobIdAndSeekerId(String jobId, String seekerId);
}
