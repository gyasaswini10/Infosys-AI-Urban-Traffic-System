import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const username = localStorage.getItem("username") || "User";
  const token = localStorage.getItem("token");

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  // Capitalize first letter of username
  const capUsername = username.charAt(0).toUpperCase() + username.slice(1);

  return (
    <header style={styles.header}>
      <div style={styles.title}>MovieTickets</div>
      <div style={styles.title}> 30243</div>
      <nav style={styles.nav}>
        {!token ? (
          <>
            <button onClick={() => navigate("/login")} style={styles.navButton}>
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              style={styles.navButton}
            >
              Sign Up
            </button>
          </>
        ) : (
          <div style={styles.profileContainer}>
            <div style={styles.avatar} onClick={toggleMenu}>
              {capUsername.charAt(0)}
            </div>
            {menuOpen && (
              <div style={styles.dropdownMenu}>
                <div style={styles.welcome}>Welcome, {capUsername}</div>
                <button
                  style={styles.menuItem}
                  onClick={() => {
                    navigate("/profile");
                    toggleMenu();
                  }}
                >
                  Profile
                </button>
                <button
                  style={styles.menuItem}
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "#000",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#0ff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: "0 2px 8px rgba(0,255,255,0.7)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0ff",
    userSelect: "none",
  },
  nav: {
    display: "flex",
    gap: 20,
    alignItems: "center",
  },
  navButton: {
    backgroundColor: "transparent",
    border: "1.5px solid #0ff",
    borderRadius: "8px",
    color: "#0ff",
    padding: "8px 18px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.25s ease",
  },
  profileContainer: {
    position: "relative",
  },
  avatar: {
    backgroundColor: "#0ff",
    color: "#000",
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 20,
    cursor: "pointer",
    userSelect: "none",
  },
  dropdownMenu: {
    position: "absolute",
    right: 0,
    top: 50,
    backgroundColor: "#002727",
    borderRadius: 12,
    width: 150,
    boxShadow: "0 0 10px #0ff",
    display: "flex",
    flexDirection: "column",
  },
  welcome: {
    color: "#0ff",
    fontWeight: "600",
    padding: "10px 15px",
    borderBottom: "1px solid #0ff",
  },
  menuItem: {
    backgroundColor: "transparent",
    border: "none",
    color: "#0ff",
    padding: "10px 15px",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.25s",
  },
};

export default Header;
