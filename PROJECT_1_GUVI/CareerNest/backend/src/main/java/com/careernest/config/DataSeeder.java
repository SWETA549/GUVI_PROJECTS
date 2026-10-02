package com.careernest.config;

import com.careernest.model.*;
import com.careernest.repository.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {
    private final UserRepository users;
    private final JobRepository jobs;
    private final PasswordEncoder encoder;
    private final boolean enabled;

    public DataSeeder(UserRepository users, JobRepository jobs, PasswordEncoder encoder,
                      @Value("${app.seed-data:true}") boolean enabled) {
        this.users = users; this.jobs = jobs; this.encoder = encoder; this.enabled = enabled;
    }

    @Override
    public void run(String... args) {
        if (!enabled || jobs.count() > 0) return;

        User employer = users.findByEmail("demo.employer@careernest.com").orElseGet(() ->
                users.save(User.builder().name("CareerNest Demo Employer")
                        .email("demo.employer@careernest.com")
                        .password(encoder.encode("password123"))
                        .phone("+910000000000").role(Role.EMPLOYER).build()));

        jobs.saveAll(List.of(
                Job.builder().title("Frontend Developer").description("Build responsive React interfaces and collaborate with product designers.")
                        .location("Chennai, Tamil Nadu").salary("₹5–8 LPA").deadline(LocalDate.now().plusDays(21))
                        .employerId(employer.getId()).employerName(employer.getName()).build(),
                Job.builder().title("Java Backend Developer").description("Develop REST APIs with Spring Boot and MongoDB.")
                        .location("Bengaluru, Karnataka").salary("₹7–11 LPA").deadline(LocalDate.now().plusDays(30))
                        .employerId(employer.getId()).employerName(employer.getName()).build(),
                Job.builder().title("UI/UX Designer Intern").description("Create user flows, wireframes and polished product experiences in Figma.")
                        .location("Remote").salary("₹15k/month").deadline(LocalDate.now().plusDays(14))
                        .employerId(employer.getId()).employerName(employer.getName()).build()
        ));
    }
}
