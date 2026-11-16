import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../schemas/user.schema.js';

function toUserObject(user, includePasswordHash = false) {
  if (!user) return null;

  const data = user.toObject ? user.toObject() : user;

  const result = {
    id: String(data._id),
    name: data.name,
    email: data.email,
    masterResume: data.masterResume ?? '',
    createdAt: data.createdAt?.toISOString?.() ?? data.createdAt,
  };

  if (includePasswordHash) {
    result.passwordHash = data.passwordHash;
  }

  return result;
}

export const userRepository = {
  async findByEmail(email) {
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select('+passwordHash');

    return toUserObject(user, true);
  },

  async findById(id) {
    if (!mongoose.isValidObjectId(id)) return null;

    const user = await User.findById(id);

    return toUserObject(user);
  },

  async create({
    name,
    email,
    passwordHash,
    masterResume = '',
  }) {
    try {
      const user = await User.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
        masterResume,
      });

      return toUserObject(user);
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Email already exists');
      }

      throw error;
    }
  },

  async update(id, changes) {
    if (!mongoose.isValidObjectId(id)) return null;

    const update = {};

    if (changes.name !== undefined) {
      update.name = changes.name.trim();
    }

    if (changes.masterResume !== undefined) {
      update.masterResume = changes.masterResume;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: update },
      {
        new: true,
        runValidators: true,
      }
    );

    return toUserObject(user);
  },

  async seedDemoUser() {
    const email = 'jane@gmail.com';

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return toUserObject(existingUser);
    }

    const passwordHash = await bcrypt.hash(
      'Password@123',
      10
    );

    const user = await User.create({
      name: 'Jane Doe',
      email,
      passwordHash,
      masterResume: '',
    });

    return toUserObject(user);
  },
};

