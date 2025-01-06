const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const connectToMongoDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://rushikeshsawarkar14:rishi123@cluster0.bd63z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    console.log("MongoDB URI:", MONGO_URI);

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err.message || err);
    console.error("Error stack trace:", err.stack);

    // Optional: Retry logic if needed
    setTimeout(() => {
      console.log("Retrying MongoDB connection...");
      connectToMongoDB();
    }, 5000); // Retry after 5 seconds
  }
};

// Initialize connection
connectToMongoDB();

// Define the schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  referralCode: String,
});

// Cache models to avoid redefining them
const modelsCache = {};

// Function to get or create a model
function getModelByReferralCode(referralCode) {
  let collectionName;
  if (referralCode === "RISHI123") {
    collectionName = "user1";
  } else if (referralCode === "VANSH123") {
    collectionName = "user2";
  } else {
    return null; // Invalid referral code
  }

  if (!modelsCache[collectionName]) {
    modelsCache[collectionName] = mongoose.model(collectionName, userSchema, collectionName);
  }

  return modelsCache[collectionName];
}

// Route to handle form submission
app.post("/submit", async (req, res) => {
  const { name, email, referralCode } = req.body;

  if (!name || !email || !referralCode) {
    return res.status(400).send({ error: "All fields are required." });
  }

  try {
    // Get the appropriate model based on the referral code
    const UserModel = getModelByReferralCode(referralCode);

    if (!UserModel) {
      return res.status(400).send({ error: "Invalid referral code." });
    }

    // Save the user data to the appropriate collection
    const user = new UserModel({ name, email, referralCode });
    await user.save();

    res.status(201).send({
      message: "User data saved successfully.",
    });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).send({ error: "Error saving user data." });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
