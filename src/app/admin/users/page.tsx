'use client';

import { useState } from 'react';
const mockUsers = [
  { id: '1', name: 'Jamie McGregor', email: 'jamie@example.com', role: 'user' as const, entries: 47, spent: 9450, joined: '2026-01-15' },
  { id: '2', name: 'Sarah Kennedy', email: 'sarah@example.com', role: 'user' as const, entries: 92, spent: 18200, joined: '2025-11-20' },
  { id: '3', name: 'Craig Davidson', email: 'craig@example.com', role: 'user' as const, entries: 23, spent: 4150, joined: '2026-03-08' },
  { id: '4', name: 'Emma Ross', email: 'emma@example.com', role: 'user' as const, entries: 156, spent: 31000, joined: '2025-09-01' },
  { id: '5', name: 'Mark Thomson', email: 'mark@example.com', role: 'user' as const, entries: 8, spent: 1290, joined: '2026-06-01' },
  { id: '6', name: 'Laura Burns', email: 'laura@example.com', role: 'user' as const, entries: 64, spent: 12800, joined: '2025-12-10' },
  { id: '7', name: 'Admin User', email: 'admin@vaultcompetitions.co.uk', role: 'admin' as const, entries: 0, spent: 0, joined: '2025-08-01' },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="animate-fade-in-up mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-1">Users</h1>
        <p className="text-muted font-medium">Manage registered users and their accounts.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: '3,842' },
          { label: 'New This Week', value: '156' },
          { label: 'Active Today', value: '284' },
          { label: 'Admin Users', value: '3' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xl font-black text-foreground">{stat.value}</p>
            <p className="text-xs text-muted font-semibold">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full sm:w-80 h-11 bg-card border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors text-sm font-medium"
        />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">User</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Role</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 hidden md:table-cell">Entries</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Total Spent</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 hidden md:table-cell">Joined</th>
                <th className="text-right text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-border/50 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-background text-sm font-black shrink-0">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-background border border-border text-muted'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted hidden md:table-cell font-medium">{user.entries}</td>
                  <td className="px-5 py-4 text-sm text-foreground hidden lg:table-cell font-bold">
                    £{(user.spent / 100).toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-xs text-muted hidden md:table-cell font-medium">
                    {new Date(user.joined).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-xs text-primary hover:text-primary-light font-bold transition-colors">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
