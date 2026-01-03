import React from "react";

const ads = [
  {
    id: 1,
    img: "https://via.placeholder.com/900x150?text=Ad+Banner+1",
    link: "#",
  },
  {
    id: 2,
    img: "https://via.placeholder.com/900x150?text=Ad+Banner+2",
    link: "#",
  },
  {
    id: 3,
    img: "https://via.placeholder.com/900x150?text=Ad+Banner+3",
    link: "#",
  },
];

const AdBanner = () => {
  const ad = ads[Math.floor(Math.random() * ads.length)];
  return (
    <div style={styles.adContainer}>
      <a href={ad.link} target="_blank" rel="noopener noreferrer">
        <img src={ad.img} alt="Advertisement" style={styles.adImage} />
      </a>
    </div>
  );
};

const styles = {
  adContainer: {
    margin: "40px auto",
    width: "90%",
    maxWidth: 900,
    textAlign: "center",
  },
  adImage: {
    width: "100%",
    borderRadius: 14,
    boxShadow: "0 0 20px #2196f3aa",
  },
};

export default AdBanner;
