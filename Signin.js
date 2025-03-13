import { useState } from "react";
import "./signin.css";
import Logo from "../imgs/logo2.png";
import BG1 from "../imgs/login-BG.png";
import BG2 from "../imgs/login-BG2.png";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../Firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import swal from "sweetalert";

const auth = getAuth(app);
const db = getFirestore(app);

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [bgLoaded, setBgLoaded] = useState(false);
  const navigate = useNavigate();

  document.title = "Amazon";

  const handleBgLoad = () => setBgLoaded(true);

  const fetchUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        console.log("User Data:", userDoc.data());
      } else {
        console.log("No user data found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      swal("Error!", "Please enter both email and password!", "error");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      const user = userCredential.user;
      console.log("Login successful!");

      // Fetch correct user data from Firestore
      await fetchUserData(user.uid);

      navigate("/home"); // Redirect to homepage
    } catch (error) {
      console.error("Login error:", error.message);
      swal("Error!", error.message, "error");
    }
  };

  return (
    <div className="signin-page">
      <div className="login-navbar">
        <div className="main-logo">
          <img src={Logo} className="amazon-logo" alt="Amazon Logo" />
        </div>
      </div>

      <div className="background">
        <img src={BG1} className="BG1" onLoad={handleBgLoad} alt="Background 1" />
        <img src={BG2} className="BG2" onLoad={handleBgLoad} alt="Background 2" />
      </div>

      {bgLoaded && (
        <div className="main-form">
          <div className="login-form">
            <div className="some-text">
              <p className="user">User Login</p>
              <p className="user-desc">Hey, Enter your details to sign in</p>
            </div>
            <div className="user-details">
              <input
                type="email"
                placeholder="Enter Email"
                className="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <div className="error-message">{emailError}</div>}

              <input
                type="password"
                placeholder="Passcode"
                className="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <div className="error-message">{passwordError}</div>}

              <button onClick={handleLogin} className="signin-btn">
                Sign in
              </button>

              {/* Create New User Link */}
              <div className="create-account">
                <p>Don't have an account?</p>
                <Link to="/signup" className="signup-link">Create a new user</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signin;
