// Card.jsx
import React, { useState } from "react";

const DEFAULT_IMAGE = "/noimage.png"; // place this image in your public folder

const Card = ({ item, type }) => {
  const [imgSrc, setImgSrc] = useState(item.img);

  const handleImgError = () => {
    setImgSrc(DEFAULT_IMAGE); // fallback image on error
  };

  const isMovie = type === "movie";
  const buttonLabel = isMovie ? "Book Tickets" : "Buy Tickets";

  return (
    <div style={styles.card}>
      <img
        src={imgSrc}
        alt={item.title}
        onError={handleImgError}
        style={styles.image}
      />
      <div style={styles.info}>
        <h3 style={styles.title}>{item.title}</h3>
        {isMovie ? (
          <p style={styles.rating}>⭐ {item.rating}</p>
        ) : (
          <p style={styles.date}>{item.date}</p>
        )}
        <button style={isMovie ? styles.bookButton : styles.buyButton}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    width: 180,
    borderRadius: 15,
    backgroundColor: "#0a1a2a",
    boxShadow: "0 0 20px #00bfa5aa",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },
  image: {
    width: "100%",
    height: 240,
    objectFit: "cover",
  },
  info: {
    padding: 15,
    color: "#ddeeff",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  rating: {
    marginBottom: 10,
    fontWeight: "bold",
    color: "#ffd700",
  },
  date: {
    marginBottom: 10,
    fontWeight: "bold",
    color: "#81d4fa",
  },
  bookButton: {
    width: "100%",
    padding: "8px 0",
    backgroundColor: "#fb396f",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  buyButton: {
    width: "100%",
    padding: "8px 0",
    backgroundColor: "#2196f3",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default Card;
