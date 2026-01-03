import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { to: "/", label: "Home" },
    { to: "/profile", label: "Profile" },
    { to: "/favorites", label: "Favorites" },
    { to: "/reviews", label: "Reviews" },
    { to: "/contact", label: "Contact" },
  ];

  const newsItems = [
    { id: 1, title: "Film Festival Coming Soon" },
    { id: 2, title: "Top 10 Movie Picks for 2025" },
    { id: 3, title: "Concert Tickets Sale" },
    { id: 4, title: "New Streaming Service Launched" },
    { id: 5, title: "Exclusive: Interview with Director" },
    { id: 6, title: "Award Ceremony Highlights" },
    // Add more as needed to make scrolling useful
  ];

  return (
    <aside style={styles.sidebar}>
      {/* Navigation Links */}
      <nav style={styles.nav}>
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            style={({ isActive }) =>
              isActive ? { ...styles.link, ...styles.activeLink } : styles.link
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Scrollable News Section */}
      <section style={styles.newsSection}>
        <h3 style={styles.newsTitle}>Latest News</h3>
        <div style={styles.newsListContainer}>
          <ul style={styles.newsList}>
            {newsItems.map(({ id, title }) => (
              <li key={id} style={styles.newsItem}>
                {title}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: 240,
    height: "100vh",
    backgroundColor: "#001a33",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    boxSizing: "border-box",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    marginBottom: 20,
  },
  link: {
    color: "#66d9ff",
    fontSize: 18,
    fontWeight: "500",
    textDecoration: "none",
    padding: "10px 15px",
    borderRadius: 10,
    transition: "background-color 0.3s ease",
  },
  activeLink: {
    backgroundColor: "#0ff",
    color: "#001a33",
    fontWeight: "700",
  },
  newsSection: {
    flexGrow: 1, // Take remaining vertical space
    overflowY: "auto", // Enable vertical scrollbar
    backgroundColor: "#002842",
    borderRadius: 12,
    padding: 12,
    boxShadow: "inset 0 0 10px #0ff",
  },
  newsTitle: {
    color: "#11ccee",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 12,
  },
  newsListContainer: {
    maxHeight: "60vh", // Limit max height for scrollable area
    overflowY: "auto",
  },
  newsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  newsItem: {
    marginBottom: 10,
    color: "#8fe0ea",
    fontSize: 16,
    cursor: "default",
  },
};

export default Sidebar;
