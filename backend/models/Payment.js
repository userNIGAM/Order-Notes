import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    amountPaid: {
      type: Number,
      required: true,
      min: 1,
    },

    paymentDate: {
      type: Date,
      default: Date.now, // you can override from frontend if needed
    },

    method: {
      type: String,
      enum: ["cash", "fonepay", "esewa", "bank", "other"],
      default: "cash",
    },

    note: {
      type: String,
      trim: true,
    },

    // Snapshot of balance at the time (VERY USEFUL)
    balanceBefore: {
      type: Number,
      required: true,
    },

    balanceAfter: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);