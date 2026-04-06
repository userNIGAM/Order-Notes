// import mongoose from "mongoose";

// const orderItemSchema = new mongoose.Schema(
//   {
//     itemId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Item",
//       required: true,
//     },

//     name: {
//       type: String,
//       required: true, // snapshot of item name
//     },

//     quantity: {
//       type: Number,
//       required: true,
//       min: 1,
//     },

//     priceAtThatTime: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     total: {
//       type: Number,
//       required: true,
//     },
//   },
//   { _id: false }
// );

// const orderSchema = new mongoose.Schema(
//   {
//     customerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Customer",
//       required: true,
//       index: true,
//     },

//     items: [orderItemSchema],

//     totalAmount: {
//       type: Number,
//       required: true,
//     },

//     date: {
//       type: Date,
//       required: true, // manual date entry (important)
//       index: true,
//     },

//     notes: {
//       type: String,
//       trim: true,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Order", orderSchema);

import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  name: String,
  quantity: Number,
  price: Number,
});

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);