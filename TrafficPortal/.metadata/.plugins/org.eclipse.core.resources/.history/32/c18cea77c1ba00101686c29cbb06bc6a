import React, { useState } from "react";
import { signup } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const data = await signup(username, email, password);
      alert(data.message);
      setUsername("");
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch {
      alert("Failed to Sign Up, try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.tabContainer}>
        <Link
          to="/signup"
          style={{
            ...styles.tab,
            borderBottom: "3px solid #11ccff",
            fontWeight: "bold",
          }}
        >
          Sign Up
        </Link>
        <Link to="/login" style={{ ...styles.tab, opacity: 0.7 }}>
          Login
        </Link>
      </div>
      <form onSubmit={handleSignup} style={styles.form}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>
      <p style={styles.footerText}>
        Already have an account?{" "}
        <Link style={styles.link} to="/login">
          Login now
        </Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 400,
    margin: "50px auto",
    padding: 40,
    background: "linear-gradient(145deg, #09203f, #537895)",
    borderRadius: 16,
    color: "#eee",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: "0 0 20px 3px #0ff",
  },
  tabContainer: {
    display: "flex",
    background: "rgba(255, 255, 255, .1)",
    borderRadius: 12,
    marginBottom: 30,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    padding: "14px 0",
    textAlign: "center",
    color: "#ccddee",
    cursor: "pointer",
    textDecoration: "none",
    transition: "all 0.3s ease",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: 14,
    marginBottom: 20,
    borderRadius: 12,
    border: "none",
    background: "#304b63",
    color: "#ddf",
    fontSize: 16,
    outline: "none",
  },
  button: {
    padding: 16,
    borderRadius: 12,
    border: "none",
    fontSize: 18,
    fontWeight: "bold",
    background: "linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: "#bbb",
    textAlign: "center",
  },
  link: {
    color: "#11ccff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Signup;
