import { winners } from '@/lib/mock-data';

export default function WinnersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="animate-fade-in-up text-center mb-14">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
          Our Winners
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto font-medium">
          Real people winning real prizes. Meet some of our lucky winners from across the UK.
        </p>
      </div>

      <div className="animate-fade-in-up grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14" style={{ animationDelay: '100ms' }}>
        {[
          { value: '500+', label: 'Total Winners' },
          { value: '£2M+', label: 'Prizes Awarded' },
          { value: '48hrs', label: 'Avg Cash Payout' },
          { value: '100%', label: 'Prizes Claimed' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-5 text-center">
            <div className="text-2xl font-black text-primary mb-1">{stat.value}</div>
            <div className="text-xs text-muted font-semibold">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {winners.map((winner, i) => (
          <div
            key={winner.id}
            className="animate-fade-in-up bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors"
            style={{ animationDelay: `${(i + 2) * 100}ms` }}
          >
            <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-background text-3xl font-black">
                {winner.name[0]}
              </div>
            </div>

            <div className="p-6">
              <div className="mb-3">
                <h3 className="font-bold text-foreground text-lg">{winner.name}</h3>
                <p className="text-sm text-muted font-medium">{winner.location}</p>
              </div>

              <div className="bg-background rounded-xl p-4 mb-3">
                <p className="text-xs text-muted uppercase tracking-wider mb-1 font-semibold">Won</p>
                <p className="font-bold text-foreground">{winner.prize}</p>
                <p className="text-xs text-muted mt-1 font-medium">{winner.competitionTitle}</p>
              </div>

              <p className="text-xs text-muted font-medium">
                {new Date(winner.wonDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
