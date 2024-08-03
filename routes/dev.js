const express = require("express");

const C = require("../controllers/dev");

const router = express.Router();

// POST
// router.post("/createperm", C.createPerm);

router.get("/dellall", C.delAll);
router.get("/dellbook", C.delBook);
router.get("/test",C.testQr)
router.get("/all", C.all);
// router.get("/delb/:id", C.delB);

router.get("/up/:id", C.up);

router.get("/delbook",C.deleteAllBook)

module.exports = router;
