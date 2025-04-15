const express = require("express");

const authorizedUser = require("../middleware/userAuth");
const { handleGetCheckout, handleOrderSummary, handleGetMyOrders, handleCancelOrder } = require("../controllers/order");

const router = express.Router();

router.post("/order-summary",authorizedUser,handleOrderSummary);
router.post("/cancel-order/:id",authorizedUser,handleCancelOrder);

router.get("/checkout",authorizedUser,handleGetCheckout);
router.get("/my-orders",authorizedUser,handleGetMyOrders);

module.exports = router;