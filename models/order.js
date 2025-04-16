const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    items:[{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Product"
        },
        quantity:{
            type: Number,
            required:true,
        }
    }],
    totalAmount:{
        type:String,
        required:true,
    },
    address: {
      street: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      district: {
        type: String,
        default: "",
      },
      state: {
        type: String,
        default: "",
      },
      pincode: {
        type: String,
        default: null,
      },
    },
    paymentMethod:{
        type: String,
        enum:["cod","online"],
        required:true
    },
    status:{
        type:String,
        enum:["pending","shipped","delivered","canceled"],
        default:"pending",
    },
    orderDate:{
        type:Date,
        default:Date.now()
    }
},{ timestamps: true });

const Order = mongoose.model("Order",orderSchema);

module.exports = Order;