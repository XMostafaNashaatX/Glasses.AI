// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./message";  // Assuming you meant LoginPage component
import Home from "./Home";
import UserProfile from "./UserProfile"; // Import the UserProfile component
import CartPage  from "./CartPage"
import Order  from "./Order"
const App: React.FC = () => {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<UserProfile firstName={""} lastName={""} middleName={""} gender={""} phoneNumber={""} emailAddress={""} password={""} />} /> {/* Add UserProfile route */}
      </Routes>
    </Router>
  );
};

export default App;
