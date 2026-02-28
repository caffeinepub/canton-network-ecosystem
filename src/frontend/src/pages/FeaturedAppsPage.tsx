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
    name: "CantonLoop",
    category: "DeFi & Wallet",
    tagline: "The hub for Canton Network applications",
    description:
      "CantonLoop is the primary gateway and app hub for the Canton Network ecosystem, providing wallet management, app discovery, and DeFi access.",
    features: [
      "App discovery",
      "Wallet integration",
      "DeFi access",
      "Canton Network gateway",
    ],
    url: "https://cantonloop.com",
    featured: true,
  },
  {
    name: "5N Lighthouse Explorer",
    category: "Explorer",
    tagline: "Canton Network blockchain explorer",
    description:
      "5N Lighthouse is the official Canton Network transaction and block explorer, allowing users to inspect transactions, smart contracts, and participants.",
    features: [
      "Transaction explorer",
      "Block data",
      "Smart contract viewer",
      "Participant lookup",
    ],
    url: "https://lighthouse.cantonloop.com",
    featured: true,
  },
  {
    name: "Canton Network",
    category: "Protocol",
    tagline: "The global synchronization network",
    description:
      "The official Canton Network portal — a global synchronization layer for permissioned DLT applications used by financial institutions worldwide.",
    features: [
      "Global sync",
      "Permissioned DLT",
      "Institutional-grade",
      "Interoperability",
    ],
    url: "https://www.canton.network",
    featured: true,
  },
  {
    name: "CantonScan",
    category: "Explorer",
    tagline: "Track and verify Canton transactions",
    description:
      "CantonScan provides transaction verification and tracking for Canton Network, giving users full transparency into on-ledger activity.",
    features: [
      "Transaction tracking",
      "Address lookup",
      "Token transfers",
      "Network stats",
    ],
    url: "https://www.cantonscan.com",
    featured: false,
  },
  {
    name: "Modulo",
    category: "Wallet",
    tagline: "Institutional-grade Canton wallet",
    description:
      "Modulo is an enterprise-grade wallet and identity solution built natively for Canton Network, designed for financial institutions.",
    features: [
      "Enterprise wallet",
      "Canton-native",
      "Identity management",
      "Multi-signature",
    ],
    url: "https://www.modulo.world",
    featured: false,
  },
  {
    name: "Splice",
    category: "Infrastructure",
    tagline: "Canton Network validator & infra toolkit",
    description:
      "Splice provides the open-source infrastructure and validator tooling for Canton Network, enabling participants to run nodes and build integrations.",
    features: [
      "Validator nodes",
      "Open source",
      "Node tooling",
      "Network participation",
    ],
    url: "https://github.com/hyperledger-labs/splice",
    featured: false,
  },
  {
    name: "Digital Asset",
    category: "Infrastructure",
    tagline: "Builders of Canton & Daml",
    description:
      "Digital Asset is the company behind Canton Network and the Daml smart contract language. They provide the core SDKs and enterprise tooling.",
    features: [
      "Daml SDK",
      "Canton core",
      "Enterprise support",
      "Developer tools",
    ],
    url: "https://www.digitalasset.com",
    featured: false,
  },
  {
    name: "Bron Wallet",
    category: "Wallet",
    tagline: "Non-custodial CC wallet",
    description:
      "Bron Wallet is a self-custody wallet designed for managing Canton (CC) tokens with a clean interface and focus on security.",
    features: [
      "Self-custody",
      "CC support",
      "Non-custodial",
      "Easy onboarding",
    ],
    url: "https://bronwallet.com",
    featured: false,
  },
  {
    name: "Zoro Wallet",
    category: "Wallet",
    tagline: "Swap and store Canton assets",
    description:
      "Zoro Wallet is a retail-focused wallet with built-in swap features for Canton (CC) tokens and seamless Canton Network integration.",
    features: [
      "Token swap",
      "Retail-friendly",
      "CC storage",
      "Canton integration",
    ],
    url: "https://zorowallet.com",
    featured: false,
  },
  {
    name: "Canton Community Hub",
    category: "Community",
    tagline: "Community resources for Canton Network",
    description:
      "The Canton Community Hub aggregates news, guides, developer resources, and ecosystem updates for all things Canton Network.",
    features: [
      "Community news",
      "Developer guides",
      "Ecosystem updates",
      "Forums",
    ],
    url: "https://canton.network/community",
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
    { label: "Ecosystem", href: "/ecosystem" },
    { label: "Wallet", href: "/wallet" },
    { label: "Integration", href: "/integration" },
    { label: "Dev Docs", href: "/developer" },
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
              Discover the best applications, tools, and protocols built on ICP
              Protocol — from DeFi gateways and block explorers to institutional
              wallets and infrastructure.
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

        {/* ── CantonLoop CTA Banner ── */}
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
                  Explore More on CantonLoop
                </h2>
                <p className="identity-section-subtitle mb-8 max-w-xl mx-auto">
                  CantonLoop's Lighthouse is the official app discovery hub for
                  the Canton Network ecosystem. Browse the full catalogue of
                  featured dApps and integrations.
                </p>
                <a
                  href="https://lighthouse.cantonloop.com/featured-apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fa-cta-btn"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Lighthouse on CantonLoop
                  <ArrowRight className="w-4 h-4" />
                </a>
                <p className="fa-cta-note mt-4">
                  lighthouse.cantonloop.com/featured-apps
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
