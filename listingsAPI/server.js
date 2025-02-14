/********************************************************************************
 *  WEB422 – Assignment 1
 *
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 *  Name: Asif Karim
 *  Student ID: ____________
 *  Date: February 2, 2025
 *  Published URL: https://your-vercel-url.vercel.app
 ********************************************************************************/

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Validate required environment variables
if (!process.env.MONGODB_CONN_STRING) {
  console.error(
    "FATAL ERROR: MONGODB_CONN_STRING environment variable not set"
  );
  process.exit(1);
}

// Health Check Endpoint
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "API Listening",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.post("/api/listings", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body cannot be empty" });
    }
    const listing = await db.addListing(req.body);
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({
      error: "Failed to create listing",
      details: err.message,
    });
  }
});

app.get("/api/listings", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const name = req.query.name?.trim();

    if (page < 1 || perPage < 1) {
      return res.status(400).json({
        error: "Page and perPage must be positive integers",
      });
    }

    const listings = await db.getListings(page, perPage, name);
    res.json({
      page,
      perPage,
      results: listings,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch listings",
      details: err.message,
    });
  }
});

app.get("/api/listings/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const listing = await db.getListingById(req.params.id);
    listing
      ? res.json(listing)
      : res.status(404).json({ error: "Listing not found" });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch listing",
      details: err.message,
    });
  }
});

app.put("/api/listings/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const listing = await db.updateListing(req.params.id, req.body);
    listing
      ? res.json(listing)
      : res.status(404).json({ error: "Listing not found" });
  } catch (err) {
    const statusCode = err.message.includes("validation") ? 400 : 500;
    res.status(statusCode).json({
      error: "Failed to update listing",
      details: err.message,
    });
  }
});

app.delete("/api/listings/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await db.deleteListing(req.params.id);
    result
      ? res.status(204).end()
      : res.status(404).json({ error: "Listing not found" });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete listing",
      details: err.message,
    });
  }
});

// Database and Server Initialization
const initializeServer = async () => {
  try {
    await db.initialize(process.env.MONGODB_CONN_STRING);
    console.log("Database connected successfully");

    if (process.env.NODE_ENV !== "production") {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      });
    }
  } catch (err) {
    console.error("Server initialization failed:", err.message);
    process.exit(1);
  }
};

initializeServer();

module.exports = app;
