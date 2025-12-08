const userInteractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: "Venue" },

  action: {
    type: String,
    enum: ["view", "like", "dislike", "checkin", "rate"]
  },

  rating: Number

}, { timestamps: true });

module.exports = mongoose.model("UserInteraction", userInteractionSchema);
