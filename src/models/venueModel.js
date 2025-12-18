const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema({

  // ========== BASIC INFO ==========
  restaurant_name: {
    type: String,
    required: true,
    trim: true
  },

  description: String,

  cuisine: {
    type: [String],
    required: true
  },

  tags: {type: [String]},

  signatureDishes: [String],
  chefSpecial: String,

  menuUrl: String,

  // ========== LOCATION ==========
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],   // [lon, lat]
      required: true
    }
  },

  // ========== CONTACT ==========
  restaurant_contact: String,
  restaurant_email: String,
  website: String,

  // ========== MEDIA ==========
  images: [String],
  logo: String,
  gallery: [String],
  videoTour: String,

  // ========== RECOMMENDATION METRICS ==========
  averageRating: { type: Number, default: 0 },
  ratingsCount: { type: Number, default: 0 },

  trendingScore: { type: Number, default: 0 },
  popularityScore: { type: Number, default: 0 },
  seasonalScore: { type: Number, default: 0 },

  views: { type: Number, default: 0 },
  checkIns: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },

  priceRange: {
    type: String,
    enum: ['low', 'medium', 'high', 'luxury'],
    default: 'medium'
  },

  avgMealCost: Number,

  // ========== DIETARY & FOOD STYLE ==========
  isVeg: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false },
  isHalal: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false },
  isKetoFriendly: { type: Boolean, default: false },

  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'extra-hot']
  },

  // ========== FEATURES ==========
  features: {
    wifi: Boolean,
    parking: Boolean,
    rooftop: Boolean,
    liveMusic: Boolean,
    djNight: Boolean,
    outdoorSeating: Boolean,
    privateDining: Boolean,
    smokingZone: Boolean,
    wheelchairAccess: Boolean,
    petsAllowed: Boolean
  },

  // ========== DINING EXPERIENCE ==========
  ambience: {
    type: String,
    enum: ['romantic', 'family', 'party', 'business', 'quiet', 'luxury', 'casual']
  },

  crowdLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'very-high'],
    default: 'medium'
  },

  musicType: {
    type: String,
    enum: ['live', 'dj', 'soft', 'none']
  },

  bestTimeToVisit: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'night']
  },

  goodFor: [{
    type: String,
    enum: ['dates', 'family', 'business', 'birthdays', 'meetings', 'groups']
  }],

  // ========== TIME ==========
  openingHours: {
    open: String,
    close: String
  },

  busyHours: [{
    start: String,
    end: String
  }],

  happyHours: [{
    start: String,
    end: String,
    discount: Number
  }],

  // ========== ML/AI ==========
  similarityVector: [Number], // For AI / ML recommendation
  vectorUpdatedAt: Date,

  // ========== PAYMENTS ==========
  paymentMethods: [{
    type: String,
    enum: ['cash', 'card', 'esewa', 'khalti', 'fonepay']
  }],


}, { timestamps: true });

venueSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Venue", venueSchema);
