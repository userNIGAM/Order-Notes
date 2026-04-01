import { Order } from "../models/Order.js";

export const register = async(req, res)=>{
    const {name, email, password} = req.body;
    try {
        const payload = {name, email, password};
        if(
            !name ||
            !email ||
            !password
        ){
            return res.status(400).json({msg : "All field are required"})
        }

        const existingUser = await Order.findOne({email})

        if(!existingUser){
            console.log("Email is required")
            return res.status(404).json({msg : "Invalid Credentials!"})
        }

        
        
    } catch (error) {
        
    }
}