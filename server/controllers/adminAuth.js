import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


import Admin from "../models/Admin.js"
import { createError } from "../error.js"

export const signup = async (req, res, next) => {
    try {

        const existingAdmin = await Admin.findOne({ username: req.body.username });
        if (existingAdmin) {
            // If username exists, return a 400 error
            return next(createError(400, "Username already exists"));
        }
        
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newAdmin = new Admin({ ...req.body, password: hash })

        await newAdmin.save()
        res.status(200).send("Admin has been created")
    } catch(err) {
        next(err)
    }

}

export const signin = async (req, res, next) => {
    try {
      const admin = await Admin.findOne({ username: req.body.username })
      if (!admin) return next(createError(404, "Admin not found!"))

      const isCorrect = await bcrypt.compare(req.body.password, admin.password)  
      if (!isCorrect) return next(createError(400, "Wrong username or password!"))

      const token = jwt.sign({id: admin._id}, process.env.ADMIN_JWT)
      const {password, ...others} = admin._doc

      res.cookie("access_token_admin", token, {
        httpOnly: true
      }).status(200)
        .json(others)
    
    } catch(err) {
        next(err)
    }

}

