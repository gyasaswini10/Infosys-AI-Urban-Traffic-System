import React from "react";
import Card from "./Card";

const Section = ({ title, items, type }) => (
  <section style={styles.section}>
    <h2 style={styles.title}>{title}</h2>
    <div style={styles.cardsContainer}>
      {items.map((item) => (
        <Card key={item.id} item={item} type={type} />
      ))}
    </div>
  </section>
);

const styles = {
  section: {
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    borderBottom: "3px solid #26a69a",
    paddingBottom: 10,
    color: "#26a69a",
  },
  cardsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: 30,
    justifyContent: "center",
  },
};

export default Section;
