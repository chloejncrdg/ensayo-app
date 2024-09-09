import jwt from 'jsonwebtoken'
import { createError } from './error.js'

export const verifyAdminToken = (req, res, next) => {
    const token = req.cookies.access_token_admin
    if (!token) return next(createError(401, "Admin not authenticated!"))

    jwt.verify(token, process.env.ADMIN_JWT, (err, admin) => {
        if(err) return next(createError(403, "Invalid token!"))
        req.admin = admin
        next()
    })    
}