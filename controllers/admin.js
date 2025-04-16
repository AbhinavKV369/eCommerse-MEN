const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const Message = require("../models/message");

async function handleGetUsers(req, res) {
  const users = await User.find({});
  res.status(200).render("admin/manage-users", {
    users,
  });
}

async function handleGetUserProfile(req, res) {
  const user = await User.findById(req.params.id);
  res.status(200).render("admin/edit-user-profile", {
    user,
    message: null,
  });
}

async function handleUpdateUserProfile(req, res) {
  const { name, email, phone } = req.body;
  try {
    updatedFields = { name, email, phone };
    await User.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    res.redirect("/admin/manage-users");
  } catch (error) {
    res.status(500).render("server-error", {
      message: error.message,
    });
  }
}

async function handleUserStatus(req,res) {
  const user = await User.findById(req.params.id);
  const newStatus = !user.isBlocked;
  try{
    await User.findByIdAndUpdate(req.params.id, {isBlocked:newStatus}, {new:true});
    res.redirect("/admin/manage-users");  
  }catch(error){
    res.status(500).render("admin/server-error", {
      message: error.message,
    });
  }
}

async function handleGetSearchUsers(req, res) {
  const { search } = req.body;
  try {
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    });
    res.status(200).render("admin/manage-users", {
      users,
    });
  } catch (error) {
    res.status(500).render("server-error", {
      message: error.message,
    });
  }
}

async function handlePostAddProducts(req, res) {
  const { name, description, price, category } = req.body;
  try {
    const productImage = req.file ? "/uploads/" + req.file.filename : null;
    const newProduct = new Product({
      name,
      description,
      productImage,
      price,
      category,
    });
    await newProduct.save();

    res.render("admin/add-products", {
      message: "Product added successfully",
    });
  } catch (error) {
    res.status(500).render("admin/server-error", {
      message: error.message,
    });
  }
}

async function handleGetAddProducts(req, res) {
  res.render("admin/add-products", {
    message: null,
  });
}

async function handleGetProducts(req, res) {
  const products = await Product.find({});
  res.status(200).render("admin/manage-products", {
    products,
  });
}

async function handleDeleteProducts(req, res) {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/admin/manage-products");
  } catch (error) {
    res.status(500).render("server-error", {
      message: error.message,
    });
  }
}

async function handleGetMessages(req, res) {
  const messages = await Message.find({});
  res.status(200).render("admin/user-messages", {
    messages,
  });
}

async function handleGetManageOrders(req, res) {
  const orders = await Order.find({}).populate("user");

  res.status(200).render("admin/manage-orders", {
    orders,
  });
}

async function handleOrderStatus(req, res) {
  const { orderStatus } = req.body;
  const orderId = req.params.id;
  try {
    const order = await Order.findById({ _id: orderId });

    order.status = orderStatus;
    await order.save();
    res.redirect("/admin/manage-orders");
  } catch (error) {
    res.status(200).render("admin/server-error", {
      message: error.message,
    });
  }
}

async function handleDeleteOrder(req, res) {
  const orderId = req.params.id;
  try {
    await Order.findByIdAndDelete({ _id: orderId });
    res.redirect("/admin/manage-orders");
  } catch (error) {
    res.status(200).render("client/server-error", {
      message: error.message,
    });
  }
}

async function handleGetSearchMessages(req, res) {
  const { search } = req.body;
  try {
    const messages = await Message.find({
      $or: [
        { subject: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    });

    res.status(200).render("admin/user-messages", {
      messages,
    });
  } catch (error) {
    res.status(500).render("server-error", {
      message: error.message,
    });
  }
}

async function handleDeleteMessages(req, res) {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.redirect("/admin/user-messages");
  } catch (error) {
    res.status(500).render("server-error", {
      message: error.message,
    });
  }
}

module.exports = {
  handleGetUsers,
  handleGetSearchUsers,
  handleGetUserProfile,
  handleUpdateUserProfile,
  handleUserStatus,
  handleGetManageOrders,
  handleOrderStatus,
  handleDeleteOrder,
  handlePostAddProducts,
  handleGetAddProducts,
  handleGetProducts,
  handleDeleteProducts,
  handleGetMessages,
  handleGetSearchMessages,
  handleDeleteMessages,
};
