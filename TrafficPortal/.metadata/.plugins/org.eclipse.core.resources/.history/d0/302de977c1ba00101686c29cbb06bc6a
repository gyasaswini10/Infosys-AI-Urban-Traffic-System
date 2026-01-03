import React, { useEffect, useState } from "react";
import { useBookingCart } from "../context/BookingCartContext";

const MOCK_MOVIES = [
  {
    id: 1,
    name: "Inception",
    imagePath: "https://via.placeholder.com/150",
    showtimes: ["10:00 AM", "1:00 PM", "6:00 PM"],
  },
  {
    id: 2,
    name: "The Matrix",
    imagePath: "https://via.placeholder.com/150",
    showtimes: ["11:00 AM", "3:00 PM", "9:00 PM"],
  },
  {
    id: 3,
    name: "Interstellar",
    imagePath: "https://via.placeholder.com/150",
    showtimes: ["9:00 AM", "2:00 PM", "7:00 PM"],
  },
];

const MoviePage = () => {
  const [movies, setMovies] = useState([]);
  const { addToCart } = useBookingCart();

  useEffect(() => {
    // You can later replace this mock with an API call to fetch real movies
    setMovies(MOCK_MOVIES);
  }, []);

  const handleBook = (movie, showtime) => {
    const ticket = {
      id: `${movie.id}-${showtime}`,
      movieName: movie.name,
      showtime,
    };
    addToCart(ticket);
    alert(`Booked ticket for ${movie.name} at ${showtime}`);
  };

  return (
    <div>
      <h1>Available Movies</h1>
      <div style={{ display: "flex", gap: 20 }}>
        {movies.map((movie) => (
          <div key={movie.id} style={{ border: "1px solid #ccc", padding: 10 }}>
            <img src={movie.imagePath} alt={movie.name} />
            <h3>{movie.name}</h3>
            <div>
              <b>Showtimes:</b>
              {movie.showtimes.map((showtime) => (
                <button
                  key={showtime}
                  style={{ margin: "5px" }}
                  onClick={() => handleBook(movie, showtime)}
                >
                  {showtime}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviePage;
