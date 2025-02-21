const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
