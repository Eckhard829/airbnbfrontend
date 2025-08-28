// components/host/HostDashboard.js
import React from "react";
import { Link } from "react-router-dom";

const HostDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Host Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Link
          to="/host/create-listing"
          className="bg-red-500 text-white px-6 py-4 rounded-lg hover:bg-red-600 text-center block"
        >
          <h3 className="text-xl font-semibold">Create New Listing</h3>
          <p className="text-sm mt-2">Add a new property to rent</p>
        </Link>
        <Link
          to="/host/listings"
          className="bg-blue-500 text-white px-6 py-4 rounded-lg hover:bg-blue-600 text-center block"
        >
          <h3 className="text-xl font-semibold">Manage Listings</h3>
          <p className="text-sm mt-2">Edit or delete your properties</p>
        </Link>
      </div>
    </div>
  );
};

export default HostDashboard;