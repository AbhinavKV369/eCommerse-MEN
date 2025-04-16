const User = require("../models/user");
const Message = require("../models/message");
const jwt = require("jsonwebtoken");
const { hashTheValue, compareTheValue } = require("../services/hashing");
const { generateOTP, sendOTP } = require("../services/nodeMailer");

const secret = process.env.JWT_SECRET;

async function handlePostRegister(req, res) {
  const { name, phone, email, password } = req.body;

  if (!name || !phone || !email || !password) {
    return res.status(400).render("client/register", {
      message: "All fields are required",
      formData: req.body,
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render("client/register", {
        message: "User already exists",
        formData: req.body,
      });
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).render("client/register", {
        message:
          "Password must be at least 8 characters long, contain one letter, one number, and one special character.",
        formData: req.body,
      });
    }

    const hashedPassword = await hashTheValue(password, 12);
    const otpCode = generateOTP(6);
    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      otp: otpCode,
      otpExpires: Date.now() + 5 * 60 * 1000,
    });

    await newUser.save();
    await sendOTP(email, otpCode);

    const payload = { user: { id: newUser.id } };
    const token = jwt.sign(payload, secret);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).render("client/verify-otp", {
      formData: req.body,
      email,
      message: "OTP sent to your email",
    });
  } catch (error) {
    res.status(400).render("client/server-error", {
      message: error.message,
    });
  }
}

async function handlePostOtp(req, res) {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).render("client/verify-otp", {
        message: "User not found",
        email,
        formData: req.body,
      });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).render("client/verify-otp", {
        email,
        message: "Invalid OTP or OTP expired",
        formData: req.body,
      });
    }

    user.isVerified = true;
    user.userStatus = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).render("client/home", {
      message: "OTP verified successfully!",
    });
  } catch (error) {
    return res.render("client/server-error", {
      message: error.message,
    });
  }
}

async function handlePostLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).render("client/login", {
      message: "All fields are required",
      formData: req.body,
    });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).render("client/login", {
        message: "User not found",
      });
    }

    const isPasswordMatch = await compareTheValue(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).render("client/login", {
        message: "Incorrect Password",
        formBody: req.body,
      });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, secret, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(400).render("client/home");
  } catch (error) {
    res.status(400).render("client/server-error", {
      message: error.message,
    });
  }
}

async function handlePostEditProfile(req, res) {
  const { name, phone, email, address } = req.body;

  try {
    const updatedFields = {
      name,
      phone,
      email,
      address: {
        street: address.street,
        city: address.city,
        district: address.district,
        state: address.state,
        pincode: address.pincode,
      },
    };

    const user = await User.findByIdAndUpdate(req.user.id, updatedFields, {
      new: true,
    });

    if (!user) {
      return res.render("client/edit-profile", {
        user: {},
        message: "User not found",
      });
    }

    res.render("client/edit-profile", {
      user,
      message: "Profile updated successfuly",
    });
  } catch (error) {
    res.render("client/edit-profile", {
      message: error.message,
    });
  }
}

async function handlePostChangePassword(req, res) {
  const { password, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).render("client/change-password", {
        user,
        message: "User not found",
        formData: req.body,
      });
    }

    const isPasswordMatch = await compareTheValue(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).render("client/change-password", {
        user,
        message: "Old password is incorrect",
        formData: req.body,
      });
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).render("client/change-password", {
        message:
          "New password must be at least 8 characters long, contain one letter, one number, and one special character.",
        formData: req.body,
      });
    }
    const hashedPassword = await hashTheValue(newPassword, 12);

    user.password = hashedPassword;
    await user.save();

    res.status(200).render("client/home", {
      message: "Password changed succesfully",
    });
  } catch (error) {
    res.status(500).render("client/server-error", {
      message: error.message,
    });
  }
}

async function handleGetEditProfile(req, res) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.json({ message: "User not found" });
    }

    res.render("client/edit-profile", {
      user,
      message: null,
    });
  } catch (error) {
    res.render("client/edit-profile", {
      message: error.message,
    });
  }
}

async function handleSubmitMessage(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).render("client/contact", {
        message: "All fields are required.",
      });
    }

    const newMessage = new Message({
      name,
      email,
      subject,
      message,
    });

    await newMessage.save();
    res.redirect("/contact");
  } catch (error) {
    res.status(500).render("client/server-error", {
      message: error.message,
    });
  }
}

async function handleLogout(req, res) {
  try {
    res.clearCookie("token", { httpOnly: true });
    res.redirect("/");
  } catch (error) {
    res.status(500).render("client/server-error", {
      message: error.message,
    });
  }
}

async function handleDeleteAccount(req, res) {
  await User.findByIdAndDelete(req.user.id);

  res.clearCookie("token");

  res.render("client/home", {
    message: "Account deletion successfull",
  });
}

async function handleGetHome(req, res) {
  res.render("client/home", {
    message: null,
  });
}

async function handleGetRegister(req, res) {
  res.render("client/register", {
    message: null,
    formData: {},
  });
}

async function handleGetOtp(req, res) {
  res.render("client/verify-otp", {
    message: null,
    formData: {},
  });
}

async function handleGetLogin(req, res) {
  res.render("client/login", {
    message: null,
    formData: {},
  });
}

async function handleGetUserDashboard(req, res) {
  res.render("client/user-dashboard");
}

async function handleGetChangePassword(req, res) {
  const user = await User.findById({ _id: req.user.id });
  res.render("client/change-password", {
    user,
    message: null,
    formData: {},
  });
}

async function handleGetServerError(req, res) {
  res.status(500).render("client/server-error");
}

module.exports = {
  handlePostRegister,
  handlePostOtp,
  handlePostLogin,
  handlePostEditProfile,
  handleSubmitMessage,
  handlePostChangePassword,

  handleLogout,
  handleDeleteAccount,

  handleGetHome,
  handleGetRegister,
  handleGetOtp,
  handleGetLogin,
  handleGetUserDashboard,
  handleGetEditProfile,
  handleGetChangePassword,
  handleGetServerError,
};
