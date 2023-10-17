
/**
 * @swagger
 * /auth/reset-password-email/{email}:
 *   post:
 *     summary: Send a reset password email
 *     description: Send a reset password email to the provided email address.
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: email
 *         description: The email address to send the reset password email to.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Reset password email sent successfully.
 *       '400':
 *         description: Bad request.
 *       '404':
 *         description: User not found
 */

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Reset password with a token
 *     description: Reset the user's password using a valid reset token.
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         description: The reset password token.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: New password and reset token.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 5
 *     responses:
 *       '200':
 *         description: Password reset successful.
 *       '400':
 *         description: Bad request.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided data.
 *     tags: [Authentication]
 *     requestBody:
 *       description: User registration data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterSchema'
 *     responses:
 *       '200':
 *         description: User registered successfully.
 *       '400':
 *         description: Bad request.
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate and log in a user.
 *     tags: [Authentication]
 *     requestBody:
 *       description: User login data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginSchema'
 *     responses:
 *       '200':
 *         description: User logged in successfully.
 *       '400':
 *         description: Bad request.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterSchema:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *         last_name:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *         email:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *         role:
 *           type: string
 *           enum: ['user', 'admin']
 *         password:
 *           type: string
 *           minLength: 5
 *
 *     LoginSchema:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *         password:
 *           type: string
 *           minLength: 5
 */

/**
 * @swagger
 * definitions:
 *   ResetPasswordEmailParams:
 *     properties:
 *       email:
 *         type: string
 *         format: email
 *
 *   ResetPasswordTokenRequestBody:
 *     type: object
 *     properties:
 *       token:
 *         type: string
 *         minLength: 1
 *         maxLength: 255
 *       newPassword:
 *         type: string
 *         minLength: 5
 */
