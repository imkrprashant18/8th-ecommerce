import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import User from "../models/user.models.ts"
import type { Request, Response } from "express";
import { UploadOnCloudinary } from "../utils/cloudinary.ts";
// generate the token
const generateAccessandRefereshToken = async (userId: string) => {
        try {
                const user = await User.findById(userId);
                if (!user) {
                        throw new ApiError(404, "User not found");
                }
                const accessToken = user.generateAccessToken();
                const refreshToken = user.generateRefreshToken();
                user.refreshToken = refreshToken;
                await user.save({ validateBeforeSave: false });
                return { accessToken, refreshToken };
        } catch (error) {
                throw new ApiError(
                        500,
                        "Something went wrong while generating referesh and access token"
                );
        }
};
// register user
const registerAdmin = asyncHandler(async (req: Request, res: Response) => {
        const { name, username, phone, email, password } = req.body;
        // Validate required fields
        if ([name, username, phone, email, password].some((field) => !field || field.trim() === "")) {
                throw new ApiError(400, "All fields are required");
        }
        // Check for existing user
        const existingUser = await User.findOne({
                $or: [{ email }, { phone }, { username }],
        });
        if (existingUser) {
                throw new ApiError(409, "User with this email, phone, or username already exists");
        }
        // Create new admin user
        const user = await User.create({
                name,
                username,
                phone,
                email,
                password,
                role: "admin",
        })
        const createdUser = await User.findById(String(user._id)).select(
                "-password"
        );
        if (!createdUser) {
                throw new ApiError(500, "Something went wrong while registering the admin");
        }

        // Remove sensitive info before sending response
        const userObj = createdUser.toObject();
        return res
                .status(201)
                .json(new ApiResponse(201, userObj, "Admin registered successfully"));
});
// login user
const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
        const { email, username, password } = req.body;

        if (!email && !username) {
                throw new ApiError(400, "Username and email are required");
        }

        const user = await User.findOne({
                $or: [{ username }, { email }],
        });

        if (!user) {
                throw new ApiError(404, "User does not exist");
        }
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
                throw new ApiError(401, "Invalid user credentials");
        }
        const { refreshToken, accessToken } = await generateAccessandRefereshToken(
                String(user._id)
        );
        const loggedInUser = await User.findById(String(user._id)).select(
                "-password -refreshToken "
        );
        const options = {
                httpOnly: true,
                secure: true,
        };
        return res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json(
                        new ApiResponse(
                                200,
                                {
                                        user: loggedInUser,
                                        accessToken,
                                        refreshToken,
                                },
                                "Admin logged In Successfully"
                        )
                );
});
// get current user
const getCurrentAdmin = asyncHandler(async (req: Request, res: Response) => {
        return res
                .status(200)
                .json(new ApiResponse(200, req.user, "Current Admin fetched successfully"));
});
// complet profile
const updateAdminProfile = asyncHandler(async (req: Request, res: Response) => {
        const { name, username, email, phone } = req.body
        if ([name, username, email, phone].some((field) => !field || field.trim() === "")) {
                throw new ApiError(400, "All filed is required")
        }
        const user = await User.findByIdAndUpdate(
                req.user?._id,
                {
                        $set: {
                                name,
                                username,
                                email,
                                phone
                        }
                },
                { new: true }
        ).select("-password")
        return res
                .status(200)
                .json(new ApiResponse(200, user, "Profile updated successfully"))
})
// upload avatar
const uploadAdminAvatar = asyncHandler(async (req: Request, res: Response) => {
        const avatarLocalPath = req.file?.path;
        if (!avatarLocalPath) {
                throw new ApiError(400, "Avatar file is missing");
        }
        const avatar = await UploadOnCloudinary(avatarLocalPath);
        if (!avatar || !avatar.url) {
                throw new ApiError(400, "Error while uploading avatar to Cloudinary");
        }

        const admin = await User.findByIdAndUpdate(
                req.user?._id,
                { $set: { avatar: avatar.url } },
                { new: true }
        ).select("-password");

        if (!admin) {
                throw new ApiError(404, "Admin not found");
        }

        return res
                .status(200)
                .json(new ApiResponse(200, admin, "Admin avatar updated successfully"));
});
// change admin password
const changeAdminPassword = asyncHandler(async (req: Request, res: Response) => {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user?._id);
        if (!user) {
                throw new ApiError(404, "User not found");
        }
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
        if (!isPasswordCorrect) {
                throw new ApiError(400, "Invalid old password");
        }
        user.password = newPassword;
        await user.save({ validateBeforeSave: false });
        return res
                .status(200)
                .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// admin logout
const logoutAdmin = asyncHandler(async (req: Request, res: Response) => {
        await User.findByIdAndUpdate(
                req.user?._id,
                {
                        $unset: {
                                refreshToken: 1,
                        },
                },
                {
                        new: true,
                }
        );
        const options = {
                httpOnly: true,
                secure: true,
        };
        return res
                .status(200)
                .clearCookie("accessToken", options)
                .clearCookie("refreshToken", options)
                .json(new ApiResponse(200, {}, "Admin logged Out"));
});

export { registerAdmin, loginAdmin, getCurrentAdmin, updateAdminProfile, uploadAdminAvatar, changeAdminPassword, logoutAdmin }