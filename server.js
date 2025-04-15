const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const dbConnect = require("./dbConnect/dbConnect");
const userAuth = require("./middleware/userAuth");
const handleCartCount = require("./middleware/cartCount")

const homeRoutes = require("./routes/home");
const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");
const adminRoutes = require("./routes/admin");
const orderRoutes = require("./routes/order");

const app = express();
const PORT = process.env.PORT || 5003;

dbConnect("mongodb://127.0.0.1:27017/truck-haulers");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve("public")));
app.use(cors({ Credential: true }));

app.use(userAuth,handleCartCount);

app.set("view engine", "ejs");
app.set("views", path.resolve("views")); // ?

app.use("/", homeRoutes,userRoutes,cartRoutes,orderRoutes);
app.use("/admin", adminRoutes);


app.listen(PORT, () => {
  console.log("Server connected at port", PORT);
});
