const Order = require("../models/order");
const Cart = require("../models/cart");
const User = require("../models/user");

async function handleGetCheckout(req, res) {
  const user = req.user.id;

  try {
    const cart = await Cart.findOne({ user }).populate("items.product");
    const userDetails = await User.findById({ _id: user });

    res.status(200).render("client/checkout", {
      userDetails,
      address: userDetails.address,
      cart,
      items: cart.items,
    });
  } catch (error) {
    res.status(500).render("client/server-error", {
      error: error.message,
    });
  }
}

async function handleOrderSummary(req, res) {
  const { address, paymentMethod } = req.body;
  const user = await User.findOne({ _id: req.user.id });
  try {
    const cart = await Cart.findOne({ user }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.redirect("/cart");
    }

    const orderedItems = cart.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));

    const totalAmount = cart.items.reduce((sum, item) => {
      const product = item.product.price * item.quantity;
      const tax = product * 0.3;
      return sum + product + tax;
    }, 0);

    const newOrder = new Order({
      user,
      items: orderedItems,
      totalAmount,
      address: {
        street: address.street,
        city: address.city,
        district: address.district,
        state: address.state,
        pincode: address.pincode,
      },
      orderDate: Date.now(),
      paymentMethod,
      status: "pending",
    });

    await newOrder.save();

    cart.items = [];
    await cart.save();

    res.status(200).render("client/order-summary", {
      items: orderedItems,
      user,
    });
  } catch (error) {
    res.status(500).render("client/server-error", {
      message: error.message,
    });
  }
}

async function handleGetMyOrders(req, res) {
  const user = req.user.id;
  try {

    const orders = await Order.find({ user: user }).populate("items.product");
    res.status(200).render("client/my-orders",{
      orders
    });

  } catch (error) {
    res.status(500).render("client/server-error", {
      message: error.message,
    });
  }
}

async function handleCancelOrder(req,res) {
  const user = req.user.id;
  const orderId = req.params.id;
  try{
   const order = await Order.findOne({  user: user,_id: orderId });
   
   order.status = "cancelled"
   await order.save()

   res.redirect("/my-orders")

  }catch(error){
  res.status(500).render("client/server-error", {
      message: error.message,
    });
  }
}

module.exports = {
  handleGetCheckout,
  handleOrderSummary,
  handleGetMyOrders,
  handleCancelOrder,
};
