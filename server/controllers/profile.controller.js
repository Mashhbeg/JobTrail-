import { profileService } from '../services/profile.service.js';

export const profileController = {
  async getProfile(req, res) {
    const profile = await profileService.getProfile(
      req.user.id
    );

    res.status(200).json({
      data: profile,
    });
  },

  async updateProfile(req, res) {
    const profile = await profileService.updateProfile(
      req.user.id,
      req.body || {}
    );

    res.status(200).json({
      message: 'Profile updated successfully.',
      data: profile,
    });
  },
};