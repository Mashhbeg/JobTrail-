import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  fetchApplicationById,
  updateApplication,
  deleteApplication,
} from '../api/applications';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import { ExternalLink, Trash2, Edit3, Plus, Calendar } from 'lucide-react';

const ALL_STATUSES = [
  'Wishlist',
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Accepted',
  'Rejected',
  'Withdrawn',
];

const AppDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [noteText, setNoteText] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  // Load application details.
  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    fetchApplicationById(id)
      .then((data) => {
        if (!active) return;

        setApp(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;

        console.error('Failed to load application:', err);
        setError(
          err.response?.data?.error?.message ||
            'Application not found. Please try again.'
        );
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  // Change status and let the backend maintain status history.
  const handleStatusChange = async (newStatus) => {
    if (!app || newStatus === app.status || savingStatus) {
      return;
    }

    const previousStatus = app.status;

    setSavingStatus(true);
    setError(null);

    // Update the dropdown immediately.
    setApp((current) => ({
      ...current,
      status: newStatus,
    }));

    try {
      // Do not send history from the frontend.
      // The backend adds the new history entry.
      const updated = await updateApplication(id, {
        status: newStatus,
      });

      if (!updated) {
        throw new Error('The server did not return the updated application.');
      }

      setApp(updated);
    } catch (err) {
      console.error('Failed to update application status:', err);

      // Restore the previous status if saving fails.
      setApp((current) => ({
        ...current,
        status: previousStatus,
      }));

      setError(
        err.response?.data?.error?.message ||
          err.message ||
          'Failed to update application status. Please try again.'
      );
    } finally {
      setSavingStatus(false);
    }
  };

  // Add a note.
  const handleAddNote = async (e) => {
    e.preventDefault();

    if (!noteText.trim()) return;

    setError(null);

    const newNote = {
      id: Date.now().toString(),
      text: noteText.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const updated = await updateApplication(id, {
        notes: [...(app.notes || []), newNote],
      });

      setApp(updated);
      setNoteText('');
    } catch (err) {
      console.error('Failed to add note:', err);

      setError(
        err.response?.data?.error?.message ||
          'Failed to add note. Please try again.'
      );
    }
  };

  // Add an interview.
  const handleAddInterview = async (e) => {
    e.preventDefault();

    if (!interviewType.trim() || !interviewDate) return;

    setError(null);

    const newInterview = {
      id: Date.now().toString(),
      type: interviewType.trim(),
      scheduledAt: new Date(
        `${interviewDate}T12:00:00`
      ).toISOString(),
    };

    try {
      const updated = await updateApplication(id, {
        interviews: [...(app.interviews || []), newInterview],
      });

      setApp(updated);
      setInterviewType('');
      setInterviewDate('');
    } catch (err) {
      console.error('Failed to add interview:', err);

      setError(
        err.response?.data?.error?.message ||
          'Failed to add interview. Please try again.'
      );
    }
  };

  // Delete application.
  const handleDelete = async () => {
    setError(null);

    try {
      await deleteApplication(id);
      navigate('/applications');
    } catch (err) {
      console.error('Failed to delete application:', err);

      setError(
        err.response?.data?.error?.message ||
          'Failed to delete application. Please try again.'
      );

      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-gray-500">
        Loading application details...
      </div>
    );
  }

  if (!app) {
    return (
      <div className="p-8 text-rose-600 bg-rose-50 rounded-xl">
        {error || 'Application not found.'}
      </div>
    );
  }

  const initials = (app.company || 'NA').slice(0, 2).toUpperCase();

  // Format history dates consistently.
  const formatDate = (value) => {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {error && (
        <div
          role="alert"
          className="p-4 text-rose-700 bg-rose-50 rounded-xl border border-rose-200"
        >
          {error}
        </div>
      )}

      {/* Application header */}
      <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-indigo-50 text-primary font-bold text-xl flex items-center justify-center border border-indigo-100">
            {initials}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {app.role}
            </h1>

            <p className="text-gray-600 font-medium">
              {app.company} ·{' '}
              <span className="text-gray-500">
                {app.location || 'Location not specified'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={app.status}
            disabled={savingStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm font-medium bg-gray-50 hover:bg-white focus:ring-2 focus:ring-primary outline-none disabled:opacity-60"
            aria-label="Application status"
          >
            {ALL_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {savingStatus && (
            <span className="text-xs text-gray-500">
              Saving...
            </span>
          )}

          <Link
            to={`/applications/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            <Edit3 size={16} />
            Edit
          </Link>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-50"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Details and activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Application details */}
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm border-b pb-4">
              <div>
                <span className="text-gray-500 block">
                  Job link
                </span>

                {app.jobUrl ? (
                  <a
                    href={app.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center gap-1 font-medium truncate mt-1"
                  >
                    {app.jobUrl}
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <span className="text-gray-400 mt-1 block">
                    Not provided
                  </span>
                )}
              </div>

              <div>
                <span className="text-gray-500 block">
                  Source
                </span>

                <span className="font-medium text-gray-900 mt-1 block">
                  {app.source || 'Direct'}
                </span>
              </div>

              <div>
                <span className="text-gray-500 block">
                  Applied date
                </span>

                <span className="font-medium text-gray-900 mt-1 block">
                  {app.appliedDate || 'Not specified'}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Job description
              </h3>

              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {app.jobDescription ||
                  'No job description added yet.'}
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              Notes
            </h2>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Add a new note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                type="submit"
                disabled={!noteText.trim()}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                Add Note
              </button>
            </form>

            <div className="space-y-3 pt-2">
              {(app.notes || []).length === 0 && (
                <p className="text-sm text-gray-400">
                  No notes yet.
                </p>
              )}

              {(app.notes || []).map((note, index) => (
                <div
                  key={note.id || index}
                  className="p-3.5 bg-gray-50 rounded-lg border text-sm"
                >
                  <p className="text-gray-800">
                    {note.text || note.content}
                  </p>

                  <span className="text-xs text-gray-400 mt-1 block">
                    {formatDate(note.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status history and interviews */}
        <div className="space-y-6">
          {/* Status history */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Status history
            </h2>

            {(app.history || []).length === 0 ? (
              <p className="text-sm text-gray-400">
                No status history available.
              </p>
            ) : (
              <div className="relative pl-4 border-l-2 border-indigo-100 space-y-6">
                {[...(app.history || [])]
                  .reverse()
                  .map((item, index) => (
                    <div
                      key={item.id || `${item.status}-${index}`}
                      className="relative"
                    >
                      <div className="w-3 h-3 rounded-full bg-primary absolute -left-[23px] top-1.5 ring-4 ring-white" />

                      <div className="flex items-center justify-between gap-2">
                        <StatusBadge status={item.status} />

                        <span className="text-xs text-gray-500">
                          {formatDate(item.at)}
                        </span>
                      </div>

                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Interviews */}
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              Interviews
            </h2>

            <div className="space-y-3">
              {(app.interviews || []).length === 0 && (
                <p className="text-sm text-gray-400">
                  No interviews scheduled.
                </p>
              )}

              {(app.interviews || []).map((interview, index) => (
                <div
                  key={interview.id || index}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50 border text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar size={16} className="text-primary" />

                    <span className="font-medium text-gray-900">
                      {interview.type}
                    </span>
                  </div>

                  <span className="text-gray-500 text-xs">
                    {formatDate(interview.scheduledAt)}
                  </span>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleAddInterview}
              className="space-y-2 pt-2 border-t"
            >
              <input
                type="text"
                placeholder="Interview round (e.g. Technical Round)"
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />

              <div className="flex gap-2">
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                />

                <button
                  type="submit"
                  disabled={!interviewType.trim() || !interviewDate}
                  className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        title="Delete Application"
        message={`Are you sure you want to delete your application for ${app.role} at ${app.company}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default AppDetail;

