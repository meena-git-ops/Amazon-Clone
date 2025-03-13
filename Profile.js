import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./profile.css";
import { app } from "../Firebase";
import ProfileImg from "../imgs/profileimg.jpg";
import USER from "../imgs/user.png";
import CONTACT from "../imgs/contact.png";
import ADDRESS from "../imgs/address.png";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);
const db = getFirestore(app);

function Profile() {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(ProfileImg);
  const [contactNumber, setContactNumber] = useState("Loading...");
  const [address, setAddress] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  document.title = "Profile Section";

  const checkDP = (user) => {
    if (user?.photoURL) {
      setImage(
        user.photoURL.startsWith("http:")
          ? user.photoURL.replace(/^http:\/\//i, "https://")
          : user.photoURL
      );
    } else {
      setImage(ProfileImg);
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setContactNumber(userData.contact || "No contact available");
        setAddress(userData.address || "No address available");
      } else {
        setContactNumber("No contact available");
        setAddress("No address available");
      }
    } catch (error) {
      setContactNumber("Error fetching contact");
      setAddress("Error fetching address");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        checkDP(currentUser);
        fetchUserData(currentUser.uid);
      } else {
        setUser(null);
        setImage(ProfileImg);
        setContactNumber("No contact available");
        setAddress("No address available");
        setLoading(false);
      }
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="profile-section">
        <div className="account-section">
          <div className="top-section">
            <p className="welcome-mssg">
              {user ? `Welcome, ${user.displayName}` : "Welcome, Guest"}
            </p>
          </div>
          <div className="account-section2">
            <div className="left-account-section">
              <img src={image} className="profile-img" alt="Profile" />
              <p className="profile-name">{user ? user.displayName : "Guest"}</p>
              <p className="profile-email">{user ? user.email : "No email available"}</p>
              {user && (
                <button
                  onClick={() => {
                    signOut(auth);
                    setTimeout(() => navigate("/signup"), 700);
                  }}
                  className="signout-btn"
                >
                  Sign out
                </button>
              )}
            </div>
            <div className="right-account-section">
              <p className="personal-info-head">Personal Information</p>
              <p className="personal-info-desc">
                Manage your personal information, including your contact details.
              </p>
              <div className="personal-user-data">
                <div className="personal-name">
                  <div className="name-section">
                    <p className="name-data">Name</p>
                    <img src={USER} className="user-photo" alt="User Icon" />
                  </div>
                  <p className="users-name">{user ? user.displayName : "No name available"}</p>
                </div>
                <div className="personal-mail">
                  <div className="mail-section">
                    <p className="mail-data">Email</p>
                    <img src={CONTACT} className="mail-photo" alt="Contact Icon" />
                  </div>
                  <p className="users-mail">
                    {user ? `${user.email.slice(0, 15)}...` : "No email available"}
                  </p>
                </div>
                <div className="personal-name">
                  <div className="name-section">
                    <p className="contact-data">Contact Number</p>
                    <img src={CONTACT} className="user-photo" alt="Contact Icon" />
                  </div>
                  <p className="users-name">{loading ? "Loading..." : contactNumber}</p>
                </div>
                <div className="personal-mail">
                  <div className="mail-section">
                    <p className="address-data">Address</p>
                    <img src={ADDRESS} className="mail-photo" alt="Address Icon" />
                  </div>
                  <p className="users-mail">{loading ? "Loading..." : address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Removed LowerNav */}
      <Footer />
    </>
  );
}

export default Profile;
