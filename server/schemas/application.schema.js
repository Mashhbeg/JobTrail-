import mongoose from 'mongoose';

import { APPLICATION_STATUSES } from './user.schema.js';

// Interview schema
const interviewSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'Phone Screen',
        'Technical Round',
        'Technical Interview',
        'HR Round',
        'Final Round',
        'Other',
      ],
      required: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    feedback: {
      type: String,
      default: '',
      maxlength: 5000,
    },

    interviewer: {
      type: String,
      default: '',
      maxlength: 200,
    },

    notes: {
      type: String,
      default: '',
      maxlength: 5000,
    },
  },
  { timestamps: false }
);

// Notes schema
const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
  },
  { timestamps: true }
);

// Application status history schema
const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      required: true,
    },

    at: {
      type: Date,
      required: true,
      default: Date.now,
    },

    notes: {
      type: String,
      default: '',
      maxlength: 1000,
    },
  },
  { timestamps: false }
);

// Main application schema
const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    role: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    location: {
      type: String,
      default: '',
      trim: true,
      maxlength: 200,
    },

    status: {
      type: String,
      enum: {
        values: APPLICATION_STATUSES,
        message: '{VALUE} is not a valid status',
      },
      default: 'Wishlist',
      required: true,
      index: true,
    },

    jobUrl: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2048,
    },

    source: {
      type: String,
      default: 'Other',
      trim: true,
    },

    appliedDate: {
      type: Date,
      default: null,
    },

    jobDescription: {
      type: String,
      default: '',
      maxlength: 10000,
    },

    interviews: {
      type: [interviewSchema],
      default: [],
    },

    notes: {
      type: [noteSchema],
      default: [],
    },

    history: {
      type: [statusHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'applications',
  }
);

// Database indexes
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ userId: 1, appliedDate: -1 });
applicationSchema.index({ createdAt: 1 });

// Export Application model
export const Application = mongoose.model(
  'Application',
  applicationSchema
);
