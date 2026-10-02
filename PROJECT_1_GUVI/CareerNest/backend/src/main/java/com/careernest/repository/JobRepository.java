package com.careernest.repository;

import com.careernest.model.Job;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface JobRepository extends MongoRepository<Job, String> {
    List<Job> findByEmployerId(String employerId);
    List<Job> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
    List<Job> findByLocationContainingIgnoreCase(String location);
}
