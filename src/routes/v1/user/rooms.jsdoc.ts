/**
 * @swagger
 * /rooms/search:
 *   get:
 *     summary: Search for rooms
 *     description: Search for rooms based on query parameters
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: query
 *         name: query
 *         description: The query parameters for room search
 *         schema:
 *           $ref: '#/components/schemas/RoomQuery'
 *     responses:
 *       '200':
 *         description: Successfully retrieved rooms
 *       '400':
 *         description: Bad request
 */

/**
 * @swagger
 * /rooms/count:
 *   get:
 *     summary: Get the count of rooms
 *     description: Get the total count of rooms based on query parameters
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: query
 *         name: query
 *         description: The query parameters for room count
 *         schema:
 *           $ref: '#/components/schemas/RoomQuery'
 *     responses:
 *       '200':
 *         description: Successfully retrieved the room count
 *       '400':
 *         description: Bad request
 */

/**
 * @swagger
 * /rooms/exists:
 *   get:
 *     summary: Check if rooms exist
 *     description: Check if rooms exist based on query parameters
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: query
 *         name: query
 *         description: The query parameters for checking room existence
 *         schema:
 *           $ref: '#/components/schemas/RoomQuery'
 *     responses:
 *       '200':
 *         description: Successfully checked room existence
 *       '400':
 *         description: Bad request
 */

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all rooms
 *     description: Get a list of all rooms
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Rooms
 *     responses:
 *       '200':
 *         description: Successfully retrieved all rooms
 *   post:
 *     summary: Create a new room
 *     description: Create a new room with the provided data
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Rooms
 *     requestBody:
 *       description: Room object to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomCreate'
 *     responses:
 *       '200':
 *         description: Successfully created a new room
 *       '400':
 *         description: Bad request
 */

/**
 * @swagger
 * /rooms/{pagination}:
 *   get:
 *     summary: Get rooms with pagination
 *     description: Get a list of rooms with pagination
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: pagination
 *         description: The pagination parameters (e.g., page number)
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved rooms with pagination
 */

/**
 * @swagger
 * /rooms/{id}:
 *   patch:
 *     summary: Update a room
 *     description: Update an existing room with the provided data
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the room to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Room object to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomUpdate'
 *     responses:
 *       '200':
 *         description: Successfully updated the room
 *       '400':
 *         description: Bad request
 */

/**
 * @swagger
 * /rooms/{id}:
 *   delete:
 *     summary: Delete a room
 *     description: Delete a room based on the provided ID
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the room to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully deleted the room
 *       '400':
 *         description: Bad request
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RoomCreate:
 *       type: object
 *       properties:
 *         room_number:
 *           type: string
 *         room_type:
 *           type: string
 *         capacity:
 *           type: number
 *         price_per_night:
 *           type: number
 *         description:
 *           type: string
 *         is_booked:
 *           type: boolean
 *       required:
 *         - room_number
 *         - room_type
 *         - capacity
 *         - price_per_night
 *         - description
 *         - is_booked
 *     RoomUpdate:
 *       type: object
 *       properties:
 *         room_number:
 *           type: string
 *         room_type:
 *           type: string
 *         capacity:
 *           type: number
 *         price_per_night:
 *           type: number
 *         description:
 *           type: string
 *         is_booked:
 *           type: boolean
 *     RoomQuery:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         room_number:
 *           type: string
 *         room_type:
 *           type: string
 *         capacity:
 *           type: string
 *         price_per_night:
 *           type: string
 *         description:
 *           type: string
 *         is_booked:
 *           type: string
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
