// src/components/MovieCard.jsx
import React from "react";

const MovieCard = ({ movie, onBook }) => (
  <div style={styles.card}>
    <img src={movie.image} alt={movie.title} style={styles.image} />
    <div style={styles.info}>
      <h3>{movie.title}</h3>
      <p>⭐ {movie.rating}</p>
      <button style={styles.button} onClick={() => onBook(movie)}>
        Book Tickets
      </button>
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
    height: 250,
    objectFit: "cover",
  },
  info: {
    padding: 10,
  },
  button: {
    marginTop: 8,
    padding: "6px 12px",
    backgroundColor: "#ff3f6c",
    border: "none",
    borderRadius: 4,
    color: "white",
    cursor: "pointer",
  },
};

export default MovieCard;
