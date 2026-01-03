// src/components/MusicConcertCard.jsx
import React from "react";

const MusicConcertCard = ({ concert }) => (
  <div style={styles.card}>
    <img src={concert.image} alt={concert.name} style={styles.image} />
    <div style={styles.info}>
      <h3>{concert.name}</h3>
      <p>{concert.date}</p>
      <button style={styles.button}>Buy Tickets</button>
    </div>
  </div>
);

const styles = {
  card: {
    width: 180,
    margin: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: 8,
    overflow: "hidden",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: 180,
    objectFit: "cover",
  },
  info: {
    padding: 10,
  },
  button: {
    marginTop: 8,
    padding: "6px 12px",
    backgroundColor: "#2980b9",
    border: "none",
    borderRadius: 4,
    color: "white",
    cursor: "pointer",
  },
};

export default MusicConcertCard;
