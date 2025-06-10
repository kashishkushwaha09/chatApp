const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { AppError } = require('../utils/appError');


const findByEmail = async (email) => {
    try {
        const user = await User.findOne({ where: { email: email } });
        return user;
    } catch (error) {
      throw new AppError(error.message, 500);
    }
}
const signUpUser = async (user) => {
const {name, email, phone, password}=user;
    try {
        // Check if the user already exists
        const existingUser = await findByEmail(email);
        if (existingUser) {
            throw new AppError("User already exists", 409);
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: name,
            email: email,
            phone:phone,
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
module.exports={
    signUpUser
}