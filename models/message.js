const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
     email:{
        type: String,
        required:true,
    },
     subject:{
        type: String,
        required:true,
    },
     message:{
        type: String,
        required:true,
    },
    date:{
        type: Date,
        default:Date.now
    }
})

const Message = mongoose.model("Message",messageSchema);

module.exports = Message;