import { createError } from "../error.js";
import User from "../models/User.js";
import { Module, Course } from '../models/Content.js';
import bcrypt from "bcryptjs";

import nodemailer from 'nodemailer';
import jwt from "jsonwebtoken";

import path from 'path';
import { fileURLToPath } from 'url';

export const updateUser = async (req, res, next) => {
    if(req.params.id === req.user.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, 
            {
                $set: req.body
            },
                { new: true }

        )
            res.status(200).json(updatedUser)
        } catch(err) {
            next(err)
        }

    } else {
        return next(createError(403, "You can update only your account!"))
    }

}

export const updateUsername = async (req, res, next) => {
    if (req.params.id !== req.user.id) {
      return next(createError(403, "You can update only your account!"));
    }
  
    try {
      const { username } = req.body;
  
      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username is already taken.' });
      }
  
      // Update username
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { username },
        { new: true }
      );
  
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
};

export const updatePassword = async (req, res, next) => {
    if (req.params.id !== req.user.id) {
        return next(createError(403, "You can update only your account!"));
    }
    
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return next(createError(404, "User not found"));
      }
  
      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is wrong' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
  
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
      next(err);
    }
};

export const updateEmail = async (req, res, next) => {
    if (req.params.id !== req.user.id) {
      return next(createError(403, "You can update only your account!"));
    }
  
    try {
      const { email } = req.body;
  
      // Check if the username already exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: 'User with this email already exists.' });
      }
  
      // Update username
      const updatedEmail = await User.findByIdAndUpdate(
        req.params.id,
        { email },
        { new: true }
      );
  
      res.status(200).json(updatedEmail);
    } catch (err) {
      next(err);
    }
};



export const deleteUser = async (req, res, next) => {
    if(req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id,
        )
            res.status(200).json("User has been deleted")
        } catch(err) {
            next(err)
        }

    } else {
        return next(createError(403, "You can update only your account!"))
    }

}


export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return next(createError(404, "User not found!"))
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};


export const getUserEnrolledModules = async (req, res, next) => {
  if (req.params.id !== req.user.id) {
    return next(createError(403, "You can update only your account!"));
  }
  try {
    const userId = req.params.id; // User ID from request parameters

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    // Get the enrolledCourses array from the user
    const enrolledModulesIds = user.enrolledCourses;

    // Query the Module collection to fetch details of enrolled modules and populate course details
    const enrolledModules = await Module.find({ _id: { $in: enrolledModulesIds } }).populate('courseId', 'title');

    res.status(200).json(enrolledModules);
  } catch (err) {
    next(err);
  }
};

// update "enrolledCourses" of the current user
export const updateUserCourses = async (req, res, next) => {
    try {
      // Check if the user ID in the request params matches the ID of the logged-in user
      if (req.params.id !== req.user.id) {
        return next(createError(403, "You can update only your account!"));
      }
  
      // Find the user by ID and update the enrolledCourses array
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { enrolledCourses: req.body.moduleId }, // Add the moduleId to enrolledCourses array if it doesn't already exist
        },
        { new: true }
      );
  
      // Send the updated user object as a response
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  };


// For 'Forgot password' functionality

export const sendPasswordResetLink = async (req, res, next) => {
  try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return next(createError(404, "User not found"));

      // Create a token for password reset and set it to expire in 10 minutes
      const secret = process.env.RESET_TOKEN_JWT + user.password;
      const token = jwt.sign({ id: user._id }, secret, { expiresIn: '10m' });

      const resetLink = `${process.env.CLIENT_URL}/reset-password?id=${user._id}&token=${token}`;

      // Create a transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: process.env.EMAIL_USER, // Sender email
              pass: process.env.EMAIL_PASS, // Sender email password
          },
      });

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Link',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <div style="text-align: center;">
                    <img src="cid:logo@yourapp" alt="App Logo" style="max-width: 150px; margin-bottom: 20px;" />
                </div>
                <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
                <p style="font-size: 16px; color: #555;">Hello,</p>
                <p style="font-size: 16px; color: #555;">
                    You requested a password reset for your eNSAYO account. Please click the button below to reset your password:
                </p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${resetLink}" style="background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p style="font-size: 14px; color: #555;">
                    This link will expire in 10 minutes. If you did not request this, please ignore this email or contact support if you have any questions.
                </p>
                <p style="font-size: 14px; color: #555;">
                    Thank you,
                    <br>
                    eNSAYO Team
                </p>
            </div>
        `,
        attachments: [{
            filename: 'logo_ensayo.png',
            path: path.join(__dirname, 'images', 'logo_ensayo.png'), // Path to your image
            cid: 'logo@yourapp' // Same cid value as in the html img src
        }]
      };

      // Send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error('Error sending email:', error); // Improved error logging
              return next(createError(500, "Failed to send email"));
          } else {
              // console.log('Email sent: ' + info.response);
              res.status(200).json({ message: 'Password reset link sent successfully' });
          }
      });

  } catch (err) {
      next(err);
  }
};

export const verifyResetPasswordToken = async (req, res, next) => {
  try {
      const { id, token } = req.body;
      const user = await User.findById(id);

      if (!user) return next(createError(404, "User not found"));

      const secret = process.env.RESET_TOKEN_JWT + user.password;

      try {
          jwt.verify(token, secret);
          res.status(200).json({ message: "Token is valid" });
      } catch (error) {
          return res.status(400).json({ message: "Invalid or expired token" });
      }
  } catch (err) {
      next(err);
  }
};


export const verifyTokenAndResetPassword = async (req, res, next) => {
  try {
      const { id, token, newPassword } = req.body; // Changed from req.params to req.query
      const user = await User.findById(id);

      if (!user) return next(createError(404, "User not found"));
      
      // Verify the token
      const secret = process.env.RESET_TOKEN_JWT + user.password;

      try {
        jwt.verify(token, secret)
      } catch (error) {
        return res.status(400).json({ message: "Invalid or expired token" })
      }

      // Reset password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();


      res.status(200).json({ message: "Password reset successfully" });

  } catch (err) {
      next(err);
  }
};

