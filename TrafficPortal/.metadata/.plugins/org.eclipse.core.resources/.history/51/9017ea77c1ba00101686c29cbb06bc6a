import React from "react";

const recommendations = [
  { id: 1, title: "Upcoming Award Shows", img: "/images/awardshow.jpg" },
  { id: 2, title: "New Streaming Platforms", img: "/images/streaming.jpg" },
  {
    id: 3,
    title: "Featured Artist: Taylor Swift",
    img: "/images/taylorswift.jpg",
  },
];

const Recommendations = () => {
  const [imgError, setImgError] = React.useState({});

  const handleImgError = (id) => {
    setImgError((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Recommendations &amp; More</h2>
      <div style={styles.grid}>
        {recommendations.map((item) => (
          <div key={item.id} style={styles.card}>
            <img
              src={imgError[item.id] ? "/images/noimage.png" : item.img}
              alt={item.title}
              style={styles.image}
              onError={() => handleImgError(item.id)}
            />
            <div style={styles.caption}>{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: 20,
    marginTop: 40,
    backgroundColor: "#052037",
    borderRadius: 14,
    boxShadow: "0 0 25px #00d2ff88",
  },
  title: {
    color: "#00d2ff",
    fontSize: 28,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  grid: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    flexWrap: "wrap",
  },
  card: {
    width: 220,
    backgroundColor: "#082240",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 0 18px #00d2ffaa",
    textAlign: "center",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: 160,
    objectFit: "cover",
    userSelect: "none",
  },
  caption: {
    padding: 12,
    color: "#a0f7ff",
    fontWeight: "600",
    fontSize: 18,
  },
};

export default Recommendations;
