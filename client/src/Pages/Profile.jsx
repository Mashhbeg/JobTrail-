import { useEffect, useState } from 'react';
import {
  fetchProfile,
  updateProfile,
} from '../api/profile.js';

const emptyProfile = {
  name: '',
  email: '',
  phone: '',
  location: '',
  headline: '',
  bio: '',
  skills: [],
  education: [],
  experience: [],
  masterResume: '',
  profileCompletion: 0,
};

function Profile() {
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newSkill, setNewSkill] = useState('');

  // Load profile
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await fetchProfile();

      setProfile({
        ...emptyProfile,
        ...data,
      });
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
        'Unable to load your profile.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle personal information
  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save profile
  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const updatedProfile = await updateProfile({
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        headline: profile.headline,
        bio: profile.bio,
        skills: profile.skills,
        education: profile.education,
        experience: profile.experience,
        masterResume: profile.masterResume,
      });

      setProfile({
        ...emptyProfile,
        ...updatedProfile,
      });

      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
        'Unable to update your profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  // Add skill
  const addSkill = () => {
    const skill = newSkill.trim();

    if (!skill) return;

    const alreadyExists = profile.skills.some(
      (item) => item.toLowerCase() === skill.toLowerCase()
    );

    if (alreadyExists) {
      setNewSkill('');
      return;
    }

    setProfile((previous) => ({
      ...previous,
      skills: [...previous.skills, skill],
    }));

    setNewSkill('');
  };

  // Remove skill
  const removeSkill = (skillToRemove) => {
    setProfile((previous) => ({
      ...previous,
      skills: previous.skills.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  // Add education
  const addEducation = () => {
    setProfile((previous) => ({
      ...previous,
      education: [
        ...previous.education,
        {
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          grade: '',
          description: '',
        },
      ],
    }));
  };

  // Update education
  const updateEducation = (index, field, value) => {
    setProfile((previous) => ({
      ...previous,
      education: previous.education.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Remove education
  const removeEducation = (index) => {
    setProfile((previous) => ({
      ...previous,
      education: previous.education.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // Add experience
  const addExperience = () => {
    setProfile((previous) => ({
      ...previous,
      experience: [
        ...previous.experience,
        {
          company: '',
          jobTitle: '',
          employmentType: '',
          location: '',
          startDate: '',
          endDate: '',
          currentlyWorking: false,
          description: '',
        },
      ],
    }));
  };

  // Update experience
  const updateExperience = (index, field, value) => {
    setProfile((previous) => ({
      ...previous,
      experience: previous.experience.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Remove experience
  const removeExperience = (index) => {
    setProfile((previous) => ({
      ...previous,
      experience: previous.experience.filter(
        (_, i) => i !== index
      ),
    }));
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your professional information and master resume.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Profile Completion */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">
              Profile Completion
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Complete your profile to improve your professional presence.
            </p>
          </div>

          <span className="text-2xl font-bold text-indigo-600">
            {profile.profileCompletion}%
          </span>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{
              width: `${profile.profileCompletion}%`,
            }}
          />
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Personal Information */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <Input
              label="Full Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email Address"
              name="email"
              value={profile.email}
              disabled
            />

            <Input
              label="Phone Number"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
            />

            <Input
              label="Location"
              name="location"
              value={profile.location}
              onChange={handleChange}
              placeholder="City, State, Country"
            />

          </div>
        </section>

        {/* Professional Information */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            Professional Information
          </h2>

          <div className="space-y-5">

            <Input
              label="Professional Headline"
              name="headline"
              value={profile.headline}
              onChange={handleChange}
              placeholder="e.g. Full Stack Developer"
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Professional Summary
              </label>

              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={5}
                maxLength={3000}
                placeholder="Write a short professional summary..."
                className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

          </div>
        </section>

        {/* Skills */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            Skills
          </h2>

          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 text-sm text-indigo-700"
              >
                {skill}

                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="font-bold hover:text-red-600"
                  aria-label={`Remove ${skill}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(event) => setNewSkill(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Add a skill..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />

            <button
              type="button"
              onClick={addSkill}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </section>

        {/* Education */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Education
            </h2>

            <button
              type="button"
              onClick={addEducation}
              className="rounded-lg border border-indigo-600 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              + Add Education
            </button>
          </div>

          {profile.education.length === 0 && (
            <EmptyMessage text="No education details added yet." />
          )}

          <div className="space-y-5">
            {profile.education.map((item, index) => (
              <div
                key={item._id || index}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium text-gray-800">
                    Education #{index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <RepeatInput
                    label="Institution"
                    value={item.institution}
                    onChange={(value) =>
                      updateEducation(index, 'institution', value)
                    }
                  />

                  <RepeatInput
                    label="Degree"
                    value={item.degree}
                    onChange={(value) =>
                      updateEducation(index, 'degree', value)
                    }
                  />

                  <RepeatInput
                    label="Field of Study"
                    value={item.fieldOfStudy}
                    onChange={(value) =>
                      updateEducation(index, 'fieldOfStudy', value)
                    }
                  />

                  <RepeatInput
                    label="Grade / CGPA"
                    value={item.grade}
                    onChange={(value) =>
                      updateEducation(index, 'grade', value)
                    }
                  />

                  <RepeatInput
                    label="Start Date"
                    value={item.startDate}
                    onChange={(value) =>
                      updateEducation(index, 'startDate', value)
                    }
                    placeholder="2022"
                  />

                  <RepeatInput
                    label="End Date"
                    value={item.endDate}
                    onChange={(value) =>
                      updateEducation(index, 'endDate', value)
                    }
                    placeholder="2026"
                  />
                </div>

                <div className="mt-4">
                  <RepeatTextarea
                    label="Description"
                    value={item.description}
                    onChange={(value) =>
                      updateEducation(index, 'description', value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Work Experience
            </h2>

            <button
              type="button"
              onClick={addExperience}
              className="rounded-lg border border-indigo-600 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              + Add Experience
            </button>
          </div>

          {profile.experience.length === 0 && (
            <EmptyMessage text="No work experience added yet." />
          )}

          <div className="space-y-5">
            {profile.experience.map((item, index) => (
              <div
                key={item._id || index}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium text-gray-800">
                    Experience #{index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <RepeatInput
                    label="Job Title"
                    value={item.jobTitle}
                    onChange={(value) =>
                      updateExperience(index, 'jobTitle', value)
                    }
                  />

                  <RepeatInput
                    label="Company"
                    value={item.company}
                    onChange={(value) =>
                      updateExperience(index, 'company', value)
                    }
                  />

                  <RepeatInput
                    label="Employment Type"
                    value={item.employmentType}
                    onChange={(value) =>
                      updateExperience(index, 'employmentType', value)
                    }
                    placeholder="Full-time / Internship"
                  />

                  <RepeatInput
                    label="Location"
                    value={item.location}
                    onChange={(value) =>
                      updateExperience(index, 'location', value)
                    }
                  />

                  <RepeatInput
                    label="Start Date"
                    value={item.startDate}
                    onChange={(value) =>
                      updateExperience(index, 'startDate', value)
                    }
                    placeholder="2025"
                  />

                  <RepeatInput
                    label="End Date"
                    value={item.endDate}
                    onChange={(value) =>
                      updateExperience(index, 'endDate', value)
                    }
                    placeholder="Present"
                  />
                </div>

                <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={Boolean(item.currentlyWorking)}
                    onChange={(event) =>
                      updateExperience(
                        index,
                        'currentlyWorking',
                        event.target.checked
                      )
                    }
                  />
                  I currently work here
                </label>

                <div className="mt-4">
                  <RepeatTextarea
                    label="Job Description"
                    value={item.description}
                    onChange={(value) =>
                      updateExperience(index, 'description', value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Master Resume */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Master Resume
          </h2>

          <p className="mb-3 text-sm text-gray-500">
            Add a link to your master resume. Actual document upload will be connected through file storage separately.
          </p>

          <Input
            label="Resume URL"
            name="masterResume"
            value={profile.masterResume}
            onChange={handleChange}
            placeholder="https://example.com/my-resume.pdf"
          />

          {profile.masterResume && (
            <a
              href={profile.masterResume}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline"
            >
              View Master Resume ↗
            </a>
          )}
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

      </form>
    </div>
  );
}

// Reusable input
function Input({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  disabled = false,
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-100 disabled:text-gray-500"
      />
    </div>
  );
}

// Reusable education/experience input
function RepeatInput({
  label,
  value,
  onChange,
  placeholder = '',
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type="text"
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
      />
    </div>
  );
}

// Reusable textarea
function RepeatTextarea({
  label,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <textarea
        rows={3}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
      />
    </div>
  );
}

// Empty state
function EmptyMessage({ text }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
      {text}
    </div>
  );
}

export default Profile;