const mongoose = require("mongoose");
const Listing = require("./listingSchema");

let connection = null;

const initialize = async (connectionString) => {
  try {
    connection = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
};

const addNewListing = async (data) => {
  const newListing = new Listing(data);
  await newListing.save();
  return newListing;
};

const getAllListings = async (page, perPage, name) => {
  const query = name ? { name: new RegExp(name, "i") } : {};
  return await Listing.find(query)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();
};

const getListingById = async (id) => {
  return await Listing.findById(id).exec();
};

const updateListingById = async (id, data) => {
  return await Listing.findByIdAndUpdate(id, data, { new: true }).exec();
};

const deleteListingById = async (id) => {
  return await Listing.findByIdAndDelete(id).exec();
};

module.exports = {
  initialize,
  addNewListing,
  getAllListings,
  getListingById,
  updateListingById,
  deleteListingById,
};
