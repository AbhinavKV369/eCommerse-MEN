const express = require("express");

const {
  handlePostRegister,
  handlePostOtp,
  handlePostLogin,
  handlePostEditProfile,
  handleSubmitMessage,
  handlePostChangePassword,
  handleDeleteAccount,
  handleGetHome,
  handleGetRegister,
  handleGetOtp,
  handleGetLogin,
  handleGetUserDashboard,
  handleGetEditProfile,
  handleGetChangePassword,
  handleLogout,
  handleGetServerError,
} = require("../controllers/user");

const authorisedUser = require("../middleware/userAuth");

const router = express.Router();

router.post("/register", handlePostRegister);
router.post("/verify-otp", handlePostOtp);
router.post("/login", handlePostLogin);
router.post("/edit-profile", authorisedUser, handlePostEditProfile);
router.post("/submit-message", authorisedUser, handleSubmitMessage);
router.post("/change-password", authorisedUser, handlePostChangePassword);
router.post("/delete-account", authorisedUser, handleDeleteAccount);

router.get("/", handleGetHome);
router.get("/register", handleGetRegister);
router.get("/verify-otp", handleGetOtp);
router.get("/login", handleGetLogin);
router.get("/user-dashboard", authorisedUser, handleGetUserDashboard);
router.get("/edit-profile", authorisedUser, handleGetEditProfile);
router.get("/change-password", authorisedUser, handleGetChangePassword);
router.get("/logout", authorisedUser, handleLogout);
router.get("/server-error", handleGetServerError);

module.exports = router;
