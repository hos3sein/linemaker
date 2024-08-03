const mongoose = require("mongoose");
const ShortUniqueId = require("short-unique-id");

const BookingSchema = new mongoose.Schema(
  {
    time: { type: String },

    booking: { type: Boolean, default: false },

    price: { type: Number, min: 0, max: 900000000000 },

    driver: {
      _id: { type: mongoose.Schema.ObjectId },
      companyName: { type: String },
      profileCompany: { type: String },
      phone: { type: String },
      transportCapacity: { type: Number },
      truckType: { type: Number },
      truckPlate: { type: String },
    },

    lineMaker: {
      type: mongoose.Schema.ObjectId,
    },

    orderId: {
      type: String,
    },

    where: {
      type: Number,
    },

    end: {
      type: Boolean,
      default: false,
    },

    day:{type: String },

    isActive: { type: Boolean, default: false },

    invoiceNumber: {
      type: String,
      default: "",
    },
    qrUrl:{
      type: String,
    },
    quqeNumber:{
      type:Number
    },
    remainQuqe:{
      type:Number
    }    
  },
  { timestamps: true }
);



module.exports = mongoose.model("Booking", BookingSchema);
//
