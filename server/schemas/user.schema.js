import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    trim: true,
    maxlength: 150,
  },
  degree: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  fieldOfStudy: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  startDate: String,
  endDate: String,
  grade: String,
  description: {
    type: String,
    maxlength: 2000,
  },
}, { _id: true });

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    trim: true,
    maxlength: 150,
  },
  jobTitle: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  employmentType: String,
  location: String,
  startDate: String,
  endDate: String,
  currentlyWorking: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    maxlength: 3000,
  },
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  },

  passwordHash: {
    type: String,
    required: true,
    minlength: 20,
    select: false,
  },

  phone: {
    type: String,
    trim: true,
    maxlength: 20,
    default: '',
  },

  location: {
    type: String,
    trim: true,
    maxlength: 150,
    default: '',
  },

  headline: {
    type: String,
    trim: true,
    maxlength: 200,
    default: '',
  },

  bio: {
    type: String,
    trim: true,
    maxlength: 3000,
    default: '',
  },

  skills: {
    type: [String],
    default: [],
  },

  education: {
    type: [educationSchema],
    default: [],
  },

  experience: {
    type: [experienceSchema],
    default: [],
  },

  profileCompletion: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },

  masterResume: {
    type: String,
    default: '',
    maxlength: 50000,
  },

}, {
  timestamps: true,
  collection: 'users',
});

userSchema.index({ createdAt: 1 });

export const User = mongoose.model('User', userSchema);

export const APPLICATION_STATUSES = [
  'Wishlist',
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Accepted',
  'Rejected',
  'Withdrawn',
];