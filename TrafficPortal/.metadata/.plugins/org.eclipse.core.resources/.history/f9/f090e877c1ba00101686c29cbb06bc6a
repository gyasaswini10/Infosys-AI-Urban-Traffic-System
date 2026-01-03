import React from "react";
import Sidebar from "./Sidebar";
import Section from "./Section";
import AdsBanner from "./AdsBanner";
import Recommendations from "./Recommendations";

const HomePage = () => {
  const movies = [
    { id: 1, title: "Inception", rating: 8.8, img: "/images/inception.jpg" },
    { id: 2, title: "The Matrix", rating: 8.7, img: "/images/matrix.jpg" },
    {
      id: 3,
      title: "Interstellar",
      rating: 8.6,
      img: "/images/interstellar.jpg",
    },
  ];

  const concerts = [
    {
      id: 1,
      title: "Coldplay Live",
      date: "Nov 12, 2025",
      img: "/images/coldplay.jpg",
    },
    {
      id: 2,
      title: "Billie Eilish",
      date: "Dec 5, 2025",
      img: "/images/billie.jpg",
    },
  ];

  const theaterShows = [
    {
      id: 1,
      title: "Hamilton",
      date: "Oct 20, 2025",
      img: "/images/hamilton.jpg",
    },
    {
      id: 2,
      title: "Phantom of the Opera",
      date: "Nov 30, 2025",
      img: "/images/phantom.jpg",
    },
  ];

  const sportsEvents = [
    {
      id: 1,
      title: "Football Finals",
      date: "Dec 1, 2025",
      img: "/images/football.jpg",
    },
    {
      id: 2,
      title: "NBA Playoffs",
      date: "Jan 15, 2026",
      img: "/images/nba.jpg",
    },
  ];

  const location = "New York City";
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentTime = currentDate.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.main}>
        <section style={styles.infoBar}>
          <div>
            <strong>Location:</strong> {location}
          </div>
          <div>
            <strong>Date:</strong> {formattedDate}
          </div>
          <div>
            <strong>Time:</strong> {currentTime}
          </div>
        </section>

        <Recommendations />

        <Section title="Now Showing - Movies" items={movies} type="movie" />
        <AdsBanner />
        <Section
          title="Upcoming Music Concerts"
          items={concerts}
          type="concert"
        />
        <Section title="Theater Shows" items={theaterShows} type="theater" />
        <Section title="Sports Events" items={sportsEvents} type="sports" />
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100%",
    backgroundColor: "#0b1939",
    color: "#ddeeff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  main: {
    flexGrow: 1,
    overflowY: "auto",
    padding: "40px",
  },
  infoBar: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: 40,
    padding: "15px 25px",
    backgroundColor: "#122d47",
    borderRadius: 12,
    fontSize: 20,
    fontWeight: "600",
    boxShadow: "0 0 20px #0ff",
  },
};

export default HomePage;
