const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const LineMaker = require("../models/LineMaker");

const { refreshGLIne } = require("../utils/refresh");

exports.createLineMaker = asyncHandler(async (req, res, next) => {
  console.log("", req.body);
  const create = await LineMaker.create(req.body);
  await refreshGLIne();
  res.status(200).json({
    success: true,
    data: {},
  });
});
