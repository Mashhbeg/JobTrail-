import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchApplications,
  updateApplication,
} from '../api/applications.js';

const STATUSES = [
  'Wishlist',
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Accepted',
  'Rejected',
  'Withdrawn',
];

function Board() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadApplications = async () => {
    try {
      setError('');
      setLoading(true);

      const response = await fetchApplications();

      const list = Array.isArray(response)
        ? response
        : response?.data ?? [];

      setApplications(list);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load applications. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleDragStart = (event, application) => {
    event.dataTransfer.setData('applicationId', application.id || application._id);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (event, newStatus) => {
    event.preventDefault();

    const applicationId = event.dataTransfer.getData('applicationId');

    const application = applications.find(
      (item) => String(item.id || item._id) === String(applicationId)
    );

    if (!application || application.status === newStatus || updatingId) {
      return;
    }

    try {
      setUpdatingId(applicationId);
      setError('');

      const updated = await updateApplication(applicationId, {
        status: newStatus,
      });

      setApplications((previous) =>
        previous.map((item) =>
          String(item.id || item._id) === String(applicationId)
            ? { ...item, ...updated }
            : item
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to update application status.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading your application board...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Application Board
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your job applications by dragging them between stages.
          </p>
        </div>

        <Link
          to="/applications/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Application
        </Link>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            onClick={loadApplications}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map((status) => {
          const columnApplications = applications.filter(
            (application) => application.status === status
          );

          return (
            <div
              key={status}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, status)}
              className="w-72 min-w-72 rounded-xl border border-gray-200 bg-gray-50 p-3"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">
                  {status}
                </h2>

                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-600">
                  {columnApplications.length}
                </span>
              </div>

              <div className="min-h-40 space-y-3">
                {columnApplications.map((application) => {
                  const id = application.id || application._id;

                  return (
                    <div
                      key={id}
                      draggable={updatingId === null}
                      onDragStart={(event) =>
                        handleDragStart(event, application)
                      }
                      className={`cursor-grab rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md ${
                        updatingId === String(id)
                          ? 'opacity-50'
                          : ''
                      }`}
                    >
                      <Link
                        to={`/applications/${id}`}
                        className="font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {application.company}
                      </Link>

                      <p className="mt-1 text-sm text-gray-600">
                        {application.role}
                      </p>

                      {application.location && (
                        <p className="mt-2 text-xs text-gray-500">
                          📍 {application.location}
                        </p>
                      )}

                      {application.appliedDate && (
                        <p className="mt-2 text-xs text-gray-400">
                          Applied: {new Date(
                            application.appliedDate
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  );
                })}

                {columnApplications.length === 0 && (
                  <div className="rounded-lg border border-dashed border-gray-300 p-5 text-center text-xs text-gray-400">
                    Drop applications here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Board;