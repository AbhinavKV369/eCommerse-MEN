const express = require("express");

const {
  handleGetHome,
  handleGetProducts,
  handleFilterProducts,
  handleGetBuses,
  handleGetTrucks,
  handleGetLightVehicles,
  handleGetMediumVehicles,
  handleGetContact,
  handleGetService,
  handleGetAbout,
  handleGetServerError,
} = require("../controllers/home");
const authorisedUser = require("../middleware/userAuth");

const router = express.Router();

router.get("/", handleGetHome);
router.get("/products", handleGetProducts);
router.post("/products/filter", handleFilterProducts);
router.get("/buses", handleGetBuses);
router.get("/trucks", handleGetTrucks);
router.get("/light-vehicles", handleGetLightVehicles);
router.get("/medium-vehicles", handleGetMediumVehicles);
router.get("/contact", authorisedUser, handleGetContact);
router.get("/services", handleGetService);
router.get("/about", handleGetAbout);
router.get("/server-error", handleGetServerError);

module.exports = router;
