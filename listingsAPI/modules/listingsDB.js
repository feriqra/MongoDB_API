const mongoose = require("mongoose");
const Listing = require("./listingSchema");

class ListingsDB {
  constructor() {
    this.connection = null;
  }

  async initialize(dbURL) {
    if (this.connection) return;
    this.connection = await mongoose.connect(dbURL);
    console.log("Connected to MongoDB");
  }

  async addListing(data) {
    const newListing = new Listing(data);
    return await newListing.save();
  }

  async getListings(page, perPage, name) {
    const filter = name ? { name: new RegExp(name, "i") } : {};
    return await Listing.find(filter)
      .limit(perPage)
      .skip((page - 1) * perPage);
  }

  async getListingById(id) {
    return await Listing.findById(id);
  }

  async updateListing(id, data) {
    return await Listing.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteListing(id) {
    return await Listing.findByIdAndDelete(id);
  }
}

module.exports = ListingsDB;
