const User = require("../models/user");
const Product = require("../models/product");

async function handleGetHome(req,res) {
   res.render("client/home");
}

async function handleGetProducts(req, res) {
  try {
    const products = await Product.find({});

    res.render("client/products", {
      products,
    });
  } catch (error) {
    res.status(500).render("client/server-error", {
      message: error.message,
    });
  }
}

async function handleFilterProducts(req, res) {
  const { search, category,sortBy } = req.body;
    const sortOrder = sortBy === "low-to-high" ? 1 : -1
  try {
      const products = await Product.find({
  $and: [
    { name: { $regex: search, $options: "i" } },
    { category: { $regex: category, $options: "i" } },
  ]
}).sort({ price: sortOrder })
      res.status(200).render("client/products", {
        products,
        search,
        category,
        sortBy,
      });
  } catch (error) {
    res.status(500).render("client/server-error", {
      message: error.message,
    });
  }
} 

async function handleGetBuses(req, res) {
  try {
    const buses = await Product.find({ category: "bus" });
    res.render("client/buses", {
      buses,
    });
  } catch (error) {
    res.status(500).render("client/server-error", {
      message: error.message,
    });
  }
}

async function handleGetTrucks(req, res) {
  try {
    const trucks = await Product.find({ category: "truck" });

    res.render("client/trucks", {
      trucks,
    });
  } catch (error) {
    res.status(500).render("client/server-error", {
      message: error.message,
    });
  }
}

async function handleGetLightVehicles(req, res) {
  try {
    const lmvs = await Product.find({ category: "lmv" });

    res.render("client/light-vehicles", {
      lmvs,
    });
  } catch (error) {
    res.status(500).render("client/server-error", {
      message: error.message,
    });
  }
}

async function handleGetMediumVehicles(req, res) {
  try {
    const mmvs = await Product.find({ category: "mmv" });

    res.render("client/medium-vehicles", {
      mmvs,
    });
  } catch (error) {
    res.status(500).render("client/server-error", {
      message: error.message,
    });
  }
}

async function handleGetService(req,res) {
   res.render("client/services");
}

async function handleGetAbout(req,res) {
   res.render("client/about");
}

async function handleGetContact(req, res) {
  const user = await User.findById(req.user.id);
  res.render("client/contact", {
    user,
  });
}

async function handleGetServerError(req,res) {
   res.render("client/server-error");
}

module.exports = {
  handleGetHome,
  handleGetProducts,
  handleFilterProducts,
  handleGetBuses,
  handleGetTrucks,
  handleGetLightVehicles,
  handleGetMediumVehicles,
  handleGetService,
  handleGetAbout,
  handleGetContact,
  handleGetServerError,
};
