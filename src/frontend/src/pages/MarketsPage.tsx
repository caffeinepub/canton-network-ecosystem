import type { Market, MarketCategory } from "@/backend.d";
import { MarketStatus } from "@/backend.d";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useCreateMarket, useGetMarkets } from "@/hooks/useQueries";
import type { Principal } from "@icp-sdk/core/principal";
import {
  AlertTriangle,
  BarChart2,
  ChevronRight,
  Clock,
  ExternalLink,
  Loader2,
  Plus,
  Search,
  TrendingUp,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ── Unhedged API ──────────────────────────────────────────────────────────────

const UNHEDGED_MARKETS_URL = "https://unhedged.gg/api/v1/markets";
const UNHEDGED_TOKEN = "ak_MGZbA18VEeXakyPlrlcmPZgjiGNbnfuYBXTjZIBGbM7vqKaf";

const makePrincipal = (s: string): Principal =>
  ({ toString: () => s }) as unknown as Principal;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUnhedgedMarket(raw: any, index: number): Market {
  // Determine title from common API shapes
  const title: string =
    raw.question ??
    raw.title ??
    raw.name ??
    raw.prompt ??
    `Market #${index + 1}`;

  // Description
  const description: string =
    raw.description ?? raw.subtitle ?? raw.details ?? "";

  // Category mapping
  const rawCategory: string = raw.category ?? raw.tag ?? "";
  const categoryMap: Record<string, string> = {
    crypto: "Crypto",
    sports: "Sports",
    politics: "Politics",
    technology: "Technology",
    tech: "Technology",
    entertainment: "Entertainment",
    news: "Politics",
    finance: "Crypto",
  };
  const category: MarketCategory = (categoryMap[rawCategory.toLowerCase()] ??
    "Crypto") as MarketCategory;

  // Pool amounts — multiply by 100_000_000 to match ICP e8s format
  const yesPool =
    raw.yesPool ?? raw.yes_pool ?? raw.volumeYes ?? raw.volume_yes ?? 0;
  const noPool =
    raw.noPool ?? raw.no_pool ?? raw.volumeNo ?? raw.volume_no ?? 0;
  const totalYesPool = BigInt(Math.round(Number(yesPool) * 100_000_000));
  const totalNoPool = BigInt(Math.round(Number(noPool) * 100_000_000));

  // Deadline — try closeTime / close_time / expiresAt / endDate in ms or ISO
  const closeRaw =
    raw.closeTime ??
    raw.close_time ??
    raw.expiresAt ??
    raw.expires_at ??
    raw.endDate ??
    raw.end_date;
  let deadlineMs: number;
  if (closeRaw) {
    if (typeof closeRaw === "number") {
      // Could be seconds or milliseconds — if < 1e12, assume seconds
      deadlineMs = closeRaw < 1e12 ? closeRaw * 1000 : closeRaw;
    } else {
      deadlineMs = new Date(String(closeRaw)).getTime();
    }
  } else {
    // Default: 1 year from now
    deadlineMs = Date.now() + 365 * 24 * 60 * 60 * 1000;
  }
  const deadline = BigInt(deadlineMs * 1_000_000);

  // Status
  const rawStatus: string = String(
    raw.status ?? raw.state ?? "active",
  ).toLowerCase();
  const status =
    rawStatus === "resolved" || rawStatus === "closed"
      ? MarketStatus.resolved
      : rawStatus === "cancelled" || rawStatus === "canceled"
        ? MarketStatus.cancelled
        : MarketStatus.active;

  // Image
  const imageUrl: string =
    raw.imageUrl ?? raw.image_url ?? raw.image ?? raw.banner ?? "";

  // ID — use numeric string index as BigInt for stable IDs
  const idRaw = raw.id ?? raw.marketId ?? raw.market_id ?? index + 1;
  let id: bigint;
  try {
    id = BigInt(
      typeof idRaw === "number"
        ? idRaw
        : String(idRaw).replace(/\D/g, "") || String(index + 1),
    );
  } catch {
    id = BigInt(index + 1);
  }

  return {
    id,
    title,
    description,
    category,
    status,
    imageUrl,
    totalYesPool,
    totalNoPool,
    deadline,
    createdAt: BigInt(Date.now() * 1_000_000),
    creator: makePrincipal("aaaaa-aa"),
  };
}

// ── Fallback Sample Markets (absolute last resort) ────────────────────────────

const SAMPLE_MARKETS: Market[] = [
  {
    id: BigInt(1),
    title: "Will Bitcoin reach $150,000 by end of 2025?",
    description:
      "Bitcoin has been on a strong upward trajectory. Will it hit the $150k milestone before December 31, 2025?",
    category: "Crypto" as MarketCategory,
    status: MarketStatus.active,
    imageUrl: "",
    totalYesPool: BigInt(240000000000),
    totalNoPool: BigInt(160000000000),
    deadline: BigInt((new Date("2025-12-31").getTime() + 86400000) * 1_000_000),
    createdAt: BigInt(Date.now() * 1_000_000),
    creator: makePrincipal("aaaaa-aa"),
  },
  {
    id: BigInt(2),
    title: "Will ICP hit top 10 market cap in 2025?",
    description:
      "Internet Computer Protocol (ICP) is building a decentralized cloud. Can it break into the crypto top 10?",
    category: "Crypto" as MarketCategory,
    status: MarketStatus.active,
    imageUrl: "",
    totalYesPool: BigInt(180000000000),
    totalNoPool: BigInt(320000000000),
    deadline: BigInt((new Date("2025-12-31").getTime() + 86400000) * 1_000_000),
    createdAt: BigInt(Date.now() * 1_000_000),
    creator: makePrincipal("aaaaa-aa"),
  },
  {
    id: BigInt(3),
    title: "Will Ethereum merge to PoS v2 in 2025?",
    description:
      "Ethereum's roadmap includes significant PoS upgrades. Will the next major milestone ship this year?",
    category: "Crypto" as MarketCategory,
    status: MarketStatus.active,
    imageUrl: "",
    totalYesPool: BigInt(310000000000),
    totalNoPool: BigInt(90000000000),
    deadline: BigInt((new Date("2025-09-30").getTime() + 86400000) * 1_000_000),
    createdAt: BigInt(Date.now() * 1_000_000),
    creator: makePrincipal("aaaaa-aa"),
  },
];

const CATEGORIES = [
  "All",
  "Crypto",
  "Sports",
  "Politics",
  "Technology",
  "Entertainment",
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPool(amount: bigint): string {
  const whole = Number(amount / BigInt(100_000_000));
  if (whole >= 1_000_000) return `${(whole / 1_000_000).toFixed(1)}M`;
  if (whole >= 1_000) return `${(whole / 1_000).toFixed(1)}K`;
  return whole.toString();
}

function calcProbability(yesPool: bigint, noPool: bigint): number {
  const total = yesPool + noPool;
  if (total === BigInt(0)) return 50;
  return Math.round((Number(yesPool) / Number(total)) * 100);
}

function getDeadlineLabel(deadline: bigint): string {
  const ms = Number(deadline / BigInt(1_000_000));
  const now = Date.now();
  const diff = ms - now;
  if (diff <= 0) return "Closed";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Closes today";
  if (days === 1) return "Closes tomorrow";
  return `Closes in ${days}d`;
}

function getCategoryColor(category: string): {
  bg: string;
  text: string;
  border: string;
} {
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

function MarketsNavBar() {
  const [scrolled, setScrolled] = useState(false);
  const { identity, login, isLoggingIn } = useInternetIdentity();

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
              { label: "Ecosystem", href: "/ecosystem" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`identity-nav-link ${link.href === "/markets" ? "markets-nav-active" : ""}`}
              >
                {link.label}
              </a>
            ))}
            {identity ? (
              <div className="markets-user-pill ml-2">
                <div className="markets-user-dot" />
                <span className="font-mono text-xs">
                  {identity.getPrincipal().toString().slice(0, 8)}…
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={login}
                disabled={isLoggingIn}
                className="ig-connect-btn ml-2"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5" />
                )}
                Start Trading
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// ── Market Card ───────────────────────────────────────────────────────────────

function MarketCard({ market, index }: { market: Market; index: number }) {
  const yesPct = calcProbability(market.totalYesPool, market.totalNoPool);
  const noPct = 100 - yesPct;
  const totalPool = `${formatPool(market.totalYesPool + market.totalNoPool)} ICP`;
  const deadlineLabel = getDeadlineLabel(market.deadline);
  const catColors = getCategoryColor(market.category.toString());
  const isResolved = market.status === MarketStatus.resolved;
  const isCancelled = market.status === MarketStatus.cancelled;

  return (
    <a
      href={`/markets/${market.id.toString()}`}
      className="markets-card group"
      style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
    >
      {/* Top accent */}
      <div className="markets-card-top-line" />

      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
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
        <div className="flex items-center gap-2">
          {isResolved && (
            <span
              className={`markets-status-badge ${market.resolvedOutcome ? "markets-status-yes" : "markets-status-no"}`}
            >
              {market.resolvedOutcome ? "YES WON" : "NO WON"}
            </span>
          )}
          {isCancelled && (
            <span className="markets-status-badge markets-status-cancelled">
              CANCELLED
            </span>
          )}
          {!isResolved && !isCancelled && (
            <span className="markets-status-badge markets-status-active">
              ACTIVE
            </span>
          )}
          <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground/80 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>

      {/* Title */}
      <h3 className="markets-card-title">{market.title}</h3>

      {/* Description */}
      <p className="markets-card-desc">{market.description}</p>

      {/* Probability bar */}
      <div className="markets-prob-section">
        <div className="flex justify-between items-center mb-1.5">
          <span className="markets-prob-yes-label">{yesPct}% YES</span>
          <span className="markets-prob-no-label">{noPct}% NO</span>
        </div>
        <div className="markets-prob-bar">
          <div
            className="markets-prob-fill-yes"
            style={{ width: `${yesPct}%` }}
          />
          <div
            className="markets-prob-fill-no"
            style={{ width: `${noPct}%` }}
          />
        </div>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-1.5 markets-pool-label">
          <BarChart2 className="w-3.5 h-3.5" />
          <span>{totalPool}</span>
        </div>
        <div className="flex items-center gap-1.5 markets-deadline-label">
          <Clock className="w-3.5 h-3.5" />
          <span>{deadlineLabel}</span>
        </div>
      </div>
    </a>
  );
}

// ── Create Market Modal ───────────────────────────────────────────────────────

function CreateMarketModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<MarketCategory>(
    "Crypto" as MarketCategory,
  );
  const [imageUrl, setImageUrl] = useState("");
  const [deadline, setDeadline] = useState("");
  const createMarket = useCreateMarket();
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !deadline) return;

    const deadlineTs = BigInt(new Date(deadline).getTime() * 1_000_000);

    try {
      await createMarket.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        category,
        imageUrl: imageUrl.trim(),
        deadline: deadlineTs,
      });
      toast.success("Market created!", {
        description: "Your prediction market is now live.",
      });
      onClose();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to create market";
      toast.error("Failed to create market", { description: msg });
    }
  };

  return (
    <div
      ref={backdropRef}
      className="markets-modal-backdrop"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="markets-modal">
        <div className="markets-modal-line" />
        <div className="flex items-center justify-between mb-6">
          <h2 className="markets-modal-title">Create Prediction Market</h2>
          <button
            type="button"
            onClick={onClose}
            className="markets-modal-close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <label className="markets-form-label" htmlFor="market-title">
              Question / Title
            </label>
            <input
              id="market-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Will Bitcoin reach $200k in 2025?"
              className="identity-input mt-1.5"
              required
            />
          </div>

          <div>
            <label className="markets-form-label" htmlFor="market-desc">
              Description
            </label>
            <textarea
              id="market-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the resolution criteria..."
              className="identity-input mt-1.5 resize-none"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="markets-form-label" htmlFor="market-category">
                Category
              </label>
              <select
                id="market-category"
                value={String(category)}
                onChange={(e) => setCategory(e.target.value as MarketCategory)}
                className="identity-input mt-1.5"
              >
                {[
                  "Crypto",
                  "Sports",
                  "Politics",
                  "Technology",
                  "Entertainment",
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="markets-form-label" htmlFor="market-deadline">
                Deadline
              </label>
              <input
                id="market-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="identity-input mt-1.5"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>

          <div>
            <label className="markets-form-label" htmlFor="market-image">
              Image URL{" "}
              <span className="markets-form-optional">(optional)</span>
            </label>
            <input
              id="market-image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="identity-input mt-1.5"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="markets-modal-cancel flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                createMarket.isPending || !title || !description || !deadline
              }
              className="markets-modal-submit flex-1"
            >
              {createMarket.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Market
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Markets Page ──────────────────────────────────────────────────────────────

export default function MarketsPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  // Unhedged API state
  const [unhedgedMarkets, setUnhedgedMarkets] = useState<Market[]>([]);
  const [unhedgedLoading, setUnhedgedLoading] = useState(true);
  const [unhedgedError, setUnhedgedError] = useState<string | null>(null);

  const { data: backendMarkets, isLoading: backendLoading } = useGetMarkets();

  // Fetch from Unhedged API on mount
  useEffect(() => {
    let cancelled = false;
    setUnhedgedLoading(true);
    setUnhedgedError(null);

    fetch(UNHEDGED_MARKETS_URL, {
      headers: {
        Authorization: `Bearer ${UNHEDGED_TOKEN}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (cancelled) return;
        // The response may be an array or wrapped in { markets: [], data: [], items: [] }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawList: any[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.markets)
            ? json.markets
            : Array.isArray(json?.data)
              ? json.data
              : Array.isArray(json?.items)
                ? json.items
                : [];
        const mapped = rawList.map((raw, i) => mapUnhedgedMarket(raw, i));
        setUnhedgedMarkets(mapped);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : "Unknown error";
        setUnhedgedError(msg);
      })
      .finally(() => {
        if (!cancelled) setUnhedgedLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const isLoading = unhedgedLoading || backendLoading;

  // Priority: Unhedged > Backend > Sample fallback
  const allMarkets = useMemo(() => {
    if (unhedgedMarkets.length > 0) return unhedgedMarkets;
    if (backendMarkets && backendMarkets.length > 0) return backendMarkets;
    return SAMPLE_MARKETS;
  }, [unhedgedMarkets, backendMarkets]);

  const filteredMarkets = useMemo(() => {
    let list = allMarkets;
    if (activeCategory !== "All") {
      list = list.filter((m) => m.category.toString() === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q),
      );
    }
    return list;
  }, [allMarkets, activeCategory, searchQuery]);

  const totalPool = allMarkets.reduce(
    (acc, m) => acc + m.totalYesPool + m.totalNoPool,
    BigInt(0),
  );

  return (
    <div className="identity-page">
      <MarketsNavBar />

      {createOpen && <CreateMarketModal onClose={() => setCreateOpen(false)} />}

      {/* ── Hero ── */}
      <section className="markets-hero relative overflow-hidden">
        <div className="identity-grid-overlay" />
        <div className="markets-hero-orb-1" />
        <div className="markets-hero-orb-2" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-16">
          <div className="markets-hero-eyebrow mb-6 animate-fade-in-down inline-flex">
            <TrendingUp className="w-3.5 h-3.5" />
            Prediction Markets · Powered by Unhedged
          </div>

          <h1 className="markets-hero-headline animate-fade-in-up">
            Prediction
            <br />
            <span className="markets-hero-accent">Markets</span>
          </h1>

          <p
            className="markets-hero-sub mt-5 max-w-xl animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            Bet on crypto, world events, sports and more using ICP tokens. Put
            your knowledge to work and earn rewards.
          </p>

          <div
            className="flex flex-wrap gap-6 mt-10 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="markets-stat">
              <div className="markets-stat-value">{allMarkets.length}</div>
              <div className="markets-stat-label">Active Markets</div>
            </div>
            <div className="markets-stat-divider" />
            <div className="markets-stat">
              <div className="markets-stat-value">
                {formatPool(totalPool)} ICP
              </div>
              <div className="markets-stat-label">Total Liquidity</div>
            </div>
            <div className="markets-stat-divider" />
            <div className="markets-stat">
              <div className="markets-stat-value">~10s</div>
              <div className="markets-stat-label">Settlement Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Markets Content ── */}
      <section className="identity-section relative">
        <div className="identity-section-divider" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Error banner: show when Unhedged fetch fails */}
          {unhedgedError && (
            <div
              className="unhedged-error-banner mb-6"
              data-ocid="markets.error_state"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                Could not load Unhedged markets. Showing local markets.
              </span>
            </div>
          )}

          {/* Powered by Unhedged note */}
          {!unhedgedError && (
            <div className="unhedged-info-note mb-6">
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span>
                Markets powered by <strong>Unhedged API</strong>
              </span>
              <a
                href="https://unhedged.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="unhedged-info-link"
              >
                unhedged.gg
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Controls row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            {/* Category tabs */}
            <div className="markets-tabs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`markets-tab ${activeCategory === cat ? "markets-tab-active" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Right side: search + create */}
            <div className="flex items-center gap-3">
              <div className="markets-search-wrap">
                <Search className="markets-search-icon w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search markets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="markets-search-input"
                />
              </div>
              {identity ? (
                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
                  className="markets-create-btn"
                >
                  <Plus className="w-4 h-4" />
                  Create Market
                </button>
              ) : (
                <button
                  type="button"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="markets-create-btn"
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Login to Create
                </button>
              )}
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="markets-loading-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="markets-card-skeleton" />
              ))}
            </div>
          )}

          {/* Markets grid */}
          {!isLoading && filteredMarkets.length > 0 && (
            <div className="markets-grid">
              {filteredMarkets.map((market, i) => (
                <MarketCard
                  key={market.id.toString()}
                  market={market}
                  index={i}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filteredMarkets.length === 0 && (
            <div className="markets-empty">
              <BarChart2 className="w-10 h-10 markets-empty-icon" />
              <h3 className="markets-empty-title">No markets found</h3>
              <p className="markets-empty-sub">
                {searchQuery
                  ? `No markets match "${searchQuery}"`
                  : `No ${activeCategory} markets available yet.`}
              </p>
              {identity && (
                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
                  className="markets-create-btn mt-4"
                >
                  <Plus className="w-4 h-4" />
                  Create First Market
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
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
                Independent community initiative. Bet responsibly.
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
                  { label: "Ecosystem", href: "/ecosystem" },
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
                Community
              </h4>
              <p className="identity-footer-body">
                Join the prediction market community and put your ICP knowledge
                to the test.
              </p>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="identity-footer-link mt-3 inline-flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                GitHub (Coming Soon)
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
