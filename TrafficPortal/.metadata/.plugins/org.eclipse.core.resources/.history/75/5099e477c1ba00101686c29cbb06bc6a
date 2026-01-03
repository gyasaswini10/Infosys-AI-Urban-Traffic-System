import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfilePage from "./components/ProfilePage";
import BookTickets from "./components/BookTickets"; // Import the new component

// Also import other pages if you have
import Favorites from "./components/Favorites";
import Reviews from "./components/Reviews";
import Contact from "./components/Contact";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div style={{ display: "flex", height: "100vh" }}>
        <div style={{ flexGrow: 1, overflowY: "auto" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/booktickets" element={<BookTickets />} />{" "}
            {/* New route */}
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
