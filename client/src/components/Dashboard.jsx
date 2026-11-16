import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const initialApplications = [
  {
    id: 1,
    company: 'Google',
    role: 'Software Engineer',
    status: 'Interview',
    date: '2026-10-15',
  },
  {
    id: 2,
    company: 'Microsoft',
    role: 'Frontend Developer',
    status: 'Applied',
    date: '2026-10-14',
  },
  {
    id: 3,
    company: 'Amazon',
    role: 'Graduate Engineer Trainee',
    status: 'Offer',
    date: '2026-10-12',
  },
  {
    id: 4,
    company: 'Infosys',
    role: 'System Engineer',
    status: 'Rejected',
    date: '2026-10-10',
  },
];

const getApplications = () => {
  try {
    const saved = localStorage.getItem('jobtrail_applications');

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : initialApplications;
    }

    return initialApplications;
  } catch (error) {
    console.error('Could not load applications:', error);
    return initialApplications;
  }
};

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [applications] = useState(getApplications);

  const stats = [
    {
      title: 'Total Applications',
      count: applications.length,
      color: 'border-indigo-500',
    },
    {
      title: 'Applied',
      count: applications.filter((app) => app.status === 'Applied').length,
      color: 'border-blue-500',
    },
    {
      title: 'Interviews',
      count: applications.filter((app) => app.status === 'Interview').length,
      color: 'border-amber-500',
    },
    {
      title: 'Offers',
      count: applications.filter((app) => app.status === 'Offer').length,
      color: 'border-green-500',
    },
  ];

  const getStatusStyle = (status) => {
    const styles = {
      Applied: 'bg-blue-100 text-blue-700',
      Interview: 'bg-amber-100 text-amber-700',
      Offer: 'bg-green-100 text-green-700',
      Rejected: 'bg-red-100 text-red-700',
    };

    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (date) => {
    if (!date) return '—';

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleLogout = () => {
    try {
      logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAddApplication = () => {
    navigate('/applications/add');
  };

  return (
    <div className="min-h-screen bg-background md:flex">
      {/* Sidebar */}
      <aside className="w-full bg-white p-6 shadow-sm md:min-h-screen md:w-64 md:border-r">
        <h1 className="mb-10 text-2xl font-bold text-primary">
          JobTrail
        </h1>

        <nav className="space-y-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="block w-full rounded-lg bg-indigo-50 px-4 py-3 text-left font-semibold text-primary"
          >
            Dashboard
          </button>

          <button
            type="button"
            onClick={handleAddApplication}
            className="block w-full rounded-lg px-4 py-3 text-left text-gray-600 hover:bg-gray-100"
          >
            Applications
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="block w-full rounded-lg px-4 py-3 text-left text-gray-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-6 md:p-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h2>

          <p className="mt-2 text-gray-500">
            Track your job applications and career progress.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className={`rounded-xl border border-gray-200 border-t-4 ${stat.color} bg-white p-6 shadow-sm`}
            >
              <p className="text-sm font-medium text-gray-500">
                {stat.title}
              </p>

              <h3 className="mt-3 text-3xl font-bold text-gray-900">
                {stat.count}
              </h3>
            </div>
          ))}
        </div>

        {/* Recent Applications */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Recent Applications
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Review your job applications.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddApplication}
              className="rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              + Add Application
            </button>
          </div>

          {/* Applications Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm text-gray-500">
                <tr>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Applied Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {applications.map((app, index) => (
                  <tr
                    key={app.id ?? `${app.company}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-5 font-semibold text-gray-900">
                      {app.company}
                    </td>

                    <td className="whitespace-nowrap px-6 py-5 text-gray-600">
                      {app.role}
                    </td>

                    <td className="whitespace-nowrap px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(app.status)}`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-5 text-gray-500">
                      {formatDate(app.date)}
                    </td>
                  </tr>
                ))}

                {applications.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No applications yet. Click Add Application to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

