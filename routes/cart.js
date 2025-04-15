const express = require("express");

const authorisedUser = require("../middleware/userAuth")
const { handlegetCart, handleAddToCart, handleDeleteCartItem } = require("../controllers/cart");

const router = express.Router();

router.post("/add-cart",authorisedUser,handleAddToCart);
router.post("/remove-item/:id",authorisedUser,handleDeleteCartItem);

router.get("/cart",authorisedUser,handlegetCart);


module.exports = router;