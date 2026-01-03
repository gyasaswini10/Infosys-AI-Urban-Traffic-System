import React, { createContext, useState, useContext } from "react";

const BookingCartContext = createContext();

export const BookingCartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);

  const addToCart = (ticket) => setCartItems((prev) => [...prev, ticket]);
  const removeFromCart = (ticketId) =>
    setCartItems((prev) => prev.filter((t) => t.id !== ticketId));
  const completeBooking = () => {
    if (cartItems.length > 0) {
      setBookingHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          items: cartItems,
          date: new Date().toLocaleString(),
        },
      ]);
      setCartItems([]);
    }
  };

  return (
    <BookingCartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        bookingHistory,
        completeBooking,
      }}
    >
      {children}
    </BookingCartContext.Provider>
  );
};

export const useBookingCart = () => useContext(BookingCartContext);
