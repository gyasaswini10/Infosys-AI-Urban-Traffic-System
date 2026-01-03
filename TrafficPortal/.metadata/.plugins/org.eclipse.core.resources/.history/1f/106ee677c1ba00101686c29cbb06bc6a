import React from "react";
import { useBookingCart } from "../context/BookingCartContext";

const BookingCartPage = () => {
  const { cartItems, removeFromCart, completeBooking } = useBookingCart();

  return (
    <div>
      <h1>Your Booking Cart</h1>
      {cartItems.length === 0 ? (
        <p>
          Your cart is empty. Go to <a href="/movies">Movies</a> to book
          tickets.
        </p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.movieName} at {item.showtime}{" "}
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={completeBooking}>Complete Booking</button>
        </>
      )}
    </div>
  );
};

export default BookingCartPage;
