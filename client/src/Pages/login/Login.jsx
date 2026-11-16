import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  loginSchema,
  validateSingleField,
} from '../../utils/authValidation';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { CheckCircle2, AlertCircle } from 'lucide-react';

import './login.css';
import jobtrailLogo from "../../assets/logo3.png";
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: value,
    };

    setFormData(updatedData);

    if (touched[field]) {
      const errors = validateSingleField(
        loginSchema,
        updatedData,
        field,
      );

      setFieldErrors((previousErrors) => ({
        ...previousErrors,
        [field]: errors,
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((previousTouched) => ({
      ...previousTouched,
      [field]: true,
    }));

    const errors = validateSingleField(
      loginSchema,
      formData,
      field,
    );

    setFieldErrors((previousErrors) => ({
      ...previousErrors,
      [field]: errors,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    setServerError('');

    // Validate the form before calling the backend.
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (!formattedErrors[field]) {
          formattedErrors[field] = [];
        }

        formattedErrors[field].push(issue.message);
      });

      setFieldErrors(formattedErrors);
      setTouched({
        email: true,
        password: true,
      });

      return;
    }

    setLoading(true);

    try {
      // Debugging information.
      console.log('Login function:', login);
      console.log('Submitting login request...');

      await login(
        formData.email.trim().toLowerCase(),
        formData.password,
      );

      console.log('Login successful.');

      navigate('/dashboard');
    } catch (error) {
      // Print the actual error and its stack trace.
      console.error('LOGIN ERROR:', error);
      console.error('ERROR MESSAGE:', error?.message);
      console.error('ERROR STACK:', error?.stack);

      setServerError(
        error?.message || 'Failed to sign in. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* Left marketing panel */}
      <div className="bg-indigo-950 text-white p-12 flex flex-col justify-between sideMarketingPanel">
        <div
          className="flex items-center gap-2.5"
          style={{ width: '15rem' }}
        >
          <div
            className="w-16 h-16 rounded-lg text-white font-bold flex items-center justify-center transparentImage"
            style={{ width: '100%' }}
          >
            <img
              src={jobtrailLogo}
              alt="JobTrail Logo"
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="space-y-6 max-w-md my-12">
          <h1 className="text-4xl font-bold leading-tight">
            Every application, one clear trail.
          </h1>

          <ul className="space-y-3 text-indigo-200">
            <li className="flex items-center gap-3">
              <CheckCircle2
                size={20}
                className="text-indigo-400"
              />
              Track every status
            </li>

            <li className="flex items-center gap-3">
              <CheckCircle2
                size={20}
                className="text-indigo-400"
              />
              See your week at a glance
            </li>

            <li className="flex items-center gap-3">
              <CheckCircle2
                size={20}
                className="text-indigo-400"
              />
              Get AI help with cover letters
            </li>
          </ul>
        </div>

        <p className="text-xs text-indigo-400"></p>
      </div>

      {/* Right login form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Demo credentials */}
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-800">
            <span className="font-semibold block mb-0.5">
              Demo Credentials:
            </span>

            Email:{' '}
            <code className="font-mono font-bold">
              jane@gmail.com
            </code>

            {' | '}

            Password:{' '}
            <code className="font-mono font-bold">
              Password@123
            </code>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm flex items-center gap-2">
              <AlertCircle
                size={16}
                className="shrink-0"
              />

              <span>{serverError}</span>
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="space-y-4"
            noValidate
          >
            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>

              <input
                type="email"
                placeholder="jane@gmail.com"
                value={formData.email}
                onChange={(event) =>
                  handleChange('email', event.target.value)
                }
                onBlur={() => handleBlur('email')}
                className={`w-full border rounded-lg p-2.5 text-sm ${
                  fieldErrors.email?.length
                    ? 'border-rose-500 bg-rose-50/20'
                    : 'border-slate-300'
                }`}
              />

              {fieldErrors.email?.length > 0 && (
                <p className="text-xs text-rose-600 mt-1 font-medium">
                  {fieldErrors.email[0]}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(event) =>
                    handleChange('password', event.target.value)
                  }
                  onBlur={() => handleBlur('password')}
                  className={`w-full border rounded-lg p-2.5 pr-10 text-sm ${
                    fieldErrors.password?.length
                      ? 'border-rose-500 bg-rose-50/20'
                      : 'border-slate-300'
                  }`}
                />

                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 flex items-center justify-center"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </button>
              </div>

              <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                Password must be at least 8 characters and include
                an uppercase letter, a lowercase letter, a number,
                and a special character.
              </p>

              {fieldErrors.password?.length > 0 && (
                <ul className="mt-2 space-y-1 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                  {fieldErrors.password.map((message, index) => (
                    <li key={index}>
                      • {message}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Sign in'}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600">
            New here?{' '}
            <Link
              to="/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

