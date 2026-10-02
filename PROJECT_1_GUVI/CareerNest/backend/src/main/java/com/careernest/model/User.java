package com.careernest.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private Role role;
}
