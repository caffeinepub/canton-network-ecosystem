import ConnectWalletModal from "@/components/ConnectWalletModal";
import {
  ArrowRight,
  BarChart3,
  Code2,
  ExternalLink,
  Globe,
  Layers,
  Mail,
  Search,
  Sparkles,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
type AppCategory =
  | "DeFi & Wallet"
  | "Explorer"
  | "Wallet"
  | "Infrastructure"
  | "Protocol"
  | "Community";

type FilterTab = "All" | AppCategory;

interface FeaturedApp {
  name: string;
  category: AppCategory;
  tagline: string;
  description: string;
  features: string[];
  url: string;
  featured: boolean;
}

// ── Data ───────────────────────────────────────────────────────────────────────
const FEATURED_APPS: FeaturedApp[] = [
  {
    name: "NNS Dapp",
    category: "DeFi & Wallet",
    tagline: "Official Internet Computer governance hub",
    description:
      "The Network Nervous System dApp is the official governance interface for the Internet Computer. Stake ICP, vote on proposals, and manage your neurons.",
    features: [
      "ICP staking",
      "Governance voting",
      "Neuron management",
      "Token management",
    ],
    url: "https://nns.ic0.app",
    featured: true,
  },
  {
    name: "ICPSwap",
    category: "DeFi & Wallet",
    tagline: "DEX for the Internet Computer ecosystem",
    description:
      "ICPSwap is the leading decentralized exchange on the Internet Computer, enabling token swaps, liquidity pools, and yield farming with ICP tokens.",
    features: ["Token swaps", "Liquidity pools", "Yield farming", "ICP DeFi"],
    url: "https://icpswap.com",
    featured: true,
  },
  {
    name: "ICP Dashboard",
    category: "Explorer",
    tagline: "Official Internet Computer analytics and explorer",
    description:
      "The official dashboard for monitoring Internet Computer network statistics, canister activity, transaction history, and governance metrics.",
    features: [
      "Network stats",
      "Transaction explorer",
      "Canister info",
      "Governance data",
    ],
    url: "https://dashboard.internetcomputer.org",
    featured: true,
  },
  {
    name: "OpenChat",
    category: "Community",
    tagline: "Decentralized messaging on the Internet Computer",
    description:
      "OpenChat is a fully on-chain messaging application built on ICP, offering groups, channels, and crypto tipping — all stored on the blockchain.",
    features: [
      "On-chain messaging",
      "Group chats",
      "Crypto tipping",
      "NFT avatars",
    ],
    url: "https://oc.app",
    featured: true,
  },
  {
    name: "Sonic DEX",
    category: "DeFi & Wallet",
    tagline: "Fast and secure token swaps on ICP",
    description:
      "Sonic is a decentralized exchange built on the Internet Computer Protocol, offering fast token swaps with near-zero fees.",
    features: ["Token swaps", "Liquidity pools", "Low fees", "On-chain"],
    url: "https://sonic.ooo",
    featured: false,
  },
  {
    name: "DSCVR",
    category: "Community",
    tagline: "Decentralized social platform on ICP",
    description:
      "DSCVR is a Web3 social network running entirely on the Internet Computer, featuring portals, tokenized communities, and NFT integration.",
    features: ["Web3 social", "Portals", "NFT integration", "Token rewards"],
    url: "https://dscvr.one",
    featured: false,
  },
  {
    name: "Plug Wallet",
    category: "Wallet",
    tagline: "Browser extension wallet for Internet Computer",
    description:
      "Plug is the most popular browser extension wallet for the Internet Computer, supporting ICP, ICRC tokens, NFTs, and dApp connections.",
    features: [
      "Browser extension",
      "ICP & ICRC tokens",
      "NFT support",
      "dApp connector",
    ],
    url: "https://plugwallet.ooo",
    featured: false,
  },
  {
    name: "Entrepot",
    category: "Infrastructure",
    tagline: "ICP NFT marketplace",
    description:
      "Entrepot is the leading NFT marketplace on the Internet Computer, enabling users to buy, sell, and trade digital collectibles on-chain.",
    features: [
      "NFT trading",
      "On-chain storage",
      "Creator tools",
      "ICP payments",
    ],
    url: "https://entrepot.app",
    featured: false,
  },
  {
    name: "DFINITY Foundation",
    category: "Protocol",
    tagline: "The team behind Internet Computer Protocol",
    description:
      "DFINITY Foundation is the non-profit organization that created and maintains the Internet Computer Protocol, providing grants, research, and developer tools.",
    features: [
      "ICP research",
      "Developer grants",
      "Open source",
      "Protocol upgrades",
    ],
    url: "https://dfinity.org",
    featured: false,
  },
  {
    name: "Internet Computer Wiki",
    category: "Infrastructure",
    tagline: "Comprehensive documentation for ICP developers",
    description:
      "The official developer documentation and wiki for building on the Internet Computer — from getting started guides to advanced smart contract patterns.",
    features: [
      "Developer docs",
      "Tutorials",
      "API reference",
      "Community guides",
    ],
    url: "https://internetcomputer.org/docs",
    featured: false,
  },
];

const FILTER_TABS: FilterTab[] = [
  "All",
  "DeFi & Wallet",
  "Explorer",
  "Wallet",
  "Infrastructure",
  "Protocol",
  "Community",
];

// ── Category Config ─────────────────────────────────────────────────────────────
type CategoryConfig = {
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgClass: string;
  borderClass: string;
};

const CATEGORY_CONFIG: Record<AppCategory, CategoryConfig> = {
  "DeFi & Wallet": {
    icon: BarChart3,
    colorClass: "fa-cat-defi-text",
    bgClass: "fa-cat-defi-bg",
    borderClass: "fa-cat-defi-border",
  },
  Explorer: {
    icon: Globe,
    colorClass: "fa-cat-explorer-text",
    bgClass: "fa-cat-explorer-bg",
    borderClass: "fa-cat-explorer-border",
  },
  Wallet: {
    icon: Wallet,
    colorClass: "fa-cat-wallet-text",
    bgClass: "fa-cat-wallet-bg",
    borderClass: "fa-cat-wallet-border",
  },
  Infrastructure: {
    icon: Layers,
    colorClass: "fa-cat-infra-text",
    bgClass: "fa-cat-infra-bg",
    borderClass: "fa-cat-infra-border",
  },
  Protocol: {
    icon: Code2,
    colorClass: "fa-cat-protocol-text",
    bgClass: "fa-cat-protocol-bg",
    borderClass: "fa-cat-protocol-border",
  },
  Community: {
    icon: Users,
    colorClass: "fa-cat-community-text",
    bgClass: "fa-cat-community-bg",
    borderClass: "fa-cat-community-border",
  },
};

// ── Navbar ────────────────────────────────────────────────────────────────────
function NavBar({ onConnectWallet }: { onConnectWallet: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Identity", href: "/" },
    { label: "Markets", href: "/markets" },
    { label: "Launchpad", href: "/launchpad" },
    { label: "Ecosystem", href: "/ecosystem" },
    { label: "Wallet", href: "/wallet" },
    { label: "Integration", href: "/integration" },
    { label: "Featured Apps", href: "/featured-apps" },
  ];

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
            <span className="identity-nav-title">ICP Protocol</span>
            <span className="identity-beta-badge">Prototype</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`identity-nav-link ${
                  link.href === "/featured-apps" ? "eco-nav-active" : ""
                }`}
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={onConnectWallet}
              className="ig-connect-btn ml-2"
            >
              <Wallet className="w-3.5 h-3.5" />
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ── CategoryBadge ─────────────────────────────────────────────────────────────
function CategoryBadge({ category }: { category: AppCategory }) {
  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;
  return (
    <span
      className={`fa-category-badge ${config.bgClass} ${config.colorClass} ${config.borderClass}`}
    >
      <Icon className="w-3 h-3" />
      {category}
    </span>
  );
}

// ── FeatureChip ───────────────────────────────────────────────────────────────
function FeatureChip({ label }: { label: string }) {
  return <span className="fa-feature-chip">{label}</span>;
}

// ── FeaturedAppCard ───────────────────────────────────────────────────────────
function FeaturedAppCard({
  app,
  index,
}: {
  app: FeaturedApp;
  index: number;
}) {
  const config = CATEGORY_CONFIG[app.category];

  return (
    <a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      className="fa-featured-card group"
      style={{ animationDelay: `${index * 0.08}s` }}
      aria-label={`Visit ${app.name}`}
    >
      {/* Glow ring on hover */}
      <div className="fa-featured-card-glow" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`fa-app-icon ${config.bgClass} ${config.borderClass}`}
          >
            {(() => {
              const Icon = config.icon;
              return <Icon className={`w-5 h-5 ${config.colorClass}`} />;
            })()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="fa-featured-card-name">{app.name}</h3>
              <Star
                className="w-3.5 h-3.5 fa-featured-star"
                fill="currentColor"
              />
            </div>
            <p className="fa-featured-card-tagline">{app.tagline}</p>
          </div>
        </div>
        <ExternalLink className="fa-external-icon w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* Description */}
      <p className="fa-card-description mb-5">{app.description}</p>

      {/* Feature chips */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {app.features.map((f) => (
          <FeatureChip key={f} label={f} />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t fa-card-border">
        <CategoryBadge category={app.category} />
        <span className="fa-visit-btn">
          Visit App
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </a>
  );
}

// ── RegularAppCard ────────────────────────────────────────────────────────────
function RegularAppCard({
  app,
  index,
}: {
  app: FeaturedApp;
  index: number;
}) {
  const config = CATEGORY_CONFIG[app.category];

  return (
    <a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      className="fa-regular-card group"
      style={{ animationDelay: `${index * 0.05}s` }}
      aria-label={`Visit ${app.name}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div
          className={`fa-app-icon-sm ${config.bgClass} ${config.borderClass}`}
        >
          {(() => {
            const Icon = config.icon;
            return <Icon className={`w-4 h-4 ${config.colorClass}`} />;
          })()}
        </div>
        <ExternalLink className="fa-external-icon w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      <h3 className="fa-card-name mb-1">{app.name}</h3>
      <p className="fa-card-tagline mb-3">{app.tagline}</p>
      <p className="fa-card-description mb-4">{app.description}</p>

      {/* Feature chips */}
      <div className="flex flex-wrap gap-1 mb-4">
        {app.features.slice(0, 3).map((f) => (
          <FeatureChip key={f} label={f} />
        ))}
      </div>

      <div className="mt-auto pt-3 border-t fa-card-border">
        <CategoryBadge category={app.category} />
      </div>
    </a>
  );
}

// ── FilterTabBar ─────────────────────────────────────────────────────────────
function FilterTabBar({
  active,
  onSelect,
  counts,
}: {
  active: FilterTab;
  onSelect: (tab: FilterTab) => void;
  counts: Record<FilterTab, number>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onSelect(tab)}
          className={`eco-filter-tab ${
            active === tab ? "eco-filter-tab-active" : "eco-filter-tab-inactive"
          }`}
        >
          {tab}
          <span
            className={`eco-filter-count ${
              active === tab
                ? "eco-filter-count-active"
                : "eco-filter-count-inactive"
            }`}
          >
            {counts[tab]}
          </span>
        </button>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FeaturedAppsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [connectWalletOpen, setConnectWalletOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return FEATURED_APPS.filter((app) => {
      const matchesCategory =
        activeFilter === "All" || app.category === activeFilter;
      const matchesSearch =
        q === "" ||
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.tagline.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q) ||
        app.features.some((f) => f.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [search, activeFilter]);

  const featuredFiltered = useMemo(
    () => filtered.filter((a) => a.featured),
    [filtered],
  );
  const regularFiltered = useMemo(
    () => filtered.filter((a) => !a.featured),
    [filtered],
  );

  const counts = useMemo<Record<FilterTab, number>>(() => {
    const q = search.toLowerCase().trim();
    const base = FEATURED_APPS.filter(
      (a) =>
        q === "" ||
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tagline.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.features.some((f) => f.toLowerCase().includes(q)),
    );
    return {
      All: base.length,
      "DeFi & Wallet": base.filter((a) => a.category === "DeFi & Wallet")
        .length,
      Explorer: base.filter((a) => a.category === "Explorer").length,
      Wallet: base.filter((a) => a.category === "Wallet").length,
      Infrastructure: base.filter((a) => a.category === "Infrastructure")
        .length,
      Protocol: base.filter((a) => a.category === "Protocol").length,
      Community: base.filter((a) => a.category === "Community").length,
    };
  }, [search]);

  return (
    <div className="identity-page">
      <NavBar onConnectWallet={() => setConnectWalletOpen(true)} />

      <main>
        {/* ── Hero ── */}
        <section className="fa-hero relative overflow-hidden">
          <div className="identity-grid-overlay" />
          <div className="identity-orb identity-orb-1" />
          <div className="identity-orb identity-orb-2" />

          <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-36 pb-24 text-center">
            {/* Eyebrow badge */}
            <div className="identity-eyebrow-badge mb-8 animate-fade-in-down">
              <Sparkles className="w-3.5 h-3.5" />
              Featured Apps · ICP Ecosystem
            </div>

            {/* Title */}
            <h1
              className="identity-headline animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              ICP Ecosystem:
              <br />
              <span className="fa-title-gradient">Featured Apps</span>
            </h1>

            <p
              className="identity-subheadline mt-6 max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Discover the best applications, tools, and protocols built on the
              Internet Computer ecosystem — from DeFi exchanges and block
              explorers to community wallets and developer infrastructure.
            </p>

            {/* Stats badge */}
            <div
              className="flex items-center justify-center gap-3 mt-10 animate-fade-in"
              style={{ animationDelay: "0.35s" }}
            >
              <div className="fa-stats-badge">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{FEATURED_APPS.length} Ecosystem Apps</span>
              </div>
              <div className="fa-stats-badge fa-stats-badge-featured">
                <Star className="w-3.5 h-3.5" fill="currentColor" />
                <span>
                  {FEATURED_APPS.filter((a) => a.featured).length} Featured
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Apps Directory ── */}
        <section className="identity-section relative">
          <div className="identity-section-divider" />
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            {/* Search + Filter */}
            <div className="fa-controls mb-10">
              {/* Search */}
              <div className="eco-search-wrap">
                <Search className="eco-search-icon w-4 h-4" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search apps, categories, features..."
                  className="eco-search-input"
                  aria-label="Search apps"
                />
              </div>

              {/* Filters */}
              <FilterTabBar
                active={activeFilter}
                onSelect={setActiveFilter}
                counts={counts}
              />
            </div>

            {/* Results summary */}
            <div className="eco-results-summary mb-8">
              <span className="eco-results-count">{filtered.length}</span>
              <span className="eco-results-label">
                {filtered.length === 1 ? " app" : " apps"} found
              </span>
              {(search || activeFilter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveFilter("All");
                  }}
                  className="eco-results-clear"
                >
                  Clear filters
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="eco-empty-state">
                <Globe className="w-10 h-10 eco-empty-icon" />
                <h3 className="eco-empty-title">No apps found</h3>
                <p className="eco-empty-text">
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveFilter("All");
                  }}
                  className="eco-empty-btn"
                >
                  Show all apps
                </button>
              </div>
            ) : (
              <>
                {/* Featured Section */}
                {featuredFiltered.length > 0 && (
                  <div className="mb-14">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="fa-section-label">
                        <Star className="w-3.5 h-3.5" fill="currentColor" />
                        Featured
                      </div>
                      <div className="fa-section-line" />
                    </div>
                    <div className="fa-featured-grid">
                      {featuredFiltered.map((app, i) => (
                        <FeaturedAppCard key={app.name} app={app} index={i} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Apps */}
                {regularFiltered.length > 0 && (
                  <div>
                    {featuredFiltered.length > 0 && (
                      <div className="flex items-center gap-3 mb-6">
                        <div className="fa-section-label fa-section-label-all">
                          <Globe className="w-3.5 h-3.5" />
                          All Apps
                        </div>
                        <div className="fa-section-line" />
                      </div>
                    )}
                    <div className="fa-apps-grid">
                      {regularFiltered.map((app, i) => (
                        <RegularAppCard key={app.name} app={app} index={i} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ── ICP Dashboard CTA Banner ── */}
        <section className="identity-section relative">
          <div className="identity-section-divider" />
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="fa-cta-banner">
              <div className="fa-cta-banner-glow" />
              <div className="relative z-10 text-center">
                <div className="fa-cta-icon-wrap mb-5">
                  <Sparkles className="w-6 h-6 fa-cta-icon" />
                </div>
                <h2 className="identity-section-title mb-3">
                  Explore More on Internet Computer
                </h2>
                <p className="identity-section-subtitle mb-8 max-w-xl mx-auto">
                  The ICP Dashboard is the official analytics and explorer hub
                  for the Internet Computer ecosystem. Monitor network stats,
                  canister activity, and governance data.
                </p>
                <a
                  href="https://dashboard.internetcomputer.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fa-cta-btn"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open ICP Dashboard
                  <ArrowRight className="w-4 h-4" />
                </a>
                <p className="fa-cta-note mt-4">
                  dashboard.internetcomputer.org
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="identity-footer">
        <div className="identity-footer-top-line" />
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="identity-logo-mark identity-logo-mark-sm">
                  <div className="identity-logo-inner" />
                </div>
                <span className="identity-footer-brand">ICP Protocol</span>
              </div>
              <p className="identity-footer-tagline">
                ICP Protocol Ecosystem & Featured Apps
              </p>
              <p className="identity-footer-disclaimer mt-3">
                Independent community initiative. Not affiliated with DFINITY
                Foundation or Internet Computer Protocol.
              </p>
            </div>
            <div>
              <h4 className="identity-footer-heading mb-4">
                <Globe className="w-4 h-4" />
                Ecosystem
              </h4>
              <p className="identity-footer-body">
                This directory is maintained by the ICP community to help users
                discover the best dApps, tools, and infrastructure built on ICP
                Protocol.
              </p>
            </div>
            <div>
              <h4 className="identity-footer-heading mb-4">
                <Mail className="w-4 h-4" />
                Contact
              </h4>
              <p className="identity-footer-body">
                To suggest an app or for partnership inquiries:
              </p>
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
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname,
                )}`}
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

      {/* Connect Wallet Modal */}
      <ConnectWalletModal
        isOpen={connectWalletOpen}
        onClose={() => setConnectWalletOpen(false)}
      />
    </div>
  );
}
