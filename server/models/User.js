import mongoose from "mongoose";

const User = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
  },
  password: String,
});

User.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("Users", User);
