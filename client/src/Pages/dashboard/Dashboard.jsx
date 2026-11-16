import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { fetchStats, fetchApplications } from '../../api/applications.js';
import { setFilters } from '../../store/applicationsSlice';
import { useAuth } from '../../context/AuthContext';

import PageBanner from '../../components/common/PageBanner';
import StatCard from '../../components/common/StatCard';
import WeeklyChart from '../../components/dashboard/WeeklyChart';
import UpcomingInterviews from '../../components/dashboard/UpcomingInterviews';
import RecentApplications from '../../components/dashboard/RecentApplications';

const Dashboard = () => {
const { user } = useAuth();
const navigate = useNavigate();
const dispatch = useDispatch();

const [stats, setStats] = useState(null);
const [applications, setApplications] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
let cancelled = false;


const loadDashboard = async () => {
  setLoading(true);
  setError('');

  try {
    const [statsData, appsData] = await Promise.all([
      fetchStats(),
      fetchApplications(),
    ]);

    if (!cancelled) {
      setStats(statsData);
      setApplications(Array.isArray(appsData) ? appsData : []);
    }
  } catch (err) {
    if (!cancelled) {
      setError(
        err.message || 'Unable to load dashboard data. Please try again.',
      );
    }
  } finally {
    if (!cancelled) {
      setLoading(false);
    }
  }
};

loadDashboard();

return () => {
  cancelled = true;
};


}, []);

if (loading) {
return ( <div className="p-8 text-slate-500">
Loading dashboard... </div>
);
}

if (error) {
return ( <div className="p-8"> <div
       role="alert"
       className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700"
     >
{error}
<button
type="button"
onClick={() => window.location.reload()}
className="ml-3 font-medium underline"
>
Retry </button> </div> </div>
);
}

const upcomingInterviews = applications.flatMap((app) =>
(app.interviews || []).map((interview) => ({
...interview,
company: app.company,
appId: app.id,
})),
);

const dynamicCounts = {
Applied:
applications.filter((app) => app.status === 'Applied').length,
Interview:
applications.filter((app) => app.status === 'Interview').length,
Offer:
applications.filter((app) => app.status === 'Offer').length,
Rejected:
applications.filter((app) => app.status === 'Rejected').length,
};

const handleCardClick = (statusKey) => {
dispatch(setFilters({ status: statusKey, page: 1 }));
navigate('/applications');
};

return ( <div className="space-y-6"> <div className="flex flex-col gap-1"> <h1 className="text-2xl font-bold text-gray-900">
Dashboard{user?.name ? `, ${user.name.split(' ')[0]}` : ''} </h1> <p className="text-sm text-gray-500">
Here's an overview of your job applications. </p> </div>


  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {Object.entries(dynamicCounts).map(([status, count]) => (
      <StatCard
        key={status}
        label={status}
        count={count}
        onClick={() => handleCardClick(status)}
      />
    ))}
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
      <WeeklyChart
        title="Applications per week"
        badgeText="Last 8 Weeks"
        data={stats?.weekly || []}
      />
    </div>

    <div>
      <UpcomingInterviews
        title="Upcoming interviews"
        interviews={upcomingInterviews}
        limit={4}
      />
    </div>
  </div>

  <RecentApplications
    title="Recent applications"
    applications={applications}
    limit={4}
    viewAllLink="/applications"
  />
</div>


);
};

export default Dashboard;
