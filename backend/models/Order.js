import mongoose from "mongoose";
import bcrypt from "bcrypt"

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

orderSchema.pre("save", async function(next){
    //only hash the password if it is modified
    // 'this' refers to the document being saved on controller
    if(!this.isModified("password")){
        return next()
    }
    try{
        // Generate salt 
        const salt = await bcrypt.genSalt(10)

        // Hash Password
        this.password = await bcrypt.hash(this.password, salt);

        next();
    }catch(error){
        next(error)
    }
})

orderSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

export const Order = mongoose.model("Order", orderSchema);