const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { AppError } = require('../utils/appError');
const { Op } = require('sequelize');


const findByEmail = async (email) => {
    try {
        const user = await User.findOne({ where: { email: email } });
        return user;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}
const findById = async (id) => {
    try {
        const user = await User.findByPk(parseInt(id));
        return user;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}
const signUpUser = async (user) => {
    const { name, email, phone, password } = user;
    try {
        // Check if the user already exists
        const existingUser = await findByEmail(email);
        if (existingUser) {
            throw new AppError("User already exists please login", 409);
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: name,
            email: email,
            phone: phone,
            password: hashPassword
        });
        return user;
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);
        }
        throw error;
    }
}
const loginUser = async (email, password) => {
    try {
        const existingUser = await findByEmail(email);
        if (!existingUser) {
            throw new AppError("User Not found", 404);
        }
        const isPasswordMatched = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordMatched) {
            throw new AppError("User Not Authorized", 401);
        }
        const token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            process.env.SECRET_KEY,
            { expiresIn: '7d' }
        );
        return { existingUser, token };
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);
        }
        throw error;
    }
}
const fetchAllUsersExceptMe = async (userId, query) => {
    try {
        const whereClause = {
            id: { [Op.ne]: userId }, // always exclude current user
        };
        if (query) {
            whereClause[Op.or] = [
    { name: { [Op.like]: `%${query}%` } },
    { email: { [Op.like]: `%${query}%` } },
    { phone: { [Op.like]: `%${query}%` } }
  ];
        }
        const users = await User.findAll({
            where:whereClause,
            attributes: ['id', 'name'],
        });
        return users;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}
const fetchUsersNotInGroup = async (groupId) => {
    try {
        const users = await User.findAll({
            where: {
                id: { [Op.ne]: userId }
            },
            attributes: ['id', 'name'],
        });
        return users;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}
module.exports = {
    signUpUser, loginUser, findById, fetchAllUsersExceptMe
}