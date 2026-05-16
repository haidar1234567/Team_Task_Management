"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User_1.User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const user = await User_1.User.create({
            name,
            email,
            password,
            role: role || 'Member',
        });
        if (user) {
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: (0, jwt_1.generateToken)(user._id.toString()),
                },
            });
        }
        else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.registerUser = registerUser;
// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: (0, jwt_1.generateToken)(user._id.toString()),
                },
            });
        }
        else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.loginUser = loginUser;
// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user._id).select('-password');
        if (user) {
            res.json({
                success: true,
                message: 'User profile fetched',
                data: user,
            });
        }
        else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getUserProfile = getUserProfile;
