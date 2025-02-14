const mongoose = require("mongoose");
const Listing = require("./listingSchema");

class ListingsDB {
  constructor() {
    // Use mongoose's connection state instead of custom property
    this.connection = null;
  }

  async initialize(dbURL) {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to MongoDB.");
      return;
    }

    try {
      // Remove deprecated options (useNewUrlParser and useUnifiedTopology)
      this.connection = await mongoose.connect(dbURL);
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("MongoDB connection error:", err);
      throw new Error("Failed to connect to MongoDB.");
    }
  }

  async addListing(data) {
    try {
      const newListing = new Listing(data);
      return await newListing.save();
    } catch (err) {
      throw new Error(`Error adding listing: ${err.message}`);
    }
  }

  async getListings(page = 1, perPage = 10, name) {
    try {
      const filter = name ? { name: new RegExp(name, "i") } : {};
      return await Listing.find(filter)
        .sort({ _id: 1 }) // Add sorting for consistent pagination
        .limit(perPage)
        .skip((page - 1) * perPage);
    } catch (err) {
      throw new Error(`Error fetching listings: ${err.message}`);
    }
  }

  async getListingById(id) {
    try {
      return await Listing.findById(id);
    } catch (err) {
      throw new Error(`Error fetching listing by ID: ${err.message}`);
    }
  }

  async updateListing(id, data) {
    try {
      return await Listing.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true, // Add validation on update
      });
    } catch (err) {
      throw new Error(`Error updating listing: ${err.message}`);
    }
  }

  async deleteListing(id) {
    try {
      return await Listing.findByIdAndDelete(id);
    } catch (err) {
      throw new Error(`Error deleting listing: ${err.message}`);
    }
  }
}

module.exports = ListingsDB;
