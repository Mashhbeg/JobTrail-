import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.mongo.repository.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export const JWT_SECRET = env.JWT_SECRET;

export const authService = {
  async register({ name, email, password }) {
    if (!name?.trim() || !email?.trim() || !password) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'Name, email, and password are required.'
      );
    }

    if (password.length < 8) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'Password must be at least 8 characters long.'
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new AppError(
        409,
        'EMAIL_EXISTS',
        'An account with this email already exists.'
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let user;

    try {
      user = await userRepository.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError(
          409,
          'EMAIL_EXISTS',
          'An account with this email already exists.'
        );
      }

      throw error;
    }

    const token = jwt.sign({}, JWT_SECRET, {
      subject: String(user.id),
      expiresIn: '1h',
    });

    return { user, token };
  },

  async login({ email, password }) {
    if (!email?.trim() || !password) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'Email and password are required.'
      );
    }

    const userWithHash = await userRepository.findByEmail(
      email.trim().toLowerCase()
    );

    if (!userWithHash) {
      throw new AppError(
        401,
        'UNAUTHORIZED',
        'Invalid email or password.'
      );
    }

    const isMatch = await bcrypt.compare(
      password,
      userWithHash.passwordHash
    );

    if (!isMatch) {
      throw new AppError(
        401,
        'UNAUTHORIZED',
        'Invalid email or password.'
      );
    }

    const token = jwt.sign({}, JWT_SECRET, {
      subject: String(userWithHash.id),
      expiresIn: '1h',
    });

    const { passwordHash, ...safeUser } = userWithHash;

    return { user: safeUser, token };
  },

  async getMe(id) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError(
        404,
        'USER_NOT_FOUND',
        'User account was not found.'
      );
    }

    return user;
  },
};

