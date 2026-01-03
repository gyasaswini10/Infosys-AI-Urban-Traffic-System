import React from "react";

const posts = [
  {
    id: 1,
    title: "New Movie Releases This Month",
    snippet: "Check out the most anticipated new movies...",
  },
  {
    id: 2,
    title: "Top Concerts in Your City",
    snippet: "Don't miss these live concerts happening near you...",
  },
  {
    id: 3,
    title: "How to Get Discounts on Tickets",
    snippet: "Learn tips and tricks to save on your bookings...",
  },
];

const NewsFeed = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Latest News & Features</h2>
      {posts.map((post) => (
        <div key={post.id} style={styles.post}>
          <h3 style={styles.postTitle}>{post.title}</h3>
          <p style={styles.snippet}>{post.snippet}</p>
          <button style={styles.btn} onClick={() => alert("Read More!")}>
            Read More
          </button>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    marginBottom: 40,
    padding: 20,
    backgroundColor: "#052235",
    borderRadius: 15,
    boxShadow: "0 0 20px #00bfa5aa",
  },
  title: {
    color: "#00bfa5",
    fontWeight: "bold",
    fontSize: 26,
    marginBottom: 20,
  },
  post: {
    backgroundColor: "#0a1a2a",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  postTitle: {
    margin: 0,
    color: "#11eee8",
    fontSize: 18,
  },
  snippet: {
    color: "#88d8d6",
    margin: "10px 0",
  },
  btn: {
    border: "none",
    color: "#0a1a2a",
    backgroundColor: "#00bfa5",
    padding: "8px 15px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default NewsFeed;
