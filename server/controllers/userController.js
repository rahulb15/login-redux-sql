const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

class UserController {
    static async register(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { firstName, lastName, username, password } = req.body;
        console.log(req.body);
        if (await db.User.findOne({ where: { username } })) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.User.create({
            firstName,
            lastName,
            username,
            password: hashedPassword
        });
        res.json(user);
    }

    

    static async login(req, res) {
        const { username, password } = req.body;
        const user = await db.User.findOne({
            where: {
                username
            }
        });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET);
        res.json({
            accessToken,
            user
        });
    }

    static async getUser(req, res) {
        const user = await db.User.findOne({
            where: {
                id: req.user.id
            }
        });
        res.json(user);
    }


    static async getAllUsers(req, res) {
        const users = await db.User.findAll(
            {
                attributes: ['id', 'username', 'firstName', 'lastName']
            }
        );
        res.json(users);
    }

    static async deleteUser(req, res) {
        const user = await db.User.findOne({
            where: {
                id: req.params.id
            }
        });
        if (user) {
            await user.destroy();
            res.json({ message: 'User deleted' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }

    //get user by id
    static async getUserById(req, res) {
        const user = await db.User.findOne({
            where: {
                id: req.params.id
            }
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }

    //update user
    static async updateUser(req, res) {
        const user = await db.User.findOne({
            where: {
                id: req.params.id
            }
        });
        if (user) {
            await user.update(req.body);
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    

        
}

module.exports = UserController;