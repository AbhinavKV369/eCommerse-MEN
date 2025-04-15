const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order")
const Message = require("../models/message");


async function handleGetUsers(req, res) {
  const users = await User.find({});
  res.status(200).render("admin/manage-users", {
    users,
  });
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

async function handleGetManageOrders(req,res) {
  const orders = await Order.find({}).populate("user");
    const products = await Order.find({}).populate("items.product")
   res.status(200).render("admin/manage-orders", {
    users: orders.user,
    orders,
    products
  });
}

async function handleDeleteOrder(req,res) {
  const orderId = req.params.id;
  try{
    await Order.findByIdAndDelete({_id:orderId})
    res.redirect("/manage-orders")
  }catch(errors

  ){
     res.status(200).render("admin/user-messages", {
    message: error.message,
  });
  }
    const orders = await Order.find({}).populate("user");
    const products = await Order.find({}).populate("items.product")
   res.status(200).render("admin/manage-orders", {
    orders,
    products
  });
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
  handleGetManageOrders,
  handleDeleteOrder,
  handlePostAddProducts,
  handleGetAddProducts,
  handleGetProducts,
  handleDeleteProducts,
  handleGetMessages,
  handleGetSearchMessages,
  handleDeleteMessages,
};
