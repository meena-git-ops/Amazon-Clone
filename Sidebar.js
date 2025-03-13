import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaShoppingCart, FaHeart, FaBox, FaUser } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Close button */}
      <button className="close-btn" onClick={toggleSidebar}>×</button>

      <h3></h3>
      <ul>
        <li><Link to="/home" onClick={toggleSidebar}><FaHome /> Home</Link></li>
        <li><Link to="/cart" onClick={toggleSidebar}><FaShoppingCart /> Shopping Cart</Link></li>
        <li><Link to="/wishlists" onClick={toggleSidebar}><FaHeart /> Wishlists</Link></li>
        <li><Link to="/orders" onClick={toggleSidebar}><FaBox /> Orders</Link></li>
        <li><Link to="/account" onClick={toggleSidebar}><FaUser /> Profile</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
