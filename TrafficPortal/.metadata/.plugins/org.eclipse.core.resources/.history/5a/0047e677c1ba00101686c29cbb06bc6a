import React from "react";

const movie = {
  title: "Inception (Telugu)",
  runtime: "2h 28m",
  rating: "UA16+",
  tags: ["Action", "Sci-Fi", "Thriller", "Adventure"],
  poster: "/images/inception.jpg",
  cast: [
    "Leonardo DiCaprio",
    "Joseph Gordon-Levitt",
    "Elliot Page",
    "Tom Hardy",
    "Ken Watanabe",
    "Cillian Murphy",
    "Marion Cotillard",
    "Michael Caine",
  ],
  reviews: [
    { user: "Arjun", text: "Amazing story and visuals!", rating: 5 },
    { user: "Priya", text: "Great music, loved the journey!", rating: 4 },
    { user: "Rahul", text: "Mind-bending concept and visuals!", rating: 5 },
    { user: "Sneha", text: "Keeps you hooked till the end.", rating: 4 },
  ],
  cinemas: [
    {
      name: "Cinepolis: PVP Square Mall",
      address: "Vijayawada",
      timings: ["06:45 PM", "10:20 PM"],
      features: "IMAX, Dolby Atmos",
      canCancel: true,
    },
    {
      name: "INOX: LEPL Icon, Patamata",
      address: "Vijayawada",
      timings: ["07:00 PM", "10:30 PM"],
      features: "Dolby 7.1",
      canCancel: false,
    },
    {
      name: "Cinepolis: Power One Mall",
      address: "Vijayawada",
      timings: ["06:50 PM", "09:40 PM"],
      features: "Dolby Atmos",
      canCancel: true,
    },
    {
      name: "INOX: NTR Complex",
      address: "Vijayawada",
      timings: ["05:30 PM", "08:45 PM"],
      features: "4K Projection, Dolby Surround",
      canCancel: false,
    },
    {
      name: "PVR Cinemas: Trendset Mall",
      address: "Vijayawada",
      timings: ["04:00 PM", "07:15 PM", "10:30 PM"],
      features: "PVR LUXE, Dolby Atmos",
      canCancel: true,
    },
    {
      name: "Rajeshwari Theater",
      address: "Vijayawada",
      timings: ["06:00 PM", "09:00 PM"],
      features: "Classic Single Screen, DTS",
      canCancel: false,
    },
    {
      name: "PVR Cinemas: Garuda Mall",
      address: "Guntur",
      timings: ["07:30 PM", "10:45 PM"],
      features: "IMAX, Recliner Seats",
      canCancel: true,
    },
    {
      name: "Asian Cinemas: Vasireddy Venkatadri Theatre",
      address: "Guntur",
      timings: ["06:00 PM", "09:30 PM"],
      features: "Dolby Atmos, Recliners",
      canCancel: false,
    },
  ],
};

