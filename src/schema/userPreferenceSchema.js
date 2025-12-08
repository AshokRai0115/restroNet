const mongoose = require("mongoose");

const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  preferredCuisines: [String],

  preferredPriceRange: {
    type: String,
    enum: ['low', 'medium', 'high', 'luxury']
  },

  preferredAmbience: [String],  // romantic, family etc

  dietary: {
    isVeg: Boolean,
    isVegan: Boolean,
    isHalal: Boolean,
    isGlutenFree: Boolean,
    isKetoFriendly: Boolean
  },

  maxDistance: {
    type: Number,
    default: 5000   // 5km
  }

}, { timestamps: true });

module.exports = mongoose.model("UserPreference", userPreferenceSchema);
