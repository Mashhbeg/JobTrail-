import mongoose from 'mongoose';
import { Application } from '../schemas/application.schema.js';

function toApplicationObject(record) {
  if (!record) return null;

  const data = record.toObject
    ? record.toObject()
    : record;

  return {
    ...data,
    id: String(data._id),
    userId: String(data.userId),

    appliedDate: data.appliedDate
      ? new Date(data.appliedDate).toISOString().slice(0, 10)
      : '',

    createdAt:
      data.createdAt?.toISOString?.() ?? data.createdAt,

    updatedAt:
      data.updatedAt?.toISOString?.() ?? data.updatedAt,

    notes: (data.notes || []).map((note) => ({
      id: String(note._id ?? note.id ?? ''),
      text: note.content ?? note.text ?? '',
      createdAt:
        note.createdAt?.toISOString?.() ??
        note.createdAt ??
        '',
    })),

    interviews: (data.interviews || []).map((interview) => ({
      id: String(interview._id ?? interview.id ?? ''),
      type: interview.type,
      scheduledAt:
        interview.scheduledAt?.toISOString?.() ??
        interview.scheduledAt,
      completedAt:
        interview.completedAt?.toISOString?.() ??
        interview.completedAt ??
        null,
      feedback: interview.feedback ?? '',
      interviewer: interview.interviewer ?? '',
      notes: interview.notes ?? '',
    })),

    history: (data.history || []).map((item) => ({
      id: String(item._id ?? item.id ?? ''),
      status: item.status,
      at: item.at?.toISOString?.() ?? item.at,
      notes: item.notes ?? '',
    })),
  };
}

function validObjectId(id) {
  return mongoose.isValidObjectId(id);
}

function normalizeNotes(notes = []) {
  return notes.map((note) => ({
    ...(note.id && validObjectId(note.id)
      ? { _id: note.id }
      : {}),
    content: note.content ?? note.text ?? '',
    ...(note.createdAt
      ? { createdAt: new Date(note.createdAt) }
      : {}),
  }));
}

function normalizeInterviews(interviews = []) {
  return interviews.map((interview) => ({
    ...(interview.id && validObjectId(interview.id)
      ? { _id: interview.id }
      : {}),
    type: interview.type || 'Other',
    scheduledAt: interview.scheduledAt
      ? new Date(interview.scheduledAt)
      : new Date(),
    completedAt: interview.completedAt
      ? new Date(interview.completedAt)
      : null,
    feedback: interview.feedback || '',
    interviewer: interview.interviewer || '',
    notes: interview.notes || '',
  }));
}

function normalizeHistory(history = []) {
  return history.map((item) => ({
    ...(item.id && validObjectId(item.id)
      ? { _id: item.id }
      : {}),
    status: item.status,
    at: item.at ? new Date(item.at) : new Date(),
    notes: item.notes || '',
  }));
}

export const applicationRepository = {
  async create(userId, data) {
    if (!validObjectId(userId)) {
      throw new Error('Invalid MongoDB user ID');
    }

    const record = await Application.create({
      userId,
      company: data.company,
      role: data.role,
      location: data.location || '',
      status: data.status || 'Wishlist',
      jobUrl: data.jobUrl || '',
      source: data.source || 'Other',

      // Preserve an empty applied date for Wishlist applications.
      appliedDate: data.appliedDate || null,

      jobDescription: data.jobDescription || '',
      notes: normalizeNotes(data.notes),
      interviews: normalizeInterviews(data.interviews),
      history: normalizeHistory(data.history),
    });

    return toApplicationObject(record);
  },

  async findById(userId, id) {
    if (!validObjectId(userId) || !validObjectId(id)) {
      return null;
    }

    const record = await Application.findOne({
      _id: id,
      userId,
    });

    return toApplicationObject(record);
  },

  async findMany(userId) {
    if (!validObjectId(userId)) {
      return [];
    }

    const records = await Application.find({ userId })
      .sort({ appliedDate: -1, createdAt: -1 });

    return records.map(toApplicationObject);
  },

  async update(userId, id, changes) {
    if (!validObjectId(userId) || !validObjectId(id)) {
      return null;
    }

    const update = { ...changes };

    if (Array.isArray(update.notes)) {
      update.notes = normalizeNotes(update.notes);
    }

    if (Array.isArray(update.interviews)) {
      update.interviews = normalizeInterviews(
        update.interviews
      );
    }

    if (Array.isArray(update.history)) {
      update.history = normalizeHistory(update.history);
    }

    if (update.appliedDate === '') {
      update.appliedDate = null;
    }

    delete update.id;
    delete update.userId;
    delete update._id;

    const record = await Application.findOneAndUpdate(
      { _id: id, userId },
      { $set: update },
      {
        new: true,
        runValidators: true,
      }
    );

    return toApplicationObject(record);
  },

  async remove(userId, id) {
    if (!validObjectId(userId) || !validObjectId(id)) {
      return false;
    }

    const result = await Application.deleteOne({
      _id: id,
      userId,
    });

    return result.deletedCount > 0;
  },

  async seedDemoApplication(userId) {
    if (!validObjectId(userId)) {
      throw new Error(
        'Invalid MongoDB user ID for demo applications'
      );
    }

    const exists = await Application.exists({ userId });

    if (exists) return;

    const now = Date.now();

    await this.create(userId, {
      company: 'Tech Corp',
      role: 'Senior Developer',
      location: 'Remote',
      status: 'Interview',
      jobUrl: 'https://example.com/job/1',
      source: 'LinkedIn',
      appliedDate: new Date(
        now - 2 * 86400000
      ).toISOString().slice(0, 10),

      jobDescription:
        'Leading frontend architecture with React and TypeScript.',

      notes: [
        {
          text: 'HR screen went great!',
          createdAt: new Date().toISOString(),
        },
      ],

      interviews: [
        {
          type: 'Technical Round',
          scheduledAt: new Date(
            now + 3 * 86400000
          ).toISOString(),
        },
      ],

      history: [
        {
          status: 'Applied',
          at: new Date(
            now - 5 * 86400000
          ).toISOString(),
        },
        {
          status: 'Interview',
          at: new Date(
            now - 2 * 86400000
          ).toISOString(),
        },
      ],
    });
  },
};

