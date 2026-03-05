import {
  Building2,
  ChevronRight,
  Code2,
  ExternalLink,
  Globe,
  HardDrive,
  Key,
  Mail,
  Search,
  Shield,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Category =
  | "Exchange"
  | "Institutional Custody"
  | "Retail Wallet"
  | "Hardware Wallet"
  | "Developer";

type FilterTab = "All" | Category;

interface Platform {
  name: string;
  category: Category;
  description: string;
  url: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const PLATFORMS: Platform[] = [
  // Exchanges
  {
    name: "Binance",
    category: "Exchange",
    description: "ICP/USDT spot trading tersedia di pasar global Binance.",
    url: "https://www.binance.com",
  },
  {
    name: "Coinbase",
    category: "Exchange",
    description: "ICP listed on Coinbase exchange untuk retail dan institusi.",
    url: "https://www.coinbase.com",
  },
  {
    name: "Bybit",
    category: "Exchange",
    description: "ICP/USDT spot trading aktif di platform Bybit.",
    url: "https://www.bybit.com",
  },
  {
    name: "KuCoin",
    category: "Exchange",
    description: "ICP tersedia di pasar spot KuCoin.",
    url: "https://www.kucoin.com",
  },
  {
    name: "OKX",
    category: "Exchange",
    description: "ICP/USDT spot trading aktif di OKX.",
    url: "https://www.okx.com",
  },
  {
    name: "Kraken",
    category: "Exchange",
    description: "Mendukung listing & trading ICP.",
    url: "https://www.kraken.com",
  },
  {
    name: "Gate.io",
    category: "Exchange",
    description: "ICP/USDT trading pair tersedia di Gate.io.",
    url: "https://www.gate.io",
  },
  {
    name: "MEXC",
    category: "Exchange",
    description: "ICP/USDT pair tersedia di platform MEXC.",
    url: "https://www.mexc.com",
  },

  // Institutional Custody
  {
    name: "Coinbase Custody",
    category: "Institutional Custody",
    description: "Institutional custody untuk aset ICP dari Coinbase.",
    url: "https://custody.coinbase.com",
  },
  {
    name: "BitGo",
    category: "Institutional Custody",
    description: "Enterprise wallet & custody untuk aset ICP.",
    url: "https://www.bitgo.com",
  },
  {
    name: "Anchorage Digital",
    category: "Institutional Custody",
    description: "Regulated digital asset bank yang mendukung ICP.",
    url: "https://www.anchorage.com",
  },
  {
    name: "Fireblocks",
    category: "Institutional Custody",
    description: "Institutional digital asset platform mendukung ICP.",
    url: "https://www.fireblocks.com",
  },

  // Retail Wallet
  {
    name: "NNS Dapp",
    category: "Retail Wallet",
    description:
      "Official Internet Computer governance & wallet dApp untuk ICP.",
    url: "https://nns.ic0.app",
  },
  {
    name: "Plug Wallet",
    category: "Retail Wallet",
    description: "Browser wallet extension untuk ICP & Internet Computer.",
    url: "https://plugwallet.ooo",
  },
  {
    name: "Stoic Wallet",
    category: "Retail Wallet",
    description: "Web wallet untuk ICP dan ICRC tokens.",
    url: "https://www.stoicwallet.com",
  },
  {
    name: "AstroX ME",
    category: "Retail Wallet",
    description: "Mobile wallet untuk Internet Computer.",
    url: "https://astrox.me",
  },
  {
    name: "ICLight",
    category: "Retail Wallet",
    description: "Community wallet mendukung ekosistem ICP.",
    url: "https://iclight.io",
  },

  // Hardware Wallet
  {
    name: "Ledger",
    category: "Hardware Wallet",
    description: "Hardware wallet mendukung ICP via Ledger Live.",
    url: "https://www.ledger.com",
  },
  {
    name: "Trezor",
    category: "Hardware Wallet",
    description: "Hardware wallet dengan dukungan ICP.",
    url: "https://trezor.io",
  },

  // Developer
  {
    name: "DFINITY SDK",
    category: "Developer",
    description:
      "Official Motoko & Rust SDK untuk membangun di Internet Computer.",
    url: "https://sdk.dfinity.org",
  },
  {
    name: "Internet Computer GitHub",
    category: "Developer",
    description: "Source code dan tools resmi untuk ICP development.",
    url: "https://github.com/dfinity",
  },
  {
    name: "Candid",
    category: "Developer",
    description:
      "Interface description language untuk IC canisters dan interoperabilitas.",
    url: "https://internetcomputer.org/docs/current/developer-docs/smart-contracts/candid/candid-concepts",
  },
];

const FILTER_TABS: FilterTab[] = [
  "All",
  "Exchange",
  "Institutional Custody",
  "Retail Wallet",
  "Hardware Wallet",
  "Developer",
];

// ── Category Config ────────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<
  Category,
  {
    icon: React.ComponentType<{ className?: string }>;
    colorClass: string;
    bgClass: string;
    borderClass: string;
    glowClass: string;
  }
> = {
  Exchange: {
    icon: TrendingUp,
    colorClass: "eco-badge-exchange-text",
    bgClass: "eco-badge-exchange-bg",
    borderClass: "eco-badge-exchange-border",
    glowClass: "eco-card-hover-exchange",
  },
  "Institutional Custody": {
    icon: Shield,
    colorClass: "eco-badge-custody-text",
    bgClass: "eco-badge-custody-bg",
    borderClass: "eco-badge-custody-border",
    glowClass: "eco-card-hover-custody",
  },
  "Retail Wallet": {
    icon: Wallet,
    colorClass: "eco-badge-retail-text",
    bgClass: "eco-badge-retail-bg",
    borderClass: "eco-badge-retail-border",
    glowClass: "eco-card-hover-retail",
  },
  "Hardware Wallet": {
    icon: HardDrive,
    colorClass: "eco-badge-hardware-text",
    bgClass: "eco-badge-hardware-bg",
    borderClass: "eco-badge-hardware-border",
    glowClass: "eco-card-hover-hardware",
  },
  Developer: {
    icon: Code2,
    colorClass: "eco-badge-developer-text",
    bgClass: "eco-badge-developer-bg",
    borderClass: "eco-badge-developer-border",
    glowClass: "eco-card-hover-developer",
  },
};

const STATS = [
  { label: "Exchanges", count: 8, icon: TrendingUp },
  { label: "Institutional Custody", count: 4, icon: Shield },
  { label: "Retail Wallets", count: 5, icon: Wallet },
  { label: "Hardware Wallets", count: 2, icon: HardDrive },
  { label: "Developer SDKs", count: 3, icon: Code2 },
];

// ── CategoryBadge ──────────────────────────────────────────────────────────────
function CategoryBadge({ category }: { category: Category }) {
  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;
  return (
    <span
      className={`eco-badge ${config.bgClass} ${config.colorClass} ${config.borderClass}`}
    >
      <Icon className="w-3 h-3" />
      {category}
    </span>
  );
}

// ── PlatformCard ───────────────────────────────────────────────────────────────
function PlatformCard({
  platform,
  index,
}: {
  platform: Platform;
  index: number;
}) {
  const config = CATEGORY_CONFIG[platform.category];
  const Icon = config.icon;

  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`eco-platform-card group ${config.glowClass}`}
      style={{ animationDelay: `${Math.min(index * 0.04, 0.5)}s` }}
      aria-label={`Visit ${platform.name}`}
    >
      {/* Top accent line */}
      <div className={`eco-card-top-line ${config.colorClass}`} />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div
          className={`eco-card-icon-wrap ${config.bgClass} ${config.borderClass}`}
        >
          <Icon className={`w-4 h-4 ${config.colorClass}`} />
        </div>
        <ExternalLink className="eco-card-external-icon w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* Name */}
      <h3 className="eco-card-name">{platform.name}</h3>

      {/* Description */}
      <p className="eco-card-description">{platform.description}</p>

      {/* Category badge */}
      <div className="mt-auto pt-4">
        <CategoryBadge category={platform.category} />
      </div>
    </a>
  );
}

