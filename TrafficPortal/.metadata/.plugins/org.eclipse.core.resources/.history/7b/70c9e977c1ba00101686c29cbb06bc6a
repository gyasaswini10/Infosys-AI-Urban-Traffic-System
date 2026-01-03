import React, { useState } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState({
    username: localStorage.getItem("username") ?? "User123",
    email: "user@example.com",
    name: "John Doe",
    bio: "Avid movie buff and concert goer",
    phone: "",
  });

  const [movies] = useState([
    { title: "Inception", date: "2025-09-20", rating: 9.0 },
    { title: "Matrix", date: "2025-08-15", rating: 8.7 },
  ]);

  const handleChange = (field) => (e) => {
    setUser({ ...user, [field]: e.target.value });
  };

  const handleSave = () => {
    alert("Profile updated!");
    // Implement save logic if needed
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{user.username}'s Profile</h1>
      <div style={styles.formGroup}>
        <label>Name</label>
        <input
          value={user.name}
          onChange={handleChange("name")}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label>Email</label>
        <input
          value={user.email}
          onChange={handleChange("email")}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label>Phone</label>
        <input
          value={user.phone}
          onChange={handleChange("phone")}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label>Bio</label>
        <textarea
          value={user.bio}
          onChange={handleChange("bio")}
          rows={3}
          style={styles.textarea}
        />
      </div>
      <button onClick={handleSave} style={styles.button}>
        Save Profile
      </button>

      <h2 style={styles.subTitle}>Previously Watched Movies</h2>
      <ul style={styles.list}>
        {movies.map((movie, idx) => (
          <li key={idx} style={styles.listItem}>
            {movie.title} - {movie.date} - ⭐ {movie.rating}
            <button
              style={styles.reviewButton}
              onClick={() => alert(`Reviewing ${movie.title}`)}
            >
              Review
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 700,
    margin: "50px auto",
    padding: 30,
    backgroundColor: "#121212",
    color: "#ddd",
    borderRadius: 16,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    borderBottom: "2px solid #11ccff",
    paddingBottom: 10,
  },
  formGroup: { marginBottom: 20 },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: "none",
    backgroundColor: "#304b63",
    color: "#eee",
    fontSize: 16,
  },
  textarea: {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: "none",
    backgroundColor: "#304b63",
    color: "#eee",
    fontSize: 16,
  },
  button: {
    padding: 15,
    width: "100%",
    borderRadius: 14,
    border: "none",
    fontWeight: "bold",
    fontSize: 20,
    background: "linear-gradient(90deg, #11ccff 0%, #0072ff 100%)",
    color: "#121212",
    cursor: "pointer",
  },
  subTitle: {
    marginTop: 40,
    marginBottom: 15,
    fontSize: 24,
    fontWeight: "bold",
    color: "#11ccff",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    padding: 15,
    borderRadius: 14,
    backgroundColor: "#304b63",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    fontSize: 18,
  },
  reviewButton: {
    backgroundColor: "#11ccff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 14,
    color: "#121212",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default ProfilePage;
