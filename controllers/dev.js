const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const fetch = require("node-fetch");

const Booking = require("../models/Booking");
const LineMaker = require("../models/LineMaker");
const {refreshTruckQr}=require("../utils/refresh")
// });

exports.delAll = asyncHandler(async (req, res, next) => {
  await LineMaker.deleteMany();

  await Booking.deleteMany();

  res.status(200).json({
    success: true,
    data: {},
  }); 
});

exports.all = asyncHandler(async (req, res, next) => {
  const all = await LineMaker.find().populate({
    path: "booking",
  });

  res.status(200).json({
    success: true,
    data: all,
  });
});
exports.testQr = asyncHandler(async (req, res, next) => {
  await refreshTruckQr()
  res.status(200).json({
    success: true,
    data: all,
  });
});

exports.delBook = asyncHandler(async (req, res, next) => {
  console.log("hey");
  await Booking.remove();
  const all=await LineMaker.find()
  all.forEach(async(item)=>{
    await LineMaker.findByIdAndUpdate(item._id,{booking:[]})
  })
  res.status(200).json({
    success: true,
    data: {},
  });
})
 
exports.up = asyncHandler(async (req, res, next) => {
  const { disabledDays } = req.body;
  const all = await LineMaker.findByIdAndUpdate(req.params.id, {
    disabledDays,
  });

  res.status(200).json({
    success: true,
    data: all,
  });
});
exports.deleteAllBook= asyncHandler(async (req, res, next) => {
 
 const all= await LineMaker.find()

  all.forEach(async(element) => {
    await LineMaker.findByIdAndUpdate(element._id,{
      booking:[]
    })
  });

  const book=await Booking.find()

  book.forEach(async(book)=>{
    await Booking.findByIdAndRemove(book._id)
  })

  res.status(200).json({
    success: true,
  });
});