// ── FilterTabBar ───────────────────────────────────────────────────────────────
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
    <div className="eco-filter-bar">
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onSelect(tab)}
            className={`eco-filter-tab ${
              active === tab
                ? "eco-filter-tab-active"
                : "eco-filter-tab-inactive"
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
    </div>
  );
}

// ── NavBar (Ecosystem) ─────────────────────────────────────────────────────────
function EcoNavBar() {
  const [scrolled, setScrolled] = useState(false);

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
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="identity-logo-mark">
              <div className="identity-logo-inner" />
            </div>
            <span className="identity-nav-title">ICP Protocol</span>
            <span className="identity-beta-badge">Prototype</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: "Identity", href: "/" },
              { label: "Markets", href: "/markets" },
              { label: "Launchpad", href: "/launchpad" },
              { label: "Ecosystem", href: "/ecosystem" },
              { label: "Wallet", href: "/wallet" },
              { label: "Integration", href: "/integration" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`identity-nav-link ${link.href === "/ecosystem" ? "eco-nav-active" : ""}`}
                data-ocid={`nav.${link.label
                  .toLowerCase()
                  .replace(/\s+/g, "_")
                  .replace(/[^a-z0-9_]/g, "")}.link`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function EcosystemDirectoryPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return PLATFORMS.filter((p) => {
      const matchesCategory =
        activeFilter === "All" || p.category === activeFilter;
      const matchesSearch =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeFilter]);

  const counts = useMemo<Record<FilterTab, number>>(() => {
    const q = search.toLowerCase().trim();
    const base = PLATFORMS.filter(
      (p) =>
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
    return {
      All: base.length,
      Exchange: base.filter((p) => p.category === "Exchange").length,
      "Institutional Custody": base.filter(
        (p) => p.category === "Institutional Custody",
      ).length,
      "Retail Wallet": base.filter((p) => p.category === "Retail Wallet")
        .length,
      "Hardware Wallet": base.filter((p) => p.category === "Hardware Wallet")
        .length,
      Developer: base.filter((p) => p.category === "Developer").length,
    };
  }, [search]);

  return (
    <div className="identity-page">
      <EcoNavBar />

      <main>
        {/* ── Hero ── */}
        <section className="eco-hero relative overflow-hidden">
          <div className="identity-grid-overlay" />
          <div className="identity-orb identity-orb-1" />
          <div className="identity-orb identity-orb-2" />
          <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-36 pb-24 text-center">
            {/* Badge */}
            <div className="identity-eyebrow-badge mb-8 animate-fade-in-down">
              <Globe className="w-3.5 h-3.5" />
              Community Directory · ICP Protocol
            </div>

            {/* Title */}
            <h1
              className="identity-headline animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              ICP Ecosystem &amp;
              <br />
              <span className="eco-title-gradient">Partners Directory</span>
            </h1>

            <p
              className="identity-subheadline mt-6 max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Menyatukan semua partner resmi dan komunitas yang mendukung
              Internet Computer (ICP) dalam satu halaman — exchange, wallet,
              custody, dan developer tools.
            </p>

            {/* Stats bar */}
            <div
              className="eco-stats-bar mt-14 animate-fade-in"
              style={{ animationDelay: "0.35s" }}
            >
              {STATS.map(({ label, count, icon: Icon }) => (
                <div key={label} className="eco-stat-item">
                  <div className="eco-stat-count">{count}</div>
                  <div className="flex items-center gap-1.5 eco-stat-label">
                    <Icon className="w-3 h-3" />
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Directory ── */}
        <section className="identity-section relative">
          <div className="identity-section-divider" />
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            {/* Search + Filter */}
            <div className="eco-controls mb-10">
              {/* Search */}
              <div className="eco-search-wrap">
                <Search className="eco-search-icon w-4 h-4" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari platform, kategori, atau deskripsi..."
                  className="eco-search-input"
                  aria-label="Search platforms"
                />
              </div>

              {/* Filter tabs */}
              <FilterTabBar
                active={activeFilter}
                onSelect={setActiveFilter}
                counts={counts}
              />
            </div>

            {/* Results summary */}
            <div className="eco-results-summary mb-6">
              <span className="eco-results-count">{filtered.length}</span>
              <span className="eco-results-label">
                {filtered.length === 1 ? " platform" : " platforms"} found
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

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="eco-platform-grid">
                {filtered.map((platform, index) => (
                  <PlatformCard
                    key={platform.name}
                    platform={platform}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="eco-empty-state">
                <Globe className="w-10 h-10 eco-empty-icon" />
                <h3 className="eco-empty-title">No platforms found</h3>
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
                  Show all platforms
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── About Section ── */}
        <section className="identity-section relative eco-about-section">
          <div className="identity-section-divider" />
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <div className="identity-section-eyebrow mx-auto mb-4">
              <Building2 className="w-3.5 h-3.5" />
              About This Directory
            </div>
            <h2 className="identity-section-title mb-4">
              About This Directory
            </h2>
            <p
              className="identity-section-subtitle max-w-2xl mx-auto"
              style={{ lineHeight: "1.8" }}
            >
              Proyek independen ini dibuat untuk membantu developer, pengguna,
              dan institusi menemukan siapa saja bagian dari ekosistem ICP
              Protocol / Internet Computer — termasuk partner resmi, komunitas,
              dan inisiatif teknologi.
            </p>
          </div>
        </section>

        {/* ── Submit Section ── */}
        <section className="identity-section relative">
          <div className="identity-section-divider" />
          <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
            <div className="eco-submit-card">
              <div className="eco-submit-icon-wrap">
                <Key className="w-6 h-6 eco-submit-icon" />
              </div>
              <h2 className="identity-section-title mt-6 mb-3">
                Daftarkan Organisasi Anda
              </h2>
              <p className="identity-section-subtitle mb-8">
                Apakah platform Anda mendukung ICP Protocol? Ajukan untuk
                ditampilkan di direktori ini.
              </p>
              <button type="button" className="eco-submit-btn" disabled>
                <Users className="w-4 h-4" />
                Submit Platform
                <ChevronRight className="w-4 h-4" />
              </button>
              <p className="eco-submit-note mt-4">
                Submission form coming soon
              </p>
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
                ICP Protocol Ecosystem &amp; Partners Directory
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
                discover exchanges, wallets, and developer tools that support
                ICP Protocol and ICP token.
              </p>
            </div>
            <div>
              <h4 className="identity-footer-heading mb-4">
                <Mail className="w-4 h-4" />
                Contact
              </h4>
              <p className="identity-footer-body">
                To add or update a listing, or for partnership inquiries:
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
    </div>
  );
}
