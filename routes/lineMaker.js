const express = require("express");

const C = require("../controllers/lineMaker");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/settime", protect, C.setTime);

router.get("/allbooking", protect, C.allBooking);

router.get("/getcommercelinemaker", protect, C.getCommerceLineMaker);

router.get("/getcommercelinemakeradmin/:id", protect, C.getCommerceLineMakerPanel);

router.get("/allbookme", protect, C.allBookMe);

router.get("/getlinemakerinfo", protect, C.allBooking);

router.get("/alllinemaker", protect, C.allLineMaker);

router.get("/alllinemakerfororder/:id", protect, C.allLineMakerInTruck); 

router.get("/deletebook/:id", protect, C.deleteBook);

router.get("/approveqrcode/:invoicenumber",protect,C.approveQrCode)

router.get("/getbuss/:id",protect,C.getBuss)

router.post("/bookingtime", protect, C.booking);

router.post("/upbook/:id", protect, C.update);

router.post("/changeprice/:time/:price", protect, C.changePrice);

router.get("/rejectlinemaker/:id", protect, C.rejectLineMakerCommerce);

router.get("/rejectlinemakeradmin/:lineMakerId/:bussId", protect, C.rejectLineMakerCommerceAdmin);

// router.get("/rejectBook/:id", protect, C.rejectBook);

// router.get("/rejectBook/:id",protect,C.rejectNew)

router.get("/rejectbook/:id",protect,C.rejectBook)

router.get("/quqe/:id",C.getRemainQuqe);





module.exports = router;
