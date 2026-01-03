import React from "react";
import { useBookingCart } from "../context/BookingCartContext";

const BookingHistoryPage = () => {
  const { bookingHistory } = useBookingCart();

  if (bookingHistory.length === 0) {
    return <p>No bookings made yet.</p>;
  }

  return (
    <div>
      <h1>Booking History</h1>
      <ul>
        {bookingHistory.map((record) => (
          <li key={record.id}>
            <strong>Date:</strong> {record.date}
            <ul>
              {record.items.map((item) => (
                <li key={item.id}>
                  {item.movieName} at {item.showtime}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingHistoryPage;
