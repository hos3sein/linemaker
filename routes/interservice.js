const express = require("express");

const C = require("../controllers/interservice");

const router = express.Router();

// POST
router.post("/createlinemaker", C.createLineMaker);

// router.post("/createbuy", C.createBuy);

// router.get("/dellall", C.delAll);

module.exports = router;
