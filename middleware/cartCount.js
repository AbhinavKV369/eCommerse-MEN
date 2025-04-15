const Cart = require("../models/cart");

async function handleCartCount(req,res,next) {
    const user = req.user.id ;
     try{
        if(req.user){
        const cart = await Cart.findOne({user:user});

        const totalItems = cart ? cart.items.reduce((sum,item) => sum + item.quantity,0):0;
        res.locals.totalCartItems = totalItems;
        next();
        }else{
              res.locals.totalCartItems = 0;
        }
    }catch(error){
         res.status(500).render("client/server-error",{
         message: error.message,
       })
    }
}

module.exports = handleCartCount;