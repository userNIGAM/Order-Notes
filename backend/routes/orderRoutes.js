import express from "express"
import {getCustomerLedger} from "../controllers/orderController.js"
const router = express.Router()

router.get("/getCustomer", getCustomerLedger)

export default router