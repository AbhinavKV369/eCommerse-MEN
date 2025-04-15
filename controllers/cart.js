const Cart = require("../models/cart");

async function handleAddToCart(req, res) {
  const user = req.user.id;
  const { product } = req.body;
  try {
    let cart = await Cart.findOne({ user });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === product
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ product, quantity: 1 });
      }
    } else {
      cart = new Cart({
        user,
        items: [
          {
            product,
            quantity: 1,
          },
        ],
      });
    }

    await cart.save();
    res.redirect("/cart");
  } catch (error) {
    res.render("client/server-error", {
      message: error.message,
    });
  }
}

async function handlegetCart(req, res) {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "items.product"
  );
  res.render("client/cart", {
    items: cart?.items || [],
  });
}

async function handleDeleteCartItem(req, res) {
  const user = req.user.id;
  const product = req.params.id
  try {
    await Cart.findOneAndUpdate({user},{$pull:{items:{product:product}}})
    res.redirect("/cart");
  } catch (error) {
    res.render("client/server-error", {
      message: error.message,
    });
  }
}

module.exports = {
  handlegetCart,
  handleAddToCart,
  handleDeleteCartItem,
};
