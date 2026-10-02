package com.careernest.controller;

import com.careernest.dto.StatusRequest;
import com.careernest.model.*;
import com.careernest.repository.*;
import com.careernest.service.*;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
    private final JobApplicationRepository applications;
    private final JobRepository jobs;
    private final CurrentUserService current;
    private final NotificationService notifications;
    private final UserRepository users;

    public ApplicationController(JobApplicationRepository applications, JobRepository jobs,
                                 CurrentUserService current, NotificationService notifications,
                                 UserRepository users) {
        this.applications = applications; this.jobs = jobs; this.current = current;
        this.notifications = notifications; this.users = users;
    }

    @PostMapping("/jobs/{jobId}")
    public ResponseEntity<?> apply(@PathVariable String jobId) {
        var seeker = current.get();
        if (seeker.getRole() != Role.JOB_SEEKER) return ResponseEntity.status(403).build();

        Job job = jobs.findById(jobId).orElse(null);
        if (job == null) return ResponseEntity.notFound().build();
        if (applications.existsByJobIdAndSeekerId(jobId, seeker.getId())) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "You already applied to this job"));
        }

        JobApplication app = JobApplication.builder()
                .jobId(job.getId()).jobTitle(job.getTitle())
                .seekerId(seeker.getId()).seekerName(seeker.getName()).seekerEmail(seeker.getEmail())
                .employerId(job.getEmployerId()).status(ApplicationStatus.APPLIED)
                .appliedAt(Instant.now()).build();
        applications.save(app);

        notifications.sendSms(seeker.getPhone(), "CareerNest: Your application for " + job.getTitle() + " was submitted.");
        users.findById(job.getEmployerId()).ifPresent(employer ->
                notifications.sendSms(employer.getPhone(), "CareerNest: New application for " + job.getTitle() + "."));

        return ResponseEntity.status(HttpStatus.CREATED).body(app);
    }

    @GetMapping("/me")
    public List<JobApplication> mine() {
        return applications.findBySeekerIdOrderByAppliedAtDesc(current.get().getId());
    }

    @GetMapping("/employer")
    public List<JobApplication> employerApplications() {
        return applications.findByEmployerIdOrderByAppliedAtDesc(current.get().getId());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> status(@PathVariable String id, @Valid @RequestBody StatusRequest request) {
        var employer = current.get();
        var app = applications.findById(id).orElse(null);
        if (app == null) return ResponseEntity.notFound().build();
        if (!app.getEmployerId().equals(employer.getId())) return ResponseEntity.status(403).build();

        app.setStatus(request.status());
        applications.save(app);

        users.findById(app.getSeekerId()).ifPresent(seeker ->
                notifications.sendSms(seeker.getPhone(),
                        "CareerNest: Your application for " + app.getJobTitle() +
                        " is now " + request.status().name() + "."));
        return ResponseEntity.ok(app);
    }
}
