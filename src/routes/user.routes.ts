import { Router } from "express";
import { registerAdmin, loginAdmin, getCurrentAdmin, updateAdminProfile, uploadAdminAvatar, changeAdminPassword, logoutAdmin } from "../controllers/users.controllers.ts"
import { verifyAdminJWT } from "../middelware/auth.middelware.ts";
import { upload } from "../middelware/multer.middelware.ts";
const router = Router()


/**
 * @swagger
 * /users/register-admin:
 *   post:
 *     summary: Register a new admin user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *               - phone
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: User already exists
 */
router.route("/register-admin").post(registerAdmin)



/**
 * @swagger
 * /users/login-admin:
 *   post:
 *     summary: Login as an admin user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Admin logged In Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         phone:
 *                           type: string
 *                         role:
 *                           type: string
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Missing required fields (email/password)
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
router.route("/login-admin").post(loginAdmin)

/**
 * @swagger
 * /users/current-admin:
 *   get:
 *     summary: Get the current logged-in admin
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current Admin fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f5f1b2c001cfb77a2"
 *                     name:
 *                       type: string
 *                       example: "Admin Name"
 *                     email:
 *                       type: string
 *                       example: "admin@example.com"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *                 message:
 *                   type: string
 *                   example: Current Admin fetched successfully
 *       401:
 *         description: Unauthorized - token missing or invalid
 */
router.route("/current-admin").get(verifyAdminJWT, getCurrentAdmin)

/**
 * @swagger
 * /users/update-admin-profile:
 *   patch:
 *     summary: Update the admin's profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []  # or bearerAuth if you're using Authorization headers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *               - email
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               phone:
 *                 type: string
 *                 example: "9812345678"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: All fields are required
 *       401:
 *         description: Unauthorized access
 */
router.route("/update-admin-profile").patch(verifyAdminJWT, updateAdminProfile)
/**
 * @swagger
 * /users/upload-admin-avatar:
 *   post:
 *     summary: Upload or update admin's avatar image
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: Avatar image updated successfully
 *       400:
 *         description: Avatar file is missing or failed to upload
 *       401:
 *         description: Unauthorized access
 */
router.route("/upload-admin-avatar").post(verifyAdminJWT, upload.single("avatar"), uploadAdminAvatar)


/**
 * @swagger
 * /users/change-admin-password:
 *   patch:
 *     summary: Change Admin Password
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword456"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid old password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.route("/change-admin-password").patch(verifyAdminJWT, changeAdminPassword)
/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Admin Logout
 *     tags:
 *       - users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin logged out successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data: {}
 *               message: "Admin logged Out"
 */
router.route("/logout-admin").post(verifyAdminJWT, logoutAdmin)
export default router