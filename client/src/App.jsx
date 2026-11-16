import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from './store/store';
import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Dashboard from './Pages/dashboard/Dashboard';
import AppList from './Pages/AppList';
import AppForm from './Pages/AppForm';
import AppDetail from './Pages/AppDetail';
import Board from './Pages/Board';
import Profile from './Pages/Profile';

import Login from './Pages/login/Login';
import Register from './pages/register/Register';

const PlaceholderPage = ({ title }) => (
  <div className="bg-white p-8 rounded-xl border">
    <h1 className="text-2xl font-bold text-gray-900">
      {title}
    </h1>

    <p className="text-gray-500 mt-2 text-sm">
      This view will be implemented in the next development stage.
    </p>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* Public routes */}
            <Route
              path="/"
              element={<Navigate to="/login" replace />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>

                <Route
                  path="/dashboard"
                  element={<Dashboard />}
                />

                <Route
                  path="/applications"
                  element={<AppList />}
                />

                <Route
                  path="/applications/new"
                  element={<AppForm />}
                />

                <Route
                  path="/applications/:id"
                  element={<AppDetail />}
                />

                <Route
                  path="/applications/:id/edit"
                  element={<AppForm />}
                />

                {/* Kanban Board */}
                <Route
                  path="/board"
                  element={<Board />}
                />

                {/* User Profile */}
                <Route
                  path="/profile"
                  element={<Profile />}
                />

                {/* 404 */}
                <Route
                  path="*"
                  element={
                    <PlaceholderPage title="404 - Page Not Found" />
                  }
                />

              </Route>
            </Route>

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;