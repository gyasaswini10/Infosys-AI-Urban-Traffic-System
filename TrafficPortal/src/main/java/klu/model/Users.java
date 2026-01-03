package klu.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity

@Table(name="users")

public class Users {

  @Column

  String Fullname;

  @Column

  @Id

  String email;

  @Column

  int role;

  @Column

  String password;

  public String getFullname() {

    return Fullname;

  }

  public void setFullname(String fullname) {

    Fullname = fullname;

  }

  public String getEmail() {

    return email;

  }

  public void setEmail(String email) {

    this.email = email;

  }

  public int getRole() {

    return role;

  }

  public void setRole(int role) {

    this.role = role;

  }

  public String getPassword() {

    return password;

  }

  public void setPassword(String password) {

    this.password = password;

  }

  @Override

  public String toString() {

    return "Users [Fullname=" + Fullname + ", email=" + email + ", role=" + role + ", password=" + password + "]";

  }

  

  

  



}