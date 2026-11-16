import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddApplication() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    jobType: 'Full-time',
    status: 'Applied',
    date: new Date().toISOString().split('T')[0],
    salary: '',
    jobUrl: '',
    notes: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const existingApplications = JSON.parse(
      localStorage.getItem('jobtrail_applications') || '[]',
    )

    const newApplication = {
      ...formData,
      id: Date.now(),
    }

    localStorage.setItem(
      'jobtrail_applications',
      JSON.stringify([...existingApplications, newApplication]),
    )

    alert('Application added successfully!')

    navigate('/dashboard')
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">

      <div className="mx-auto max-w-3xl">

        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="mb-6 font-medium text-primary hover:text-indigo-700"
        >
          ← Back to Dashboard
        </button>

        <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">

          <h1 className="text-3xl font-bold text-gray-900">
            Add Job Application
          </h1>

          <p className="mt-2 mb-8 text-gray-500">
            Keep track of the jobs you apply for.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Company Name *
                </label>

                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Google"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Job Position *
                </label>

                <input
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Software Engineer"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Location
                </label>

                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Noida"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Job Type
                </label>

                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                  <option>Remote</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Application Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Application Date *
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Salary
                </label>

                <input
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. ₹6 LPA"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Job Posting URL
                </label>

                <input
                  type="url"
                  name="jobUrl"
                  value={formData.jobUrl}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://example.com/job"
                />
              </div>

            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Notes
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className={inputClass}
                placeholder="Add interview details or other notes..."
                rows={4}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                type="submit"
                className="rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                Save Application
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  )
}

export default AddApplication