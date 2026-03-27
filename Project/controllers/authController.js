const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Register
exports.register = async (req, res, next) => {
    try {
        const user = await User.create(req.body);

        res.status(201).json({
            _id: user._id,
            token: generateToken(user._id)
        });
    } catch (err) {
        next(err);
    }
};

// Login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({
            _id: user._id,
            token: generateToken(user._id)
        });
    } catch (err) {
        next(err);
    }
};