import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Plus,
  ArrowLeft,
  MapPin,
  Calendar,
  ExternalLink,
  BriefcaseBusiness,
  Trash2,
  Filter,
} from 'lucide-react'

function Applications() {
  const navigate = useNavigate()

  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('jobtrail_applications')

      if (!saved) {
        return []
      }

      const parsed = JSON.parse(saved)

      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')

  const statuses = [
    'All',
    'Applied',
    'Interview',
    'Offer',
    'Rejected',
  ]

  const filteredApplications = applications.filter((application) => {
    const searchText = search.toLowerCase()

    const company = (application.company || '').toLowerCase()
    const role = (application.role || '').toLowerCase()
    const location = (application.location || '').toLowerCase()

    const matchesSearch =
      company.includes(searchText) ||
      role.includes(searchText) ||
      location.includes(searchText)

    const matchesStatus =
      selectedStatus === 'All' ||
      application.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const getStatusStyle = (status) => {
    const styles = {
      Applied: 'bg-blue-100 text-blue-700',
      Interview: 'bg-amber-100 text-amber-700',
      Offer: 'bg-green-100 text-green-700',
      Rejected: 'bg-red-100 text-red-700',
    }

    return styles[status] || 'bg-gray-100 text-gray-700'
  }

  const formatDate = (date) => {
    if (!date) {
      return 'Date not specified'
    }

    const parsedDate = new Date(`${date}T00:00:00`)

    if (Number.isNaN(parsedDate.getTime())) {
      return date
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const deleteApplication = (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this application?',
    )

    if (!confirmed) {
      return
    }

    const updatedApplications = applications.filter(
      (application) => application.id !== id,
    )

    setApplications(updatedApplications)

    localStorage.setItem(
      'jobtrail_applications',
      JSON.stringify(updatedApplications),
    )
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-2xl font-bold text-primary"
          >
            JobTrail
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>

        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Page Heading */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Applications
            </h1>

            <p className="mt-2 text-gray-500">
              Manage and track all your job applications in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/applications/add')}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            <Plus size={20} />
            Add Application
          </button>

        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 md:flex-row">

          <div className="relative flex-1">

            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search company, position, or location..."
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

          </div>

          <div className="flex items-center gap-3">

            <Filter size={19} className="text-gray-500" />

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 md:w-48"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All Statuses' : status}
                </option>
              ))}
            </select>

          </div>

        </div>

        {/* Application Count */}
        <div className="mb-5 flex items-center justify-between">

          <p className="text-sm text-gray-500">
            Showing{' '}
            <span className="font-semibold text-gray-900">
              {filteredApplications.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-gray-900">
              {applications.length}
            </span>{' '}
            applications
          </p>

        </div>

        {/* Application Cards */}
        {filteredApplications.length > 0 ? (

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {filteredApplications.map((application) => (

              <div
                key={application.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >

                {/* Company and Position */}
                <div className="mb-5 flex items-start justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-primary">
                      <BriefcaseBusiness size={24} />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {application.role}
                      </h2>

                      <p className="mt-1 font-medium text-gray-600">
                        {application.company}
                      </p>
                    </div>

                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(application.status)}`}
                  >
                    {application.status}
                  </span>

                </div>

                {/* Application Details */}
                <div className="space-y-3 border-t border-gray-100 pt-4 text-sm text-gray-500">

                  {application.location && (
                    <p className="flex items-center gap-2">
                      <MapPin size={17} />
                      {application.location}
                    </p>
                  )}

                  <p className="flex items-center gap-2">
                    <Calendar size={17} />
                    Applied on {formatDate(application.date)}
                  </p>

                  {application.jobType && (
                    <p className="flex items-center gap-2">
                      <BriefcaseBusiness size={17} />
                      {application.jobType}
                    </p>
                  )}

                  {application.salary && (
                    <p>
                      <span className="font-medium text-gray-700">
                        Salary:
                      </span>{' '}
                      {application.salary}
                    </p>
                  )}

                  {application.notes && (
                    <p className="break-words">
                      <span className="font-medium text-gray-700">
                        Notes:
                      </span>{' '}
                      {application.notes}
                    </p>
                  )}

                </div>

                {/* Card Actions */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">

                  {application.jobUrl ? (
                    <a
                      href={application.jobUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 font-medium text-primary hover:text-indigo-700"
                    >
                      View Job Posting
                      <ExternalLink size={16} />
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400">
                      No job link added
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteApplication(application.id)}
                    className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        ) : (

          /* Empty State */
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-primary">
              <BriefcaseBusiness size={30} />
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              No applications found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              {applications.length === 0
                ? 'You have not added any job applications yet. Start tracking your career journey today.'
                : 'Try changing your search or selecting a different status.'}
            </p>

            {applications.length === 0 && (
              <button
                type="button"
                onClick={() => navigate('/applications/add')}
                className="mt-6 rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Add Your First Application
              </button>
            )}

          </div>

        )}

      </main>

    </div>
  )
}

export default Applications