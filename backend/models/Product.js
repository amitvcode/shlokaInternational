import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    srNo: { type: Number, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    images: {
      type: [String],
      validate: {
        validator: function (val) {
          return val.length <= 6;
        },
        message: "A maximum of 6 images are allowed.",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);