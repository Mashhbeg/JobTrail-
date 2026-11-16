import mongoose from 'mongoose';
import { User } from '../schemas/user.schema.js';

function toProfileObject(user) {
  if (!user) return null;

  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    location: user.location || '',
    headline: user.headline || '',
    bio: user.bio || '',
    skills: user.skills || [],
    education: user.education || [],
    experience: user.experience || [],
    profileCompletion: user.profileCompletion || 0,
    masterResume: user.masterResume || '',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const profileRepository = {
  async findById(id) {
    if (!mongoose.isValidObjectId(id)) return null;

    const user = await User.findById(id);

    return toProfileObject(user);
  },

  async update(id, changes) {
    if (!mongoose.isValidObjectId(id)) return null;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: changes },
      {
        new: true,
        runValidators: true,
      }
    );

    return toProfileObject(user);
  },
};