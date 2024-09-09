import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


import User from "../models/User.js"
import { createError } from "../error.js"

export const signup = async (req, res, next) => {
    try {

        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            // If username exists, return a 400 error
            return next(createError(400, "Username already exists"));
        }

        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
            return next(createError(400, "User with this email already exists"));
        }
        
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash })

        await newUser.save()
        res.status(200).send("User has been created")
    } catch(err) {
        next(err)
    }

}

export const signin = async (req, res, next) => {
    try {
      const user = await User.findOne({ username: req.body.username })
      if (!user) return next(createError(404, "User not found!"))

      const isCorrect = await bcrypt.compare(req.body.password, user.password)  
      if (!isCorrect) return next(createError(400, "Wrong username or password!"))

      const token = jwt.sign({id: user._id}, process.env.JWT)
      const {password, ...others} = user._doc

      res.cookie("access_token_client", token, {
        httpOnly: true
      }).status(200)
        .json(others)
    
    } catch(err) {
        next(err)
    }

}