import Link from 'next/link';

const mockUser = {
  name: 'John Smith',
  email: 'john@example.com',
  memberSince: '2026-01-15',
  totalEntries: 47,
  totalSpent: 12500,
  wins: 1,
};

const mockRecentTickets = [
  { id: '1', competition: 'BMW M4 Competition', tickets: 5, date: '2026-06-20', status: 'active' },
  { id: '2', competition: '£25,000 Cash Prize', tickets: 10, date: '2026-06-18', status: 'active' },
  { id: '3', competition: 'MacBook Pro M4 Bundle', tickets: 3, date: '2026-06-15', status: 'active' },
  { id: '4', competition: '£10,000 Cash Quickie', tickets: 8, date: '2026-06-10', status: 'drawn' },
];

export default function AccountPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="animate-fade-in-up mb-10">
        <h1 className="text-3xl font-black text-foreground mb-2">My Account</h1>
        <p className="text-muted font-medium">Welcome back, {mockUser.name}</p>
      </div>

      <div className="animate-fade-in-up grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10" style={{ animationDelay: '100ms' }}>
        {[
          { label: 'Total Entries', value: mockUser.totalEntries.toString() },
          { label: 'Competitions Won', value: mockUser.wins.toString() },
          { label: 'Total Spent', value: `£${(mockUser.totalSpent / 100).toFixed(2)}` },
          { label: 'Member Since', value: new Date(mockUser.memberSince).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
            <p className="text-2xl font-black text-foreground">{stat.value}</p>
            <p className="text-xs text-muted mt-1 font-semibold">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="animate-fade-in-up lg:col-span-2" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Recent Entries</h2>
            <Link href="/account/tickets" className="text-sm text-primary hover:text-primary-light font-bold transition-colors">
              View All
            </Link>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Competition</th>
                    <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Tickets</th>
                    <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Date</th>
                    <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRecentTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-border/50 last:border-0 hover:bg-white/[0.02]">
                      <td className="px-5 py-4 text-sm text-foreground font-semibold">{ticket.competition}</td>
                      <td className="px-5 py-4 text-sm text-muted font-medium">{ticket.tickets}</td>
                      <td className="px-5 py-4 text-sm text-muted font-medium">
                        {new Date(ticket.date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          ticket.status === 'active'
                            ? 'bg-success/10 text-success'
                            : 'bg-muted/10 text-muted'
                        }`}>
                          {ticket.status === 'active' ? 'Live' : 'Drawn'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h2 className="text-xl font-bold text-foreground mb-4">Profile</h2>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-4 pb-5 border-b border-border">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-background text-xl font-black">
                {mockUser.name[0]}
              </div>
              <div>
                <p className="font-bold text-foreground">{mockUser.name}</p>
                <p className="text-sm text-muted font-medium">{mockUser.email}</p>
              </div>
            </div>
            <button className="w-full py-2.5 bg-background border border-border text-foreground text-sm font-bold rounded-xl hover:border-primary/50 transition-colors">
              Edit Profile
            </button>
            <button className="w-full py-2.5 bg-background border border-border text-foreground text-sm font-bold rounded-xl hover:border-primary/50 transition-colors">
              Change Password
            </button>
            <button className="w-full py-2.5 bg-danger/10 border border-danger/20 text-danger text-sm font-bold rounded-xl hover:bg-danger/20 transition-colors">
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
