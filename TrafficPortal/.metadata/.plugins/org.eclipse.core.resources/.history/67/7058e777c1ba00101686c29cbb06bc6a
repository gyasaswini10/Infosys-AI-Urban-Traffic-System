import React from "react";
import EventCard from "./EventCard";

const EventSection = ({ title, items, type }) => (
  <section style={styles.section}>
    <h2 style={styles.title}>{title}</h2>
    <div style={styles.list}>
      {items.map((item) => (
        <EventCard key={item.id} item={item} type={type} />
      ))}
    </div>
  </section>
);

const styles = {
  section: {
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    marginBottom: 15,
    color: "#81d4fa",
    borderBottom: "2px solid #21cbf3",
    paddingBottom: 8,
  },
  list: {
    display: "flex",
    gap: 25,
    flexWrap: "wrap",
    justifyContent: "center",
  },
};

export default EventSection;
