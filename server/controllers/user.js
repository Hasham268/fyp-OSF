import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import UserModal from "../models/user.js";

const secret = 'test';

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

    const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "1h" } );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    
    console.log(error);
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No order with id: ${id}`);

  await UserModal.findByIdAndRemove(id);

  res.json({ message: "User deleted successfully." });
}

export const getUsers = async (req, res) => {
  try{
      const users = await UserModal.find();
      res.status(200).json(users);

  }catch(err){
      res.status(404).json({message: err.message})
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email} = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = { name, email, _id: id };

  await UserModal.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json(updatedPost);
}

export const getAllFeedbacks = async(req, res) => {
  const foundUser = await UserModal.find({name: req.params.username}).populate("feedbacks")
  res.json(foundUser)
}

