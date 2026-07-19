'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';
import { Envelope, Person, Calendar } from '@gravity-ui/icons';

export default function DashboardContactsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch all contact submissions
  const { data: contacts = [], isLoading, isError } = useQuery({
    queryKey: ['admin-contacts-list'],
    queryFn: () => apiClient.get('/api/admin/contacts'),
    refetchInterval: 5000, // Poll every 5s for real-time contact leads!
  });

  const filtered = contacts.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.subject?.toLowerCase().includes(term) ||
      c.message?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8 animate-fade-in font-body">
      <div>
        <h1 className="font-heading font-black text-3xl text-dark uppercase tracking-tight leading-none mb-1">Contact Logs</h1>
        <p className="font-body text-zinc-500 text-sm">Review message submissions and general customer inquiries.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-3 bg-white border border-zinc-150 focus:border-dark rounded-xl text-xs font-heading font-bold uppercase tracking-wider outline-none transition-colors"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white border border-zinc-150 p-12 rounded-2xl text-center">
          <div className="w-8 h-8 border-4 border-dark border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-heading font-bold text-zinc-400 uppercase text-[10px] tracking-wider">Retrieving messages...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
          <p className="font-heading font-bold text-xs uppercase tracking-wider">Error loading inquiries.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-zinc-150 p-16 rounded-2xl text-center">
          <Envelope className="w-8 h-8 text-zinc-300 mx-auto mb-4" />
          <h3 className="font-heading font-bold text-dark text-sm uppercase tracking-wide">No submissions found</h3>
          <p className="text-zinc-400 text-xs mt-1">No contact forms have been submitted yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[10px] font-heading font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="px-6 py-4.5">Sender Info</th>
                  <th className="px-6 py-4.5">Subject</th>
                  <th className="px-6 py-4.5">Message Snippet</th>
                  <th className="px-6 py-4.5">Submitted At</th>
                  <th className="px-6 py-4.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-heading font-bold text-dark uppercase">{item.name}</div>
                      <div className="text-zinc-400 font-mono text-[10px] mt-0.5">{item.email}</div>
                    </td>
                    <td className="px-6 py-4 font-heading font-bold text-zinc-700 uppercase tracking-wide">
                      {item.subject}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 max-w-xs truncate font-body">
                      {item.message}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 font-mono text-[10px]">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedMessage(item)}
                        className="bg-zinc-50 border border-zinc-200 text-dark hover:bg-dark hover:text-white px-4 py-2 rounded-xl font-heading font-bold text-[9px] uppercase tracking-widest cursor-pointer transition-colors"
                      >
                        Read Message
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message Viewer Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-150 rounded-2xl w-full max-w-lg overflow-hidden animate-fade-in shadow-xl">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="font-heading font-bold text-sm text-dark uppercase tracking-wider flex items-center gap-2">
                <Envelope className="w-4 h-4 text-dark" /> Inquiry Details
              </h2>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-zinc-400 hover:text-dark text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-dark font-heading font-bold text-xs uppercase">
                  <Person className="w-3.5 h-3.5 text-zinc-400" /> {selectedMessage.name}
                </div>
                <div className="text-zinc-500 font-mono text-[10px] ml-5.5">{selectedMessage.email}</div>
                <div className="flex items-center gap-2 text-zinc-400 font-mono text-[10px] pt-1">
                  <Calendar className="w-3.5 h-3.5" /> {new Date(selectedMessage.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400">Subject</h4>
                <p className="font-heading font-bold text-dark text-xs uppercase tracking-wide">{selectedMessage.subject}</p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400">Message Content</h4>
                <p className="font-body text-zinc-650 text-xs leading-relaxed whitespace-pre-wrap bg-zinc-50/50 p-4 rounded-xl border border-zinc-150/40">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            <div className="p-5 bg-zinc-50/50 border-t border-zinc-100 flex justify-end">
              <button
                onClick={() => setSelectedMessage(null)}
                className="bg-dark text-white hover:bg-[#C9FA75] hover:text-dark px-6 py-2.5 rounded-xl font-heading font-bold text-[9px] uppercase tracking-widest cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
