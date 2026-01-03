import React, { useState } from "react";
import { login } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      alert(data.message);
      localStorage.setItem("token", data.token ?? "fake-token");
      localStorage.setItem("username", data.username ?? username);
      setUsername("");
      setPassword("");
      navigate("/");
    } catch {
      alert("Incorrect username or password.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.tabContainer}>
        <Link to="/signup" style={{ ...styles.tab, opacity: 0.7 }}>
          Sign Up
        </Link>
        <Link
          to="/login"
          style={{
            ...styles.tab,
            borderBottom: "3px solid #11ccff",
            fontWeight: "bold",
          }}
        >
          Login
        </Link>
      </div>
      <form style={styles.form} onSubmit={handleLogin}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          Log In
        </button>
      </form>
      <p style={styles.footerText}>
        Don't have an account?{" "}
        <Link style={styles.link} to="/signup">
          Sign Up
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

export default Login;
