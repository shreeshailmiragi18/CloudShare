package com.shree.Backend.documents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@AllArgsConstructor  //used for constructor with all the arguments
@NoArgsConstructor //used for empty constructor
@Data //used for setter and getter impl
@Builder
@Document(collection = "profiles") //maps to collection called profiles
public class ProfileDocument {

    @Id
    private String id;
    private String clerkId;

    @Indexed(unique = true) //No two documents in the collection can have the same email.
    private String email;
    private String firstName;
    private String lastName;
    private Integer credits;
    private String photoUrl;
    private Instant createdAt;

}
