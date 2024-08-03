const mongoose = require("mongoose");

const LineMakerSchema = new mongoose.Schema(
  {
    user: {
      _id: { type: mongoose.Schema.ObjectId },
      username: { type: String },
      pictureProfile: { type: String },
    },

    group: {
      type: String,
    },

    companyName: {
      type: String,
    },

    companyAddress: [
      {
        address: { type: String },
        nameAddress: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
        target: { type: Number },
        city: { type: String },
        province: { type: String },
        district: { type: String },
        street: { type: String },
        country: { type: String },
        streetNumber: { type: String },
        _id: false,
      },
    ],

    businessMan: {
      type: mongoose.Schema.ObjectId,
    },

    profileCompany: {
      type: String,
    },

    disabledDays: [String],

    booking: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Booking",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("LineMaker", LineMakerSchema);
