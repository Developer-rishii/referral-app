import React, { useState } from "react";
import "./App.css";
import Logo from './assets/helperYt.png';

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    referralCode: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

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

    try {
      const response = await fetch("https://referral-app-backend-z035.onrender.com/submit", {
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
        setTimeout(() => {
          window.location.href = "https://www.linkedin.com/company/helper-yt";
        }, 1000);
      } else {
        throw new Error(result.error || "Unknown error occurred.");
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
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
      <button onClick={submitForm}>Submit</button>
      <p className={`message ${messageType}`}>{message}</p>
    </div>
  );
}

export default App;
