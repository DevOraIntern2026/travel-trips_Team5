import React from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit } from "react-icons/fa";

const Profile = () => {
  // Temporary user data
  // Later, this can come from Redux or the Backend API
  const user = {
    name: "Walaa Al-Mashout",
    email: "walaa@example.com",
    phone: "+963 9XX XXX XXX",
    location: "Damascus, Syria",
    role: "Customer",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto max-w-5xl">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your personal information and account details.
          </p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-cyan-500 to-blue-600" />

          {/* Profile Info */}
          <div className="px-6 pb-8">

            {/* Avatar */}
            <div className="-mt-14 mb-6 flex items-end justify-between">

              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gray-200 text-4xl text-gray-500 shadow">
                <FaUser />
              </div>

              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <FaEdit />
                Edit Profile
              </button>
            </div>

            {/* Name & Role */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {user.name}
              </h2>

              <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                {user.role}
              </span>
            </div>

            {/* Information */}
            <div className="grid gap-5 md:grid-cols-2">

              {/* Email */}
              <div className="rounded-xl border border-gray-200 p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <FaEnvelope />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Email
                    </p>

                    <p className="font-medium text-gray-900">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="rounded-xl border border-gray-200 p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                    <FaPhone />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Phone
                    </p>

                    <p className="font-medium text-gray-900">
                      {user.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Location
                    </p>

                    <p className="font-medium text-gray-900">
                      {user.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Type */}
              <div className="rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                    <FaUser />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Account Type
                    </p>

                    <p className="font-medium text-gray-900">
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
