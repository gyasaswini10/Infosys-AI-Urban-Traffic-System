import React from "react";

const DEFAULT_IMAGE = "/no-image.png"; // Make sure this file is in public/

const EventCard = ({ item, type }) => {
  const isMovie = type === "movie";
  const buttonLabel = isMovie ? "Book Tickets" : "Buy Tickets";

  // Ensure we do not create endless errors by avoiding flicker recursion
  const [imgSrc, setImgSrc] = React.useState(item.img);

  const handleImgError = () => {
    setImgSrc(DEFAULT_IMAGE);
  };

  return (
    <div style={styles.card}>
      <img
        src={imgSrc}
        alt={item.title}
        style={styles.image}
        onError={handleImgError}
      />
      <div style={styles.info}>
        <h3 style={styles.title}>{item.title}</h3>
        {isMovie ? (
          <p style={styles.rating}>⭐ {item.rating}</p>
        ) : (
          <p style={styles.date}>{item.date}</p>
        )}
        <button style={isMovie ? styles.bookBtn : styles.buyBtn}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

const ads = [
  { id: 1, img: "/ad1.png", link: "#" },
  { id: 2, img: "/ad2.png", link: "#" },
  { id: 3, img: "/ad3.png", link: "#" },
];

const styles = {
  // (card styles remain the same as before)
  card: {
    backgroundColor: "#222",
    borderRadius: 14,
    width: 180,
    boxShadow: "0 0 30px #2196f3aa",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },
  image: {
    width: "100%",
    height: 250,
    objectFit: "cover",
  },
  info: {
    padding: 15,
    color: "#eee",
  },
  title: {
    fontSize: 18,
    marginBottom: 5,
  },
  rating: {
    color: "#ffd700",
    fontWeight: "bold",
    marginBottom: 12,
  },
  date: {
    marginBottom: 12,
    fontWeight: "bold",
    color: "#81d4fa",
  },
  bookBtn: {
    backgroundColor: "#fb396f",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    color: "#fff",
    fontWeight: "bold",
    width: "100%",
    cursor: "pointer",
  },
  buyBtn: {
    backgroundColor: "#2196f3",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    color: "#fff",
    fontWeight: "bold",
    width: "100%",
    cursor: "pointer",
  },
};

export default EventCard;
