// components/admin/AdminDashboard.js
import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="max-w-md mx-auto">
        <Link
          to="/admin/manage-listings"
          className="bg-blue-500 text-white px-6 py-4 rounded-lg hover:bg-blue-600 text-center block"
        >
          <h3 className="text-xl font-semibold">Manage Listings</h3>
          <p className="text-sm mt-2">Approve or reject host submissions</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;