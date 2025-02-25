import React, { useState, useEffect } from "react";
import "./App.css";
import Logo from "./assets/helperYt.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    referralCode: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for Submit button
  const [watchVideoLoading, setWatchVideoLoading] = useState(false); // Separate state for Watch Video
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false); // Tracks if video was watched
  const [isSubmitUnlocked, setIsSubmitUnlocked] = useState(false); // Tracks if submit button is unlocked
  const [timer, setTimer] = useState(0); // Countdown timer in seconds

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitForm = async () => {
    const { name, email, referralCode } = formData;

    if (!name || !email || !referralCode) {
      setMessage("All fields are required.");
      setMessageType("error");
      return;
    }

    setLoading(true); // Start loading effect for Submit button

    try {
      const response = await fetch("https://referral-app-backend-01i9.onrender.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, referralCode }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        setMessageType("success");
      } else {
        throw new Error(result.error || "Unknown error occurred.");
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false); // Stop loading after submission
    }
  };

  const watchVideo = (e) => {
    e.preventDefault(); // Prevent default button behavior
    setWatchVideoLoading(true); // Start loading effect for Watch Video button
    setTimeout(() => {
      setWatchVideoLoading(false); // Stop loading
      window.open("https://youtu.be/puelQdvzFqc?si=eq_NvdodBldOaBa9", "_blank"); // Open video in a new tab
      setHasWatchedVideo(true); // Mark video as watched

      // Set timer for 5 minutes
      setTimer(5 * 60); // 5 minutes in seconds

      // Start countdown timer
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval); // Stop the timer when it reaches 0
            setIsSubmitUnlocked(true); // Unlock the submit button
            return 0;
          }
          return prev - 1;
        });
      }, 1000); // Decrement timer every second
    }, 2000); // 2-second delay
  };

  // Helper function to format timer as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="container">
      <img src={Logo} alt="Helper YT" />
      <h1>Enter Your Details</h1>
      <input
        type="text"
        name="name"
        placeholder="Enter your name"
        value={formData.name}
        onChange={handleInputChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="referralCode"
        placeholder="Enter referral code"
        value={formData.referralCode}
        onChange={handleInputChange}
      />
      <button onClick={(e) => watchVideo(e)} disabled={watchVideoLoading || loading}>
        {watchVideoLoading ? "Loading..." : "Watch Video"}
      </button>

      <button
        onClick={submitForm}
        disabled={!isSubmitUnlocked || loading} // Activate only after timer ends
      >
        {loading
          ? "Submitting..."
          : isSubmitUnlocked
          ? "Submit"
          : timer > 0
          ? `${formatTime(timer)}`
          : "Submit (Locked)"}
          {/* <FontAwesomeIcon icon={faLock} style={{ color: "#303030", fontSize: "20px" }} /> */}
      </button>

      <p className={`message ${messageType}`}>{message}</p>
    </div>
  );
}

export default App;
