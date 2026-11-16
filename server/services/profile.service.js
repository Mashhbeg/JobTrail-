import { profileRepository } from '../repositories/profile.mongo.repository.js';
import { AppError } from '../utils/AppError.js';

const ALLOWED_FIELDS = [
  'name',
  'phone',
  'location',
  'headline',
  'bio',
  'skills',
  'education',
  'experience',
  'masterResume',
];

function calculateCompletion(profile) {
  const checks = [
    Boolean(profile.name),
    Boolean(profile.email),
    Boolean(profile.phone),
    Boolean(profile.location),
    Boolean(profile.headline),
    Boolean(profile.bio),
    profile.skills?.length > 0,
    profile.education?.length > 0,
    profile.experience?.length > 0,
    Boolean(profile.masterResume),
  ];

  const completed = checks.filter(Boolean).length;

  return Math.round((completed / checks.length) * 100);
}

export const profileService = {
  async getProfile(userId) {
    const profile = await profileRepository.findById(userId);

    if (!profile) {
      throw new AppError(
        404,
        'PROFILE_NOT_FOUND',
        'User profile was not found.'
      );
    }

    return profile;
  },

  async updateProfile(userId, changes) {
    const safeChanges = {};

    for (const field of ALLOWED_FIELDS) {
      if (changes[field] !== undefined) {
        safeChanges[field] = changes[field];
      }
    }

    if (safeChanges.name !== undefined) {
      if (
        typeof safeChanges.name !== 'string' ||
        safeChanges.name.trim().length < 2
      ) {
        throw new AppError(
          400,
          'VALIDATION_ERROR',
          'Name must contain at least 2 characters.'
        );
      }

      safeChanges.name = safeChanges.name.trim();
    }

    if (safeChanges.skills !== undefined) {
      if (
        !Array.isArray(safeChanges.skills) ||
        !safeChanges.skills.every(skill => typeof skill === 'string')
      ) {
        throw new AppError(
          400,
          'VALIDATION_ERROR',
          'Skills must be an array of strings.'
        );
      }

      safeChanges.skills = [
        ...new Set(
          safeChanges.skills
            .map(skill => skill.trim())
            .filter(Boolean)
        ),
      ];
    }

    const currentProfile = await profileRepository.findById(userId);

    if (!currentProfile) {
      throw new AppError(
        404,
        'PROFILE_NOT_FOUND',
        'User profile was not found.'
      );
    }

    const mergedProfile = {
      ...currentProfile,
      ...safeChanges,
    };

    safeChanges.profileCompletion =
      calculateCompletion(mergedProfile);

    const updatedProfile = await profileRepository.update(
      userId,
      safeChanges
    );

    return updatedProfile;
  },
};