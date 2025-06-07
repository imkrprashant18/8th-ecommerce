import { ApiError } from "../utils/apiError.ts";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.ts";
import User from "../models/user.models.ts";
import type { Request, Response, NextFunction } from "express";
// Extend Express Request interface to include 'user'
declare global {
        namespace Express {
                interface Request {
                        user?: any;
                }
        }
}
const verifyAdminJWT = asyncHandler(async (req: Request, _: Response, next: NextFunction) => {
        try {
                const token =
                        req.cookies?.accessToken ||
                        req.header("Authorization")?.replace("Bearer ", "");

                if (!token) {
                        throw new ApiError(401, "Unauthorized request");
                }
                const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { id: string };
                const user = await User.findById(decodedToken.id).select(
                        "-password -refreshToken"
                );
                if (!user) {
                        throw new ApiError(401, "Invalid Access Token");
                }
                if (user.role !== "admin") {
                        throw new ApiError(403, "Access denied: Admins only");
                }
                req.user = user;
                next();
        } catch (error: any) {
                throw new ApiError(
                        401,
                        error?.message ||
                        "Invalid access token. Please try again with a valid token."
                );
        }
});




export {
        verifyAdminJWT
}
