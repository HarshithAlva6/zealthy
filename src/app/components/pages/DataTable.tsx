'use client'
import { useUsers } from '../../../hooks/useUsers';
import {FolderSync } from 'lucide-react';

export default function DataTable() {
  const { users, loading, refetch } = useUsers()
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">Loading user data...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-center space-x-4 text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Data</h2>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-[#5A2D82] text-white rounded-md hover:bg-[#3E1F61]"
        >
          <FolderSync />
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                About Me
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Birthdate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={user.id || index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-xs truncate">
                    {user.about || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {user.address ? (
                    <div className="max-w-xs">
                    {[user.address.address, user.address.city, user.address.state].filter(Boolean).join(', ')}
                    {user.address.zip && ` ${user.address.zip}`}
                    </div>
                  ) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.birthdate ? new Date(user.birthdate).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <span className={`px-4 py-2 text-sm font-medium rounded-full ${
                    user.completed 
                      ? 'bg-teal-100 text-teal-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {user.completed ? 'Completed' : `Step ${user.onboarding || 1}`}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.created ? new Date(user.created).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found. Complete the onboarding flow to see data here.
          </div>
        )}
      </div>
    </div>
  )
}