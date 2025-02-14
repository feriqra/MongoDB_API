require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./modules/listingsDB");

const app = express();
const HTTP_PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.post("/api/listings", async (req, res) => {
  try {
    const newListing = await db.addNewListing(req.body);
    res.status(201).json(newListing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/listings", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const name = req.query.name || "";
    const listings = await db.getAllListings(page, perPage, name);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/listings/:id", async (req, res) => {
  try {
    const listing = await db.getListingById(req.params.id);
    if (listing) {
      res.json(listing);
    } else {
      res.status(404).json({ error: "Listing not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/listings/:id", async (req, res) => {
  try {
    const updatedListing = await db.updateListingById(req.params.id, req.body);
    if (updatedListing) {
      res.json(updatedListing);
    } else {
      res.status(404).json({ error: "Listing not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/listings/:id", async (req, res) => {
  try {
    const deletedListing = await db.deleteListingById(req.params.id);
    if (deletedListing) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Listing not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Initialize database and start server (for local development)
if (process.env.NODE_ENV !== "production") {
  db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => {
      app.listen(HTTP_PORT, () => {
        console.log(`Server listening on: ${HTTP_PORT}`);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// Export the app for Vercel
module.exports = app;
