import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    method: {
      type: String,
      enum: ["cash", "card", "online"],
      default: "cash",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);