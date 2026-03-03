import type { Bet, Market } from "@/backend.d";
import { BetPosition, MarketStatus } from "@/backend.d";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useClaimReward,
  useGetCCBalance,
  useGetMarket,
  useGetMarketBets,
  useGetOrCreateBalance,
  useGetUserBets,
  useIsCallerAdmin,
  usePlaceBet,
  useResolveMarket,
} from "@/hooks/useQueries";
import { useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart2,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock,
  Coins,
  Copy,
  ExternalLink,
  Loader2,
  LogIn,
  Shield,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// ── Sample fallback market (for IDs 1-8) ─────────────────────────────────────

import type { Principal } from "@icp-sdk/core/principal";

const makePrincipal = (s: string): Principal =>
  ({ toString: () => s }) as unknown as Principal;

const SAMPLE_MARKETS_MAP: Record<string, Market> = {
  "1": {
    id: BigInt(1),
    title: "Will Bitcoin reach $150,000 by end of 2025?",
    description:
      "Bitcoin has been on a strong upward trajectory. Will it hit the $150k milestone before December 31, 2025? Resolution based on CoinGecko closing price on Dec 31, 2025.",
    category: "Crypto" as Market["category"],
    status: MarketStatus.active,
    imageUrl: "",
    totalYesPool: BigInt(240000000000),
    totalNoPool: BigInt(160000000000),
    deadline: BigInt((new Date("2025-12-31").getTime() + 86400000) * 1_000_000),
    createdAt: BigInt(Date.now() * 1_000_000),
    creator: makePrincipal("aaaaa-aa"),
  },
  "2": {
    id: BigInt(2),
    title: "Will ICP hit top 10 market cap in 2025?",
    description:
      "Internet Computer Protocol (ICP) is building a decentralized cloud. Can it break into the crypto top 10 by market cap before year end?",
    category: "Crypto" as Market["category"],
    status: MarketStatus.active,
    imageUrl: "",
    totalYesPool: BigInt(180000000000),
    totalNoPool: BigInt(320000000000),
    deadline: BigInt((new Date("2025-12-31").getTime() + 86400000) * 1_000_000),
    createdAt: BigInt(Date.now() * 1_000_000),
    creator: makePrincipal("aaaaa-aa"),
  },
  "3": {
    id: BigInt(3),
    title: "Will Ethereum merge to PoS v2 in 2025?",
    description:
      "Ethereum's roadmap includes significant PoS upgrades. Will the next major milestone ship this year?",
    category: "Crypto" as Market["category"],
    status: MarketStatus.active,
    imageUrl: "",
    totalYesPool: BigInt(310000000000),
    totalNoPool: BigInt(90000000000),
    deadline: BigInt((new Date("2025-09-30").getTime() + 86400000) * 1_000_000),
    createdAt: BigInt(Date.now() * 1_000_000),
    creator: makePrincipal("aaaaa-aa"),
  },
  "4": {
    id: BigInt(4),
    title: "Will Argentina win FIFA World Cup 2026?",
    description:
      "Argentina, as reigning champions, enters the 2026 World Cup as one of the top favorites. Will they defend their title?",
    category: "Sports" as Market["category"],
    status: MarketStatus.active,
    imageUrl: "",
    totalYesPool: BigInt(520000000000),
    totalNoPool: BigInt(480000000000),
    deadline: BigInt((new Date("2026-07-20").getTime() + 86400000) * 1_000_000),
    createdAt: BigInt(Date.now() * 1_000_000),
    creator: makePrincipal("aaaaa-aa"),
  },
  "5": {
    id: BigInt(5),
    title: "Will there be a US recession in 2025?",
    description:
      "Economic indicators show mixed signals. Will the US officially enter a recession (two consecutive quarters of negative GDP) in 2025?",
    category: "Politics" as Market["category"],
    status: MarketStatus.active,
    imageUrl: "",
    totalYesPool: BigInt(290000000000),
    totalNoPool: BigInt(410000000000),
    deadline: BigInt((new Date("2025-12-31").getTime() + 86400000) * 1_000_000),
    createdAt: BigInt(Date.now() * 1_000_000),
    creator: makePrincipal("aaaaa-aa"),
  },
  "6": {
    id: BigInt(6),
    title: "Will Apple release AR glasses in 2025?",
    description:
      "Following Apple Vision Pro, rumors suggest standalone AR glasses are in development. Will they launch in 2025?",
    category: "Technology" as Market["category"],
    status: MarketStatus.active,
    imageUrl: "",
    totalYesPool: BigInt(140000000000),
    totalNoPool: BigInt(260000000000),
    deadline: BigInt((new Date("2025-12-31").getTime() + 86400000) * 1_000_000),
    createdAt: BigInt(Date.now() * 1_000_000),
    creator: makePrincipal("aaaaa-aa"),
  },
  "7": {
    id: BigInt(7),
    title: "Will a new AI model surpass GPT-5?",
    description:
      "The AI race is heating up. Will any model from Google, Anthropic, Meta, or a newcomer outbench GPT-5 before end of 2025?",
    category: "Technology" as Market["category"],
    status: MarketStatus.active,
    imageUrl: "",
    totalYesPool: BigInt(680000000000),
    totalNoPool: BigInt(320000000000),
    deadline: BigInt((new Date("2025-12-31").getTime() + 86400000) * 1_000_000),
    createdAt: BigInt(Date.now() * 1_000_000),
    creator: makePrincipal("aaaaa-aa"),
  },
  "8": {
    id: BigInt(8),
    title: "Will Taylor Swift win Grammy Album of Year 2026?",
    description:
      "Taylor Swift's latest era has dominated charts globally. Will she add another Grammy Album of the Year win?",
    category: "Entertainment" as Market["category"],
    status: MarketStatus.active,
    imageUrl: "",
    totalYesPool: BigInt(370000000000),
    totalNoPool: BigInt(230000000000),
    deadline: BigInt((new Date("2026-02-28").getTime() + 86400000) * 1_000_000),
    createdAt: BigInt(Date.now() * 1_000_000),
    creator: makePrincipal("aaaaa-aa"),
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCC(amount: bigint): string {
  const whole = amount / BigInt(100_000_000);
  const frac = amount % BigInt(100_000_000);
  const fracStr = frac.toString().padStart(8, "0").slice(0, 2);
  return `${new Intl.NumberFormat("en-US").format(Number(whole))}.${fracStr}`;
}

function formatPool(amount: bigint): string {
  const whole = Number(amount / BigInt(100_000_000));
  if (whole >= 1_000_000) return `${(whole / 1_000_000).toFixed(2)}M`;
  if (whole >= 1_000) return `${(whole / 1_000).toFixed(1)}K`;
  return whole.toLocaleString();
}

function calcProbability(yesPool: bigint, noPool: bigint): number {
  const total = yesPool + noPool;
  if (total === BigInt(0)) return 50;
  return Math.round((Number(yesPool) / Number(total)) * 100);
}

function formatDeadline(deadline: bigint): string {
  const ms = Number(deadline / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getDeadlineCountdown(deadline: bigint): string {
  const ms = Number(deadline / BigInt(1_000_000));
  const now = Date.now();
  const diff = ms - now;
  if (diff <= 0) return "Market closed";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h remaining`;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins}m remaining`;
}

function calcPayout(
  betAmount: bigint,
  position: BetPosition,
  yesPool: bigint,
  noPool: bigint,
): string {
  const total = yesPool + noPool + betAmount;
  const sidePool =
    position === BetPosition.yes ? yesPool + betAmount : noPool + betAmount;
  if (sidePool === BigInt(0)) return "0";
  const payout = (betAmount * total) / sidePool;
  return formatPool(payout);
}

function truncatePrincipal(p: string): string {
  if (p.length <= 16) return p;
  return `${p.slice(0, 8)}…${p.slice(-5)}`;
}

function getCategoryColor(category: string) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    Crypto: {
      bg: "oklch(0.52 0.16 245 / 0.12)",
      text: "oklch(0.70 0.18 245)",
      border: "oklch(0.52 0.16 245 / 0.3)",
    },
    Sports: {
      bg: "oklch(0.62 0.2 145 / 0.12)",
      text: "oklch(0.70 0.2 145)",
      border: "oklch(0.62 0.2 145 / 0.3)",
    },
    Politics: {
      bg: "oklch(0.76 0.12 80 / 0.12)",
      text: "oklch(0.80 0.14 80)",
      border: "oklch(0.76 0.12 80 / 0.3)",
    },
    Technology: {
      bg: "oklch(0.62 0.2 295 / 0.12)",
      text: "oklch(0.68 0.2 295)",
      border: "oklch(0.62 0.2 295 / 0.3)",
    },
    Entertainment: {
      bg: "oklch(0.68 0.2 25 / 0.12)",
      text: "oklch(0.72 0.2 25)",
      border: "oklch(0.68 0.2 25 / 0.3)",
    },
  };
  return (
    map[category] || {
      bg: "oklch(0.28 0.04 255 / 0.5)",
      text: "oklch(0.62 0.02 255)",
      border: "oklch(0.28 0.04 255)",
    }
  );
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
            <span className="identity-beta-badge">Markets</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: "Identity", href: "/" },
              { label: "Markets", href: "/markets" },
              { label: "Leaderboard", href: "/leaderboard" },
              { label: "Wallet", href: "/wallet" },
            ].map((link) => (
              <a key={link.href} href={link.href} className="identity-nav-link">
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

// ── BetForm ───────────────────────────────────────────────────────────────────

function BetForm({ market }: { market: Market }) {
  const [position, setPosition] = useState<BetPosition>(BetPosition.yes);
  const [amount, setAmount] = useState("100");
  const placeBet = usePlaceBet();
  const { data: balance } = useGetOrCreateBalance(true);
  const { identity } = useInternetIdentity();

  const amountBigInt = useMemo(() => {
    const n = Number.parseFloat(amount);
    if (Number.isNaN(n) || n < 10) return BigInt(0);
    return BigInt(Math.round(n * 100_000_000));
  }, [amount]);

  const estimatedPayout = useMemo(() => {
    if (amountBigInt === BigInt(0)) return "—";
    return `${calcPayout(
      amountBigInt,
      position,
      market.totalYesPool,
      market.totalNoPool,
    )} ICP`;
  }, [amountBigInt, position, market]);

  const balanceICP = balance ? Number(balance / BigInt(100_000_000)) : 0;
  const hasEnough = balance !== undefined && balance >= amountBigInt;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;
    const n = Number.parseFloat(amount);
    if (Number.isNaN(n) || n < 10) {
      toast.error("Minimum bet is 10 ICP");
      return;
    }
    if (!hasEnough) {
      toast.error("Insufficient ICP balance");
      return;
    }
    try {
      await placeBet.mutateAsync({
        marketId: market.id,
        position,
        amount: amountBigInt,
      });
      toast.success(
        `Bet placed! ${n} ICP on ${position === BetPosition.yes ? "YES" : "NO"}`,
      );
      setAmount("100");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to place bet";
      toast.error("Bet failed", { description: msg });
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      {/* Position toggle */}
      <div>
        <div className="markets-form-label mb-2">Your Prediction</div>
        <div className="market-bet-toggle">
          <button
            type="button"
            onClick={() => setPosition(BetPosition.yes)}
            className={`market-bet-toggle-btn ${position === BetPosition.yes ? "market-bet-yes-active" : ""}`}
          >
            <TrendingUp className="w-4 h-4" />
            YES
          </button>
          <button
            type="button"
            onClick={() => setPosition(BetPosition.no)}
            className={`market-bet-toggle-btn ${position === BetPosition.no ? "market-bet-no-active" : ""}`}
          >
            <TrendingDown className="w-4 h-4" />
            NO
          </button>
        </div>
      </div>

      {/* Amount */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="bet-amount" className="markets-form-label">
            Amount (ICP)
          </label>
          <span className="markets-form-optional">
            Balance: {balanceICP.toLocaleString()} ICP
          </span>
        </div>
        <div className="relative">
          <input
            id="bet-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="10"
            step="10"
            className={`identity-input pr-16 ${!hasEnough && amountBigInt > BigInt(0) ? "identity-input-error" : ""}`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 markets-form-optional">
            ICP
          </span>
        </div>
        {!hasEnough && amountBigInt > BigInt(0) && (
          <p className="identity-field-error mt-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Insufficient balance
          </p>
        )}
        <div className="flex gap-2 mt-2">
          {[100, 500, 1000, 5000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(String(preset))}
              className="market-bet-preset"
            >
              {preset >= 1000 ? `${preset / 1000}K` : preset}
            </button>
          ))}
        </div>
      </div>

      {/* Estimated payout */}
      <div className="market-bet-payout">
        <div className="flex items-center justify-between">
          <span className="market-bet-payout-label">Estimated Payout</span>
          <span className="market-bet-payout-value">{estimatedPayout}</span>
        </div>
        <p className="market-bet-payout-note mt-1">
          If {position === BetPosition.yes ? "YES" : "NO"} wins, you receive
          your share of the total pool.
        </p>
      </div>

      <button
        type="submit"
        disabled={
          placeBet.isPending || amountBigInt === BigInt(0) || !hasEnough
        }
        className={`w-full markets-bet-submit-btn ${position === BetPosition.yes ? "markets-bet-yes-btn" : "markets-bet-no-btn"}`}
      >
        {placeBet.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Placing Bet...
          </>
        ) : (
          <>
            {position === BetPosition.yes ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            Bet {amount || "0"} ICP on{" "}
            {position === BetPosition.yes ? "YES" : "NO"}
          </>
        )}
      </button>
    </form>
  );
}

// ── Bet Row ───────────────────────────────────────────────────────────────────

function BetRow({ bet, index }: { bet: Bet; index: number }) {
  const isYes = bet.position === BetPosition.yes;
  const ts = Number(bet.timestamp / BigInt(1_000_000));
  const date = new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="market-bet-row animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index * 0.04, 0.4)}s` }}
    >
      <div className="flex items-center gap-3">
        <div
          className={`market-bet-position-icon ${isYes ? "market-bet-position-yes" : "market-bet-position-no"}`}
        >
          {isYes ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
        </div>
        <div>
          <div
            className={`market-bet-position-label ${isYes ? "market-bet-yes-text" : "market-bet-no-text"}`}
          >
            {isYes ? "YES" : "NO"}
          </div>
          <div className="market-bet-row-addr font-mono">
            {truncatePrincipal(bet.bettor.toString())}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="market-bet-row-amount">{formatCC(bet.amount)} ICP</div>
        <div className="market-bet-row-time">{date}</div>
      </div>
    </div>
  );
}

// ── Claim Row ─────────────────────────────────────────────────────────────────

function ClaimableRow({
  bet,
  resolvedOutcome,
}: {
  bet: Bet;
  resolvedOutcome: boolean;
}) {
  const claimReward = useClaimReward();
  const isWinner =
    (bet.position === BetPosition.yes && resolvedOutcome) ||
    (bet.position === BetPosition.no && !resolvedOutcome);

  if (!isWinner || bet.claimed) return null;

  const handleClaim = async () => {
    try {
      const reward = await claimReward.mutateAsync(bet.id);
      toast.success(`Claimed ${formatCC(reward)} ICP!`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to claim";
      toast.error("Claim failed", { description: msg });
    }
  };

  return (
    <div className="market-claim-row">
      <div className="flex items-center gap-2">
        <Trophy className="w-4 h-4 market-claim-icon" />
        <span className="market-claim-label">
          Bet #{bet.id.toString()} — {formatCC(bet.amount)} ICP on{" "}
          {bet.position === BetPosition.yes ? "YES" : "NO"}
        </span>
      </div>
      <button
        type="button"
        onClick={() => void handleClaim()}
        disabled={claimReward.isPending}
        className="market-claim-btn"
      >
        {claimReward.isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Trophy className="w-3.5 h-3.5" />
        )}
        Claim Reward
      </button>
    </div>
  );
}

// ── Unhedged Bet Panel ────────────────────────────────────────────────────────

const UNHEDGED_API_URL = "https://unhedged.gg/api/v1/bets";
const UNHEDGED_TOKEN = "ak_MGZbA18VEeXakyPlrlcmPZgjiGNbnfuYBXTjZIBGbM7vqKaf";
const MASKED_TOKEN = "ak_MGZb...vqKaf";

function UnhedgedBetPanel({ defaultMarketId }: { defaultMarketId: string }) {
  const [marketIdInput, setMarketIdInput] = useState(defaultMarketId);
  const [outcome, setOutcome] = useState<0 | 1>(0);
  const [amount, setAmount] = useState(100);
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const [apiRefOpen, setApiRefOpen] = useState(false);

  const curlCommand = `curl -X POST ${UNHEDGED_API_URL} \\
  -H "Authorization: Bearer ${UNHEDGED_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{"marketId":"${marketIdInput || "..."}","outcomeIndex":${outcome},"amount":${amount}}'`;

  const handleCopyCurl = async () => {
    try {
      await navigator.clipboard.writeText(curlCommand);
      toast.success("Curl command copied!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketIdInput.trim()) {
      toast.error("Market ID is required");
      return;
    }
    if (amount < 1) {
      toast.error("Amount must be at least 1");
      return;
    }
    setIsPending(true);
    setResult(null);
    try {
      const res = await fetch(UNHEDGED_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${UNHEDGED_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marketId: marketIdInput.trim(),
          outcomeIndex: outcome,
          amount,
        }),
      });
      if (res.ok) {
        setResult({
          ok: true,
          message: "Bet placed successfully on Unhedged!",
        });
        toast.success("Unhedged bet placed!");
      } else {
        const errBody = await res.text().catch(() => "Unknown error");
        setResult({
          ok: false,
          message: `API error ${res.status}: ${errBody}`,
        });
        toast.error("Bet failed", { description: `Status ${res.status}` });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error";
      setResult({ ok: false, message: msg });
      toast.error("Bet failed", { description: msg });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="unhedged-panel">
      {/* Amber accent line */}
      <div className="unhedged-panel-line" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="unhedged-icon-wrap">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <span className="unhedged-panel-title">Unhedged External Bet</span>
        </div>
        <a
          href="https://unhedged.gg"
          target="_blank"
          rel="noopener noreferrer"
          className="unhedged-badge"
        >
          via unhedged.gg
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        {/* Market ID */}
        <div>
          <label htmlFor="unhedged-market-id" className="unhedged-form-label">
            Market ID
          </label>
          <input
            id="unhedged-market-id"
            type="text"
            value={marketIdInput}
            onChange={(e) => setMarketIdInput(e.target.value)}
            placeholder="Enter Unhedged market ID..."
            className="identity-input mt-1.5 unhedged-input"
            data-ocid="unhedged.market_id.input"
          />
        </div>

        {/* Outcome toggle */}
        <div>
          <div className="unhedged-form-label mb-2">Outcome</div>
          <div className="unhedged-outcome-toggle">
            <button
              type="button"
              onClick={() => setOutcome(0)}
              className={`unhedged-outcome-btn ${outcome === 0 ? "unhedged-outcome-yes-active" : ""}`}
              data-ocid="unhedged.outcome_yes.button"
            >
              <TrendingUp className="w-4 h-4" />
              YES
            </button>
            <button
              type="button"
              onClick={() => setOutcome(1)}
              className={`unhedged-outcome-btn ${outcome === 1 ? "unhedged-outcome-no-active" : ""}`}
              data-ocid="unhedged.outcome_no.button"
            >
              <TrendingDown className="w-4 h-4" />
              NO
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="unhedged-amount" className="unhedged-form-label">
            Amount
          </label>
          <div className="relative mt-1.5">
            <input
              id="unhedged-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
              min={1}
              className="identity-input pr-16 unhedged-input"
              data-ocid="unhedged.amount.input"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              UNITS
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending || !marketIdInput.trim()}
          className="unhedged-submit-btn w-full"
          data-ocid="unhedged.submit_button"
        >
          {isPending ? (
            <>
              <Loader2
                className="w-4 h-4 animate-spin"
                data-ocid="unhedged.loading_state"
              />
              Placing Bet...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Place Bet on Unhedged
            </>
          )}
        </button>
      </form>

      {/* Result states */}
      {result?.ok && (
        <div
          className="unhedged-result-success"
          data-ocid="unhedged.success_state"
        >
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{result.message}</span>
        </div>
      )}
      {result && !result.ok && (
        <div className="unhedged-result-error" data-ocid="unhedged.error_state">
          <XCircle className="w-4 h-4 shrink-0" />
          <span>{result.message}</span>
        </div>
      )}

      {/* API Reference collapsible */}
      <div className="unhedged-api-ref-wrap mt-4">
        <button
          type="button"
          onClick={() => setApiRefOpen((v) => !v)}
          className="unhedged-api-ref-toggle"
          data-ocid="unhedged.api_reference.toggle"
        >
          <span>API Reference</span>
          {apiRefOpen ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
        {apiRefOpen && (
          <div className="unhedged-api-ref-body">
            <div className="flex items-center justify-between mb-2">
              <span className="unhedged-api-ref-label">Equivalent curl</span>
              <button
                type="button"
                onClick={() => void handleCopyCurl()}
                className="unhedged-copy-btn"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>
            <pre className="unhedged-api-ref-code">
              <code>{`curl -X POST ${UNHEDGED_API_URL} \\
  -H "Authorization: Bearer ${MASKED_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{"marketId":"${marketIdInput || "..."}","outcomeIndex":${outcome},"amount":${amount}}'`}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Market Detail Page ────────────────────────────────────────────────────────

export default function MarketDetailPage() {
  const { id } = useParams({ from: "/markets/$id" });
  const marketId = BigInt(id);

  const { identity } = useInternetIdentity();
  const { data: backendMarket, isLoading } = useGetMarket(marketId);
  const { data: bets } = useGetMarketBets(marketId);
  const { data: userBets } = useGetUserBets(!!identity);
  const { data: isAdmin } = useIsCallerAdmin(!!identity);
  const resolveMarket = useResolveMarket();

  // Use sample data as fallback
  const market: Market | null = useMemo(() => {
    if (backendMarket) return backendMarket;
    if (!isLoading) return SAMPLE_MARKETS_MAP[id] ?? null;
    return null;
  }, [backendMarket, isLoading, id]);

  const yesPct = market
    ? calcProbability(market.totalYesPool, market.totalNoPool)
    : 50;
  const noPct = 100 - yesPct;
  const catColors = market
    ? getCategoryColor(market.category.toString())
    : getCategoryColor("");

  const userWinningBets = useMemo(() => {
    if (!userBets || !market) return [];
    if (market.status !== MarketStatus.resolved) return [];
    return userBets.filter(
      (b) =>
        b.marketId === market.id &&
        !b.claimed &&
        ((b.position === BetPosition.yes && market.resolvedOutcome) ||
          (b.position === BetPosition.no && !market.resolvedOutcome)),
    );
  }, [userBets, market]);

  const handleResolve = async (outcome: boolean) => {
    if (!market) return;
    try {
      await resolveMarket.mutateAsync({ marketId: market.id, outcome });
      toast.success(`Market resolved: ${outcome ? "YES" : "NO"} wins!`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to resolve";
      toast.error("Resolve failed", { description: msg });
    }
  };

  if (isLoading && !SAMPLE_MARKETS_MAP[id]) {
    return (
      <div className="identity-page">
        <NavBar />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin market-loading-spinner" />
        </div>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="identity-page">
        <NavBar />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <XCircle className="w-12 h-12 text-destructive" />
          <h2 className="identity-section-title">Market Not Found</h2>
          <a href="/markets" className="markets-create-btn">
            <ChevronLeft className="w-4 h-4" />
            Back to Markets
          </a>
        </div>
      </div>
    );
  }

  const isActive = market.status === MarketStatus.active;
  const isResolved = market.status === MarketStatus.resolved;

  return (
    <div className="identity-page">
      <NavBar />

      {/* ── Hero / Title ── */}
      <section
        className="markets-hero relative overflow-hidden"
        style={{ minHeight: "auto", paddingBottom: "2rem" }}
      >
        <div className="identity-grid-overlay" />
        <div className="markets-hero-orb-1" style={{ opacity: 0.5 }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-8">
          <a
            href="/markets"
            className="inline-flex items-center gap-1.5 markets-back-link mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Markets
          </a>

          <div className="flex items-start gap-3 mb-4 flex-wrap">
            <span
              className="markets-category-badge"
              style={{
                background: catColors.bg,
                color: catColors.text,
                borderColor: catColors.border,
              }}
            >
              {market.category.toString()}
            </span>
            {isResolved && (
              <span
                className={`markets-status-badge ${market.resolvedOutcome ? "markets-status-yes" : "markets-status-no"}`}
              >
                {market.resolvedOutcome ? "✓ YES WON" : "✗ NO WON"}
              </span>
            )}
            {isActive && (
              <span className="markets-status-badge markets-status-active">
                ACTIVE
              </span>
            )}
            {market.status === MarketStatus.cancelled && (
              <span className="markets-status-badge markets-status-cancelled">
                CANCELLED
              </span>
            )}
          </div>

          <h1 className="markets-detail-title">{market.title}</h1>
          <p className="markets-detail-desc mt-3">{market.description}</p>

          <div className="flex flex-wrap gap-4 mt-5 text-sm">
            <div className="flex items-center gap-1.5 markets-pool-label">
              <Clock className="w-3.5 h-3.5" />
              {formatDeadline(market.deadline)} ·{" "}
              {getDeadlineCountdown(market.deadline)}
            </div>
            <div className="flex items-center gap-1.5 markets-pool-label">
              <Coins className="w-3.5 h-3.5" />
              Total Pool: {formatPool(market.totalYesPool + market.totalNoPool)}{" "}
              ICP
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="identity-section relative">
        <div className="identity-section-divider" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="market-detail-grid">
            {/* Left: Probability + Bets */}
            <div className="market-detail-left">
              {/* Probability Card */}
              <div className="market-prob-card">
                <div className="market-prob-card-line" />
                <div className="flex items-center gap-2 mb-5">
                  <BarChart2 className="w-4 h-4 market-prob-icon" />
                  <span className="markets-form-label">
                    Current Probability
                  </span>
                </div>

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="market-prob-pct market-prob-yes-pct">
                      {yesPct}%
                    </div>
                    <div className="market-prob-side-label market-prob-yes-text">
                      YES
                    </div>
                    <div className="market-prob-pool">
                      {formatPool(market.totalYesPool)} ICP
                    </div>
                  </div>
                  <div className="market-prob-vs">VS</div>
                  <div className="text-right">
                    <div className="market-prob-pct market-prob-no-pct">
                      {noPct}%
                    </div>
                    <div className="market-prob-side-label market-prob-no-text">
                      NO
                    </div>
                    <div className="market-prob-pool">
                      {formatPool(market.totalNoPool)} ICP
                    </div>
                  </div>
                </div>

                {/* Big prob bar */}
                <div className="markets-prob-bar-lg">
                  <div
                    className="markets-prob-fill-yes"
                    style={{ width: `${yesPct}%`, borderRadius: "8px 0 0 8px" }}
                  />
                  <div
                    className="markets-prob-fill-no"
                    style={{
                      width: `${noPct}%`,
                      borderRadius: noPct === 100 ? "8px" : "0 8px 8px 0",
                    }}
                  />
                </div>
              </div>

              {/* Recent Bets */}
              <div className="market-bets-card">
                <div className="market-bets-card-line" />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 market-prob-icon" />
                    <span className="markets-form-label">Recent Bets</span>
                  </div>
                  {bets && (
                    <span className="market-bets-count">
                      {bets.length} bet{bets.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {!bets || bets.length === 0 ? (
                  <div className="market-bets-empty">
                    <BarChart2 className="w-6 h-6 markets-empty-icon" />
                    <p className="market-bets-empty-text">
                      No bets placed yet. Be the first!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {[...bets]
                      .sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))
                      .slice(0, 20)
                      .map((bet, i) => (
                        <BetRow key={bet.id.toString()} bet={bet} index={i} />
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Bet Form + Admin */}
            <div className="market-detail-right">
              {/* Claimable rewards */}
              {isResolved && identity && userWinningBets.length > 0 && (
                <div className="market-claims-card">
                  <div className="market-claims-card-line" />
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-4 h-4 market-claim-icon" />
                    <span className="market-claims-title">
                      You Won! Claim Your Rewards
                    </span>
                  </div>
                  <div className="space-y-3">
                    {userWinningBets.map((bet) => (
                      <ClaimableRow
                        key={bet.id.toString()}
                        bet={bet}
                        resolvedOutcome={market.resolvedOutcome!}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Bet Form */}
              {isActive && (
                <div className="market-bet-card">
                  <div className="market-bet-card-line" />
                  <div className="flex items-center gap-2 mb-5">
                    <TrendingUp className="w-4 h-4 market-prob-icon" />
                    <span className="markets-form-label">Place Bet</span>
                  </div>
                  <BetForm market={market} />
                </div>
              )}

              {/* Admin resolve */}
              {isAdmin && isActive && (
                <div className="market-admin-card">
                  <div className="market-admin-card-line" />
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4 market-admin-icon" />
                    <span className="market-admin-label">
                      Admin — Resolve Market
                    </span>
                  </div>
                  <p className="market-admin-desc mb-4">
                    Only resolve when the outcome is certain and verifiable.
                    This action is irreversible.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => void handleResolve(true)}
                      disabled={resolveMarket.isPending}
                      className="market-resolve-yes-btn flex-1"
                    >
                      {resolveMarket.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Resolve YES
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleResolve(false)}
                      disabled={resolveMarket.isPending}
                      className="market-resolve-no-btn flex-1"
                    >
                      {resolveMarket.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      Resolve NO
                    </button>
                  </div>
                </div>
              )}

              {/* Resolved outcome display */}
              {isResolved && (
                <div
                  className={`market-resolved-banner ${market.resolvedOutcome ? "market-resolved-yes" : "market-resolved-no"}`}
                >
                  {market.resolvedOutcome ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <XCircle className="w-6 h-6" />
                  )}
                  <div>
                    <div className="market-resolved-title">
                      {market.resolvedOutcome ? "YES Won" : "NO Won"}
                    </div>
                    <div className="market-resolved-sub">
                      This market has been resolved.
                    </div>
                  </div>
                </div>
              )}

              {/* Security notice */}
              <div className="market-security-notice">
                <Shield className="w-4 h-4 market-security-icon shrink-0 mt-0.5" />
                <p className="market-security-text">
                  Bets are executed on-chain via ICP smart contracts. Once
                  placed, bets cannot be reversed. Only bet what you can afford
                  to lose.
                </p>
              </div>

              {/* Unhedged External Bet Panel */}
              <UnhedgedBetPanel defaultMarketId={id} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="identity-footer">
        <div className="identity-footer-top-line" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="identity-footer-bottom">
            <p className="identity-footer-copyright">
              © {new Date().getFullYear()} ICP Protocol Community Initiative
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
