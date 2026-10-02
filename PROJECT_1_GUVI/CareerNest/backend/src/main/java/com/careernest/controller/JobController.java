package com.careernest.controller;

import com.careernest.dto.JobRequest;
import com.careernest.model.Job;
import com.careernest.model.Role;
import com.careernest.service.CurrentUserService;
import com.careernest.repository.JobRepository;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    private final JobRepository jobs;
    private final CurrentUserService current;

    public JobController(JobRepository jobs, CurrentUserService current) {
        this.jobs = jobs;
        this.current = current;
    }

    @GetMapping
    public List<Job> list(@RequestParam(required = false) String keyword,
                          @RequestParam(required = false) String location) {
        List<Job> result;
        if (keyword != null && !keyword.isBlank()) {
            result = jobs.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
        } else {
            result = jobs.findAll();
        }
        if (location != null && !location.isBlank()) {
            result = result.stream()
                    .filter(j -> j.getLocation().toLowerCase().contains(location.toLowerCase()))
                    .toList();
        }
        return result;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> get(@PathVariable String id) {
        return jobs.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody JobRequest request) {
        var user = current.get();
        if (user.getRole() != Role.EMPLOYER) return ResponseEntity.status(403).build();

        Job job = Job.builder()
                .title(request.title()).description(request.description())
                .location(request.location()).salary(request.salary())
                .deadline(request.deadline()).employerId(user.getId())
                .employerName(user.getName()).build();
        return ResponseEntity.status(HttpStatus.CREATED).body(jobs.save(job));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @Valid @RequestBody JobRequest request) {
        var user = current.get();
        return jobs.findById(id).map(job -> {
            if (!job.getEmployerId().equals(user.getId())) return ResponseEntity.status(403).build();
            job.setTitle(request.title()); job.setDescription(request.description());
            job.setLocation(request.location()); job.setSalary(request.salary());
            job.setDeadline(request.deadline());
            return ResponseEntity.ok(jobs.save(job));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        var user = current.get();
        var job = jobs.findById(id).orElse(null);
        if (job == null) return ResponseEntity.notFound().build();
        if (!job.getEmployerId().equals(user.getId())) return ResponseEntity.status(403).build();
        jobs.delete(job);
        return ResponseEntity.noContent().build();
    }
}
