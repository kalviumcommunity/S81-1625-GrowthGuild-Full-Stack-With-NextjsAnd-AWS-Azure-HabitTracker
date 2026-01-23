"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Breadcrumbs from "@/components/Breadcrumbs";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();

        if (result.success) {
          setUsers(result.data);
        } else {
          setError(result.message || "Failed to fetch users");
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Users", href: "/users" },
  ];

  return (
    <ProtectedRoute>
      <div className="space-y-8 animate-fade-in-up">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Users Directory</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Browse and view user profiles
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="badge badge-primary">{users.length} users</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading users...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Users Grid */}
        {!loading && !error && users.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user, index) => (
              <Link
                key={user.id}
                href={`/users/${user.id}`}
                className="stat-card hover-lift group cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform">
                    {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {user.name || "Unnamed User"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`badge ${user.role === "admin" ? "badge-warning" : "badge-primary"}`}>
                        {user.role}
                      </span>
                      <span className="text-xs text-gray-400">
                        ID: {user.id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium flex items-center">
                    View Profile
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && users.length === 0 && (
          <div className="stat-card text-center py-12">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-xl font-semibold mb-2">No users found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are no users registered yet.
            </p>
          </div>
        )}

        {/* SEO Info Card */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <span className="mr-2">💡</span> About This Page
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This is a <strong>protected route</strong> that requires authentication. 
            The users list demonstrates dynamic data fetching and links to individual 
            user profiles using <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">/users/[id]</code> dynamic routing.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
