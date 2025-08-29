// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Locations from './pages/Locations';
import LocationDetails from './pages/LocationDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Reservations from './pages/Reservations';

// Admin Components (use existing Dashboard.js)
import AdminDashboard from './components/admin/Dashboard';
import AdminManageListings from './components/admin/AdminManageListings';

// Host Components
import HostDashboard from './components/host/HostDashboard';
import HostManageListings from './components/host/HostManageListings';
import HostReservations from './components/host/HostReservations';
import CreateListing from './components/host/CreateListing';
import UpdateListing from './components/host/UpdateListing'; // Changed from admin to host

import { AuthProvider } from './utils/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/locations/:id" element={<LocationDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* User Routes */}
              <Route
                path="/reservations"
                element={
                  <ProtectedRoute requiredRole="user">
                    <Reservations />
                  </ProtectedRoute>
                }
              />
              
              {/* Host Routes */}
              <Route
                path="/host"
                element={
                  <ProtectedRoute requiredRole="host">
                    <HostDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/host/create-listing"
                element={
                  <ProtectedRoute requiredRole="host">
                    <CreateListing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/host/listings"
                element={
                  <ProtectedRoute requiredRole="host">
                    <HostManageListings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/host/update-listing/:id"
                element={
                  <ProtectedRoute requiredRole="host">
                    <UpdateListing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/host/reservations"
                element={
                  <ProtectedRoute requiredRole="host">
                    <HostReservations />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin Routes - using existing Dashboard */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/manage-listings"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminManageListings />
                  </ProtectedRoute>
                }
              />
              
              {/* Keep existing admin routes for backward compatibility */}
              <Route
                path="/admin/create-listing"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <CreateListing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/listings"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminManageListings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/update-listing/:id"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <UpdateListing />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;