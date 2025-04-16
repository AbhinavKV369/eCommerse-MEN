const express = require("express");

const upload = require("../services/multer");

const {
  handleGetUsers,
  handleGetProducts,
  handleGetMessages,
  handleDeleteMessages,
  handleGetSearchMessages,
  handleGetSearchUsers,
  handleDeleteProducts,
  handlePostAddProducts,
  handleGetAddProducts,
  handleGetManageOrders,
  handleDeleteOrder,
  handleOrderStatus,
  handleGetUserProfile,
  handleUpdateUserProfile,
  handleUserStatus,
} = require("../controllers/admin");

const router = express.Router();

const pages = [
  { route: "/", view: "admin-panel" },
  { route: "/server-error", view: "server-error" },
];

router.post("/delete-message/:id", handleDeleteMessages);
router.post("/search-messages", handleGetSearchMessages);
router.post("/search-users", handleGetSearchUsers);

router.post("/add-product",upload.single("productImage"),handlePostAddProducts);
router.post("/delete-product/:id",handleDeleteProducts);

router.get("/manage-users", handleGetUsers);
router.get("/edit-user/:id",handleGetUserProfile);
router.post("/update-profile/:id",handleUpdateUserProfile);
router.get("/toggle-user-status/:id",handleUserStatus);

router.get("/manage-orders",handleGetManageOrders);
router.post("/update-order-status/:id", handleOrderStatus);
router.post("/delete-order/:id", handleDeleteOrder);

router.get("/add-products",handleGetAddProducts);
router.get("/manage-products", handleGetProducts);
router.get("/user-messages", handleGetMessages);

pages.forEach((page) => {
  router.get(page.route, async (req, res) => {
    try {
      res.render(`admin/${page.view}`);
    } catch (error) {
      res.status(500).render("client/server-error");
    }
  });
});

module.exports = router;
