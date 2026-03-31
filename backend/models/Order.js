import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please use a valid email address"]
    },
    password : {
        type : String,
        required : true,
    },

})

export const Order = mongoose.model("Order", orderSchema);