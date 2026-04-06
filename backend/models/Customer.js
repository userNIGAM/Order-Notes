import mongoose from "mongoose"

const customerSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        trim : true,
    },
    address : {
        type : String,
        required : true,
        trim : true,
    },
    
})

export const Customer = mongoose.model("Customer", customerSchema);