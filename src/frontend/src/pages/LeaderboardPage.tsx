import type { LeaderboardEntry } from "@/backend.d";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useGetLeaderboard } from "@/hooks/useQueries";
import type { Principal } from "@icp-sdk/core/principal";
import {
  ChevronRight,
  Loader2,
  Mail,
  Medal,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// ── Sample leaderboard data ───────────────────────────────────────────────────

const makePrincipal = (s: string): Principal =>
  ({ toString: () => s }) as unknown as Principal;

const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
  {
    user: makePrincipal("rmx6k-jaaaa-aaaaa-aaaaq-cai"),
    betsCount: BigInt(47),
    totalWon: BigInt(1_240_000_000_000),
    totalLost: BigInt(380_000_000_000),
    profit: BigInt(860_000_000_000),
  },
  {
    user: makePrincipal("2vxsx-fae"),
    betsCount: BigInt(63),
    totalWon: BigInt(980_000_000_000),
    totalLost: BigInt(290_000_000_000),
    profit: BigInt(690_000_000_000),
  },
  {
    user: makePrincipal("qaa6y-5yaaa-aaaaa-aaafa-cai"),
    betsCount: BigInt(31),
    totalWon: BigInt(740_000_000_000),
    totalLost: BigInt(210_000_000_000),
    profit: BigInt(530_000_000_000),
  },
  {
    user: makePrincipal("aaaaa-aa"),
    betsCount: BigInt(28),
    totalWon: BigInt(610_000_000_000),
    totalLost: BigInt(260_000_000_000),
    profit: BigInt(350_000_000_000),
  },
  {
    user: makePrincipal("rdmx6-jaaaa-aaaaa-aaaaq-cai"),
    betsCount: BigInt(55),
    totalWon: BigInt(820_000_000_000),
    totalLost: BigInt(490_000_000_000),
    profit: BigInt(330_000_000_000),
  },
  {
    user: makePrincipal("7hfb6-uiaaa-aaaal-qjkia-cai"),
    betsCount: BigInt(19),
    totalWon: BigInt(440_000_000_000),
    totalLost: BigInt(130_000_000_000),
    profit: BigInt(310_000_000_000),
  },
  {
    user: makePrincipal("3xwpq-ziaaa-aaaah-qcn4a-cai"),
    betsCount: BigInt(42),
    totalWon: BigInt(690_000_000_000),
    totalLost: BigInt(440_000_000_000),
    profit: BigInt(250_000_000_000),
  },
  {
    user: makePrincipal("tqtu6-byaaa-aaaab-qheza-cai"),
    betsCount: BigInt(23),
    totalWon: BigInt(370_000_000_000),
    totalLost: BigInt(150_000_000_000),
    profit: BigInt(220_000_000_000),
  },
  {
    user: makePrincipal("rrkah-fqaaa-aaaaa-aaaaq-cai"),
    betsCount: BigInt(34),
    totalWon: BigInt(490_000_000_000),
    totalLost: BigInt(310_000_000_000),
    profit: BigInt(180_000_000_000),
  },
  {
    user: makePrincipal("jz6kq-7iaaa-aaaab-qajza-cai"),
    betsCount: BigInt(16),
    totalWon: BigInt(280_000_000_000),
    totalLost: BigInt(120_000_000_000),
    profit: BigInt(160_000_000_000),
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatICP(amount: bigint): string {
  const whole = Number(amount / BigInt(100_000_000));
  if (whole >= 1_000_000) return `${(whole / 1_000_000).toFixed(2)}M`;
  if (whole >= 1_000) return `${(whole / 1_000).toFixed(1)}K`;
  return whole.toLocaleString();
}

function truncatePrincipal(p: string): string {
  if (p.length <= 16) return p;
  return `${p.slice(0, 10)}…${p.slice(-6)}`;
}

function getRankStyle(rank: number) {
  if (rank === 1)
    return {
      badge: "leaderboard-rank-gold",
      row: "leaderboard-row-gold",
      icon: "🥇",
    };
  if (rank === 2)
    return {
      badge: "leaderboard-rank-silver",
      row: "leaderboard-row-silver",
      icon: "🥈",
    };
  if (rank === 3)
    return {
      badge: "leaderboard-rank-bronze",
      row: "leaderboard-row-bronze",
      icon: "🥉",
    };
  return { badge: "leaderboard-rank-default", row: "", icon: "" };
}

// ── NavBar ────────────────────────────────────────────────────────────────────

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const { identity } = useInternetIdentity();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "identity-nav-scrolled" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="identity-logo-mark">
              <div className="identity-logo-inner" />
            </div>
            <a href="/" className="identity-nav-title">
              ICP Protocol
            </a>
            <span className="identity-beta-badge">Leaderboard</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: "Identity", href: "/" },
              { label: "Markets", href: "/markets" },
              { label: "Leaderboard", href: "/leaderboard" },
              { label: "Wallet", href: "/wallet" },
              { label: "Ecosystem", href: "/ecosystem" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`identity-nav-link ${link.href === "/leaderboard" ? "markets-nav-active" : ""}`}
              >
                {link.label}
              </a>
            ))}
            {identity && (
              <div className="markets-user-pill ml-2">
                <div className="markets-user-dot" />
                <span className="font-mono text-xs">
                  {identity.getPrincipal().toString().slice(0, 8)}…
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// ── Top 3 Podium ──────────────────────────────────────────────────────────────

function PodiumCard({
  entry,
  rank,
}: {
  entry: LeaderboardEntry;
  rank: number;
}) {
  const { badge } = getRankStyle(rank);
  const medals = ["🥇", "🥈", "🥉"];
  const heights = ["h-36", "h-28", "h-24"];
  const order = [2, 1, 3]; // Silver, Gold, Bronze visual order

  return (
    <div
      className={`leaderboard-podium-card ${badge}`}
      style={{ order: order[rank - 1] }}
    >
      <div className={`leaderboard-podium-stand ${heights[rank - 1]}`}>
        <span className="leaderboard-podium-medal">{medals[rank - 1]}</span>
        <span className="leaderboard-podium-rank">#{rank}</span>
      </div>
      <div className="leaderboard-podium-info">
        <div className="leaderboard-podium-principal font-mono">
          {truncatePrincipal(entry.user.toString())}
        </div>
        <div className="leaderboard-podium-profit">
          +{formatICP(entry.profit)} ICP
        </div>
        <div className="leaderboard-podium-bets">
          {entry.betsCount.toString()} bets
        </div>
      </div>
    </div>
  );
}

// ── Leaderboard Page ──────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const { identity } = useInternetIdentity();
  const {
    data: backendLeaderboard,
    isLoading,
    refetch,
    isFetching,
  } = useGetLeaderboard();

  const leaderboard = useMemo(() => {
    if (backendLeaderboard && backendLeaderboard.length > 0)
      return [...backendLeaderboard].sort((a, b) =>
        b.profit > a.profit ? 1 : -1,
      );
    return SAMPLE_LEADERBOARD;
  }, [backendLeaderboard]);

  const myPrincipal = identity?.getPrincipal().toString();
  const myRank = myPrincipal
    ? leaderboard.findIndex((e) => e.user.toString() === myPrincipal) + 1
    : -1;
  const myEntry = myRank > 0 ? leaderboard[myRank - 1] : null;

  const top3 = leaderboard.slice(0, 3);

  const totalBets = leaderboard.reduce(
    (acc, e) => acc + Number(e.betsCount),
    0,
  );

  return (
    <div className="identity-page">
      <NavBar />

      {/* ── Hero ── */}
      <section className="markets-hero relative overflow-hidden">
        <div className="identity-grid-overlay" />
        <div className="markets-hero-orb-1" />
        <div className="markets-hero-orb-2" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-16">
          <div className="markets-hero-eyebrow mb-6 animate-fade-in-down inline-flex">
            <Trophy className="w-3.5 h-3.5" />
            Top Predictors · ICP Protocol
          </div>

          <h1 className="markets-hero-headline animate-fade-in-up">
            Leaderboard
            <br />
            <span className="markets-hero-accent">Top Predictors</span>
          </h1>

          <p
            className="markets-hero-sub mt-5 max-w-xl animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            See who's crushing it in the prediction markets. Rankings by total
            profit across all resolved markets.
          </p>

          <div
            className="flex flex-wrap gap-6 mt-10 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="markets-stat">
              <div className="markets-stat-value">{leaderboard.length}</div>
              <div className="markets-stat-label">Active Traders</div>
            </div>
            <div className="markets-stat-divider" />
            <div className="markets-stat">
              <div className="markets-stat-value">
                {totalBets.toLocaleString()}
              </div>
              <div className="markets-stat-label">Total Bets Placed</div>
            </div>
            {myRank > 0 && (
              <>
                <div className="markets-stat-divider" />
                <div className="markets-stat">
                  <div className="markets-stat-value">#{myRank}</div>
                  <div className="markets-stat-label">Your Rank</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="identity-section relative">
        <div className="identity-section-divider" />
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          {/* My rank card (if logged in and on leaderboard) */}
          {myEntry && myRank > 0 && (
            <div className="leaderboard-my-card mb-8 animate-fade-in-up">
              <div className="leaderboard-my-card-line" />
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="leaderboard-my-rank">#{myRank}</div>
                  <div>
                    <div className="leaderboard-my-label">Your Ranking</div>
                    <div className="leaderboard-my-principal font-mono">
                      {truncatePrincipal(myPrincipal!)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="leaderboard-my-stat-value leaderboard-profit-positive">
                      +{formatICP(myEntry.profit)} ICP
                    </div>
                    <div className="leaderboard-my-stat-label">Profit</div>
                  </div>
                  <div className="text-center">
                    <div className="leaderboard-my-stat-value">
                      {myEntry.betsCount.toString()}
                    </div>
                    <div className="leaderboard-my-stat-label">Bets</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Header + Refresh */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 market-prob-icon" />
              <span className="identity-section-title text-lg">Rankings</span>
            </div>
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="wallet-refresh-btn"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="leaderboard-row-skeleton"
                  style={{ opacity: 1 - i * 0.15 }}
                />
              ))}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="markets-empty">
              <Trophy className="w-10 h-10 markets-empty-icon" />
              <h3 className="markets-empty-title">No rankings yet</h3>
              <p className="markets-empty-sub">
                Start betting on markets to appear on the leaderboard!
              </p>
              <a href="/markets" className="markets-create-btn mt-4">
                <TrendingUp className="w-4 h-4" />
                Browse Markets
              </a>
            </div>
          ) : (
            <>
              {/* Podium */}
              {top3.length >= 3 && (
                <div className="leaderboard-podium mb-10">
                  {top3.map((entry, i) => (
                    <PodiumCard
                      key={entry.user.toString()}
                      entry={entry}
                      rank={i + 1}
                    />
                  ))}
                </div>
              )}

              {/* Table */}
              <div className="leaderboard-table">
                <div className="leaderboard-table-header">
                  <div className="leaderboard-col-rank">Rank</div>
                  <div className="leaderboard-col-trader">Trader</div>
                  <div className="leaderboard-col-num text-right">Profit</div>
                  <div className="leaderboard-col-num text-right hidden sm:block">
                    Won
                  </div>
                  <div className="leaderboard-col-num text-right hidden md:block">
                    Lost
                  </div>
                  <div className="leaderboard-col-num text-right">Bets</div>
                </div>

                {leaderboard.map((entry, i) => {
                  const rank = i + 1;
                  const { badge, row } = getRankStyle(rank);
                  const isMe = entry.user.toString() === myPrincipal;
                  const isPositive = entry.profit >= BigInt(0);

                  return (
                    <div
                      key={entry.user.toString()}
                      className={`leaderboard-row ${row} ${isMe ? "leaderboard-row-me" : ""} animate-fade-in-up`}
                      style={{ animationDelay: `${Math.min(i * 0.04, 0.5)}s` }}
                    >
                      <div className="leaderboard-col-rank">
                        <span className={`leaderboard-rank-badge ${badge}`}>
                          {rank <= 3
                            ? ["🥇", "🥈", "🥉"][rank - 1]
                            : `#${rank}`}
                        </span>
                      </div>
                      <div className="leaderboard-col-trader">
                        <div className="font-mono leaderboard-principal">
                          {truncatePrincipal(entry.user.toString())}
                        </div>
                        {isMe && (
                          <span className="leaderboard-me-badge">You</span>
                        )}
                      </div>
                      <div className="leaderboard-col-num text-right">
                        <span
                          className={`leaderboard-profit ${isPositive ? "leaderboard-profit-positive" : "leaderboard-profit-negative"}`}
                        >
                          {isPositive ? "+" : "-"}
                          {formatICP(isPositive ? entry.profit : -entry.profit)}{" "}
                          ICP
                        </span>
                      </div>
                      <div className="leaderboard-col-num text-right hidden sm:block leaderboard-won">
                        {formatICP(entry.totalWon)} ICP
                      </div>
                      <div className="leaderboard-col-num text-right hidden md:block leaderboard-lost">
                        {formatICP(entry.totalLost)} ICP
                      </div>
                      <div className="leaderboard-col-num text-right leaderboard-bets-count">
                        {entry.betsCount.toString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="identity-footer">
        <div className="identity-footer-top-line" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="identity-logo-mark identity-logo-mark-sm">
                  <div className="identity-logo-inner" />
                </div>
                <span className="identity-footer-brand">ICP Protocol</span>
              </div>
              <p className="identity-footer-tagline">
                Prediction Markets on the Internet Computer
              </p>
              <p className="identity-footer-disclaimer mt-3">
                Independent community initiative.
              </p>
            </div>
            <div>
              <h4 className="identity-footer-heading mb-4">
                <Trophy className="w-4 h-4" />
                Quick Links
              </h4>
              <div className="space-y-2">
                {[
                  { label: "All Markets", href: "/markets" },
                  { label: "Leaderboard", href: "/leaderboard" },
                  { label: "My Wallet", href: "/wallet" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="identity-footer-link block"
                  >
                    <ChevronRight className="w-3 h-3 inline" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="identity-footer-heading mb-4">
                <Users className="w-4 h-4" />
                Contact
              </h4>
              <a
                href="mailto:contact@example.com"
                className="identity-footer-email mt-3 inline-flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                contact@example.com
              </a>
            </div>
          </div>
          <div className="identity-footer-bottom">
            <p className="identity-footer-copyright">
              © {new Date().getFullYear()} Community Initiative. Open Source.
            </p>
            <p className="identity-footer-caffeine">
              Built with <span className="identity-footer-heart">♥</span> using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="identity-footer-caffeine-link"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
