'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';
import toast from 'react-hot-toast';

export default function DashboardCustomersPage() {
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => apiClient.get('/api/users'),
  });

  // Promote/Demote Role Mutation
  const changeRoleMutation = useMutation({
    mutationFn: ({ id, role }) => apiClient.patch(`/api/users/${id}/role`, { role }),
    onSuccess: () => {
      toast.success('User role modified successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to change role');
    }
  });

  // Block/Unblock User Mutation
  const toggleBlockMutation = useMutation({
    mutationFn: ({ id, isBlocked }) => apiClient.patch(`/api/users/${id}/block`, { isBlocked }),
    onSuccess: () => {
      toast.success('User restriction status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to modify status');
    }
  });

  const handleRoleToggle = (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (confirm(`Are you sure you want to promote/demote this user to "${newRole}"?`)) {
      changeRoleMutation.mutate({ id, role: newRole });
    }
  };

  const handleBlockToggle = (id, currentBlocked) => {
    const blockStatus = !currentBlocked;
    const actionText = blockStatus ? 'block' : 'unblock';
    if (confirm(`Are you sure you want to ${actionText} this user?`)) {
      toggleBlockMutation.mutate({ id, isBlocked: blockStatus });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-body">
      <div>
        <h1 className="font-heading font-black text-3xl text-dark uppercase tracking-tight leading-none mb-1">Customers</h1>
        <p className="font-body text-zinc-500 text-sm">Manage user access permissions, review roles, and toggle blocks.</p>
      </div>

      {isLoading ? (
        <div className="bg-white border border-zinc-150 p-12 rounded-2xl text-center">
          <div className="w-8 h-8 border-4 border-dark border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-heading font-bold text-zinc-400 uppercase text-[10px] tracking-wider">Retrieving profiles...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
          <p className="font-heading font-bold text-xs uppercase tracking-wider">Error loading user accounts.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400">
                  <th className="px-6 py-4.5">User ID</th>
                  <th className="px-6 py-4.5">Full Name</th>
                  <th className="px-6 py-4.5">Email Address</th>
                  <th className="px-6 py-4.5">Role</th>
                  <th className="px-6 py-4.5">Status</th>
                  <th className="px-6 py-4.5 text-right font-heading uppercase">Manage Account</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users.length > 0 ? (
                  users.map((userObj) => (
                    <tr key={userObj._id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-zinc-500 font-semibold">{userObj._id}</td>
                      <td className="px-6 py-4 font-bold text-dark">{userObj.name}</td>
                      <td className="px-6 py-4 font-semibold text-zinc-600 lowercase">{userObj.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-heading font-bold uppercase tracking-wider ${
                          userObj.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-zinc-100 text-zinc-650'
                        }`}>
                          {userObj.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {userObj.isBlocked ? (
                          <span className="bg-red-100 text-red-800 text-[10px] font-heading font-bold uppercase px-3 py-1 rounded-full">Blocked</span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-heading font-bold uppercase px-3 py-1 rounded-full">Active</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleRoleToggle(userObj._id, userObj.role)}
                          disabled={changeRoleMutation.isPending}
                          className="px-3 py-1.5 border border-zinc-200 hover:border-dark text-dark rounded-lg font-heading font-bold uppercase tracking-wider text-[9px] transition cursor-pointer"
                        >
                          Change Role
                        </button>
                        <button
                          onClick={() => handleBlockToggle(userObj._id, userObj.isBlocked)}
                          disabled={toggleBlockMutation.isPending}
                          className={`px-3 py-1.5 rounded-lg font-heading font-bold uppercase tracking-wider text-[9px] transition cursor-pointer ${
                            userObj.isBlocked
                              ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                              : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          {userObj.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-zinc-400 font-heading font-bold uppercase tracking-wider">No customer profiles found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
