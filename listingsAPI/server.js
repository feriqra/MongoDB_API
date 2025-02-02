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
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

// API routes
app.post("/api/listings", async (req, res) => {
  try {
    const listing = await db.addListing(req.body);
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/listings", async (req, res) => {
  try {
    const { page = 1, perPage = 10, name } = req.query;
    const listings = await db.getListings(Number(page), Number(perPage), name);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/listings/:id", async (req, res) => {
  try {
    const listing = await db.getListingById(req.params.id);
    listing ? res.json(listing) : res.status(404).json({ error: "Not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/listings/:id", async (req, res) => {
  try {
    const listing = await db.updateListing(req.params.id, req.body);
    listing ? res.json(listing) : res.status(404).json({ error: "Not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/listings/:id", async (req, res) => {
  try {
    await db.deleteListing(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Initialize DB before handling requests
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    console.log("Database initialized successfully");

    // Local server setup (Only if running locally)
    if (process.env.NODE_ENV !== "production") {
      const HTTP_PORT = process.env.PORT || 3000;
      app.listen(HTTP_PORT, () => {
        console.log(`Server running locally at http://localhost:${HTTP_PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("Database initialization failed:", err);
  });

// Export app for Vercel deployment
module.exports = app;