const BookTickets = () => (
  <div style={styles.page}>
    <div style={styles.headerRow}>
      <img src={movie.poster} alt={movie.title} style={styles.poster} />
      <div style={styles.details}>
        <h2 style={styles.title}>{movie.title}</h2>
        <div style={styles.tags}>
          <span style={styles.badge}>{movie.runtime}</span>
          <span style={styles.badge}>{movie.rating}</span>
          {movie.tags.map((tag) => (
            <span key={tag} style={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{ margin: "12px 0 0 0", color: "#77efff" }}>
          4.5 ★ (1.2k reviews)
        </div>
        <CastList cast={movie.cast} />
      </div>
    </div>

    <div style={styles.bookSection}>
      <h3 style={styles.sectionTitle}>Choose Theatre & Timing</h3>
      <CinemaTable cinemas={movie.cinemas} />
    </div>

    <div style={styles.reviewsSection}>
      <h3 style={styles.sectionTitle}>User Reviews</h3>
      <Reviews reviews={movie.reviews} />
    </div>
  </div>
);

function CastList({ cast }) {
  return (
    <div style={styles.castList}>
      <span style={{ fontWeight: 600, marginRight: 8, color: "#10b0ff" }}>
        Cast:
      </span>
      {cast.join(", ")}
    </div>
  );
}

function CinemaTable({ cinemas }) {
  return (
    <div>
      {cinemas.map((cinema) => (
        <div key={cinema.name} style={styles.cinemaCard}>
          <div style={styles.cinemaName}>
            <span style={{ fontWeight: 600, color: "#00ffe7" }}>
              {cinema.name}
            </span>
            <span style={{ color: "#aaa", marginLeft: 8 }}>
              {cinema.features}
            </span>
          </div>
          <div style={{ color: "#aaa" }}>{cinema.address}</div>
          <div style={styles.timeRow}>
            {cinema.timings.map((time) => (
              <button
                key={time}
                style={styles.timeButton}
                onClick={() =>
                  alert("Proceed to booking for " + cinema.name + " at " + time)
                }
              >
                {time}
              </button>
            ))}
          </div>
          <div
            style={{
              color: cinema.canCancel ? "#1aff99" : "#ff778a",
              fontSize: 13,
              marginTop: 2,
            }}
          >
            {cinema.canCancel ? "Cancellation available" : "Non-cancellable"}
          </div>
        </div>
      ))}
    </div>
  );
}

function Reviews({ reviews }) {
  return (
    <div>
      {reviews.map((r, i) => (
        <div key={i} style={styles.reviewCard}>
          <div style={styles.reviewHeader}>
            <span style={styles.reviewUser}>{r.user}</span>
            <span style={styles.reviewStars}>
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </span>
          </div>
          <div style={styles.reviewText}>{r.text}</div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 850,
    margin: "40px auto",
    padding: 30,
    background: "#122030",
    color: "#fff",
    borderRadius: 18,
    boxShadow: "0 0 32px #0fdcff80",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  headerRow: {
    display: "flex",
    gap: 32,
    alignItems: "center",
    marginBottom: 30,
  },
  poster: {
    width: 180,
    height: 260,
    objectFit: "cover",
    borderRadius: 16,
    boxShadow: "0 0 18px #1be9f0",
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    margin: 0,
    color: "#00fff6",
    letterSpacing: "1px",
    textShadow: "0 2px 6px #099",
  },
  tags: {
    margin: "12px 0 0 0",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  badge: {
    background: "linear-gradient(90deg, #0ff 20%, #0ba5ad 90%)",
    color: "#011626",
    fontWeight: 700,
    fontSize: 13,
    borderRadius: 6,
    padding: "4px 12px",
    marginRight: 3,
    boxShadow: "0 0 10px #12ffff55",
  },
  tag: {
    background: "#192748",
    color: "#7afff6",
    fontWeight: "600",
    fontSize: 12,
    borderRadius: 5,
    padding: "4px 10px",
  },
  castList: {
    marginTop: 20,
    color: "#baffff",
    fontSize: 17,
  },
  bookSection: {
    margin: "45px 0 40px 0",
  },
  sectionTitle: {
    fontSize: 22,
    color: "#0ff",
    fontWeight: "bold",
    marginBottom: 18,
  },
  cinemaCard: {
    backgroundColor: "#161c2e",
    borderRadius: 11,
    padding: 20,
    marginBottom: 19,
    boxShadow: "0 0 10px #067cb744",
    border: "1px solid #0ff2",
  },
  cinemaName: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 3,
  },
  timeRow: {
    margin: "10px 0",
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  timeButton: {
    background: "linear-gradient(90deg, #00fff6, #11c2ff)",
    color: "#011626",
    fontWeight: "bold",
    padding: "9px 26px",
    border: "none",
    borderRadius: 9,
    cursor: "pointer",
    boxShadow: "0 2px 8px #07e7fd55",
    fontSize: 16,
    transition: "background 0.2s, transform 0.1s",
  },
  reviewsSection: {
    margin: "50px 0 20px 0",
  },
  reviewCard: {
    background: "#173561",
    padding: 18,
    borderRadius: 10,
    margin: "10px 0",
    color: "#fff",
    boxShadow: "0 0 9px #077",
    border: "1px solid #0ff4",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
  },
  reviewUser: { color: "#0ff", fontWeight: 700, fontSize: 17 },
  reviewStars: { color: "#ffd700", fontSize: 19 },
  reviewText: { color: "#c0e7fa", fontWeight: 500, marginTop: 3 },
};

export default BookTickets;
