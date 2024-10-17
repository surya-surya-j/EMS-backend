import User from "./models/User.js";
import bcrypt from "bcrypt";
import connectToDB from "./db/db.js";

const userRegister = async (req, res) => {
  connectToDB();
  try {
    const hashPassword = await bcrypt.hash("admin", 10);
    const newUser = await new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashPassword,
      role: "admin",
    });
    await newUser.save();
  } catch (error) {
    console.log(error);
  }
};

userRegister();
