const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/product.controller");


router.get("/", controller.index);

// router.get("/detail", (req, res) => {
//     res.send("trang chi tiết sản phẩm");
// });

module.exports = router;