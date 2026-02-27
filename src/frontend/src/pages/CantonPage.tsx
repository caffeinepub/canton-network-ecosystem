import { useEffect, useRef, useState, useMemo } from "react";
import {
  Building2,
  Globe,
  HardDrive,
  Shield,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Code2,
  ChevronDown,
  ExternalLink,
  ArrowRight,
  Hexagon,
  Network,
  Lock,
  Search,
  X,
  Info,
  Send,
  Users,
  CheckCircle2,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type PartnerCategory =
  | "Exchange"
  | "Custody"
  | "Infrastructure"
  | "Developer"
  | "Retail Wallet"
  | "Hardware";

interface Partner {
  name: string;
  category: PartnerCategory;
  description: string;
  url: string;
  meta?: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

// ── Data ────────────────────────────────────────────────────────────────────

const PARTNERS: Partner[] = [
  // Exchange
  {
    name: "Bybit",
    category: "Exchange",
    description:
      "Spot trading CC tersedia dengan likuiditas tinggi dan antarmuka trading profesional.",
    meta: "#3 Global",
    url: "https://www.bybit.com",
    icon: TrendingUp,
  },
  {
    name: "MEXC",
    category: "Exchange",
    description:
      "CC/USDT trading pair tersedia. Salah satu exchange dengan listing tercepat.",
    meta: "Top 10",
    url: "https://www.mexc.com",
    icon: TrendingUp,
  },
  {
    name: "KuCoin",
    category: "Exchange",
    description:
      "CC tersedia di pasar spot KuCoin, dikenal sebagai 'Exchange for Everyone'.",
    meta: "Top 20",
    url: "https://www.kucoin.com",
    icon: TrendingUp,
  },
  {
    name: "Gate",
    category: "Exchange",
    description:
      "Gate.io mendukung CC dengan pasangan CC/USDT dan volume yang kompetitif.",
    meta: "Top 10",
    url: "https://www.gate.io",
    icon: TrendingUp,
  },
  {
    name: "Kraken",
    category: "Exchange",
    description:
      "Mendukung listing & trading CC. Salah satu exchange paling terpercaya di dunia.",
    meta: "#2 US",
    url: "https://www.kraken.com",
    icon: TrendingUp,
  },
  {
    name: "OKX",
    category: "Exchange",
    description:
      "CC/USDT spot trading aktif di OKX, platform derivatif & spot terkemuka global.",
    meta: "Top 5",
    url: "https://www.okx.com",
    icon: TrendingUp,
  },

  // Custody
  {
    name: "BitGo",
    category: "Custody",
    description:
      "Penyimpanan tingkat institusional untuk CC dengan keamanan multi-signature terdepan.",
    meta: "Multi-Sig Custody",
    icon: Shield,
    url: "https://www.bitgo.com",
  },
  {
    name: "Blockdaemon",
    category: "Custody",
    description: "Provider self-custody & node infrastructure untuk Canton Network.",
    meta: "Node & Custody",
    icon: Network,
    url: "https://www.blockdaemon.com",
  },
  {
    name: "Copper",
    category: "Custody",
    description:
      "Custody & layanan manajemen aset institusional dengan ClearLoop settlement.",
    meta: "Prime Custody",
    icon: Lock,
    url: "https://copper.co",
  },
  {
    name: "Dfns",
    category: "Custody",
    description:
      "Enterprise wallet infrastructure dengan API-first approach untuk institusi keuangan.",
    meta: "Enterprise API",
    icon: Code2,
    url: "https://www.dfns.co",
  },
  {
    name: "Unit410",
    category: "Custody",
    description:
      "Enterprise-grade wallet solution dengan dukungan penuh untuk Canton Network.",
    meta: "Enterprise Grade",
    icon: Building2,
    url: "https://unit410.com",
  },
  {
    name: "Zodia Custody",
    category: "Custody",
    description:
      "Institutional custodian yang mendukung CC, didukung oleh Standard Chartered.",
    meta: "Bank-Grade",
    icon: ShieldCheck,
    url: "https://zodiacustody.com",
  },

  // Infrastructure
  {
    name: "Blockdaemon",
    category: "Infrastructure",
    description:
      "Infrastruktur node terpercaya untuk Canton Network, menyediakan validator dan staking services.",
    meta: "Node Operator",
    icon: Network,
    url: "https://www.blockdaemon.com",
  },

  // Developer
  {
    name: "Digital Asset Wallet SDK",
    category: "Developer",
    description:
      "SDK resmi untuk pengembang yang ingin mengintegrasikan dukungan Canton Network ke dalam aplikasi atau wallet mereka.",
    meta: "Official SDK",
    icon: Code2,
    url: "https://www.digitalasset.com/canton",
  },

  // Retail Wallet
  {
    name: "Bron Wallet",
    category: "Retail Wallet",
    description:
      "Dompet non-custodial untuk CC dengan antarmuka yang intuitif dan aman.",
    meta: "Non-Custodial",
    icon: Wallet,
    url: "https://bronwallet.com",
  },
  {
    name: "Console Wallet",
    category: "Retail Wallet",
    description: "Dukungan penuh token CC dengan fitur manajemen portofolio lengkap.",
    meta: "Full CC Support",
    icon: Wallet,
    url: "https://console.finance",
  },
  {
    name: "Loop",
    category: "Retail Wallet",
    description:
      "Wallet retail dengan akses CC yang mudah dan pengalaman pengguna terbaik.",
    meta: "User-Friendly",
    icon: Wallet,
    url: "https://loop.markets",
  },
  {
    name: "Republic Wallet",
    category: "Retail Wallet",
    description:
      "Dompet yang mendukung CC dengan ekosistem investasi terintegrasi.",
    meta: "Integrated",
    icon: Wallet,
    url: "https://republic.com",
  },
  {
    name: "Send Wallet",
    category: "Retail Wallet",
    description:
      "Wallet retail & pengelolaan CC dengan fitur pengiriman aset yang mudah.",
    meta: "Easy Transfers",
    icon: Wallet,
    url: "https://sendwallet.net",
  },
  {
    name: "Zoro Wallet",
    category: "Retail Wallet",
    description: "Wallet retail + fitur swap CC yang memudahkan pertukaran aset.",
    meta: "Built-in Swap",
    icon: Wallet,
    url: "https://zoro.finance",
  },
  {
    name: "Cantor8",
    category: "Retail Wallet",
    description:
      "Wallet yang mendukung Canton Network dengan fokus pada keamanan dan kemudahan.",
    meta: "Canton Native",
    icon: Wallet,
    url: "https://cantor8.io",
  },

  // Hardware
  {
    name: "Cypherock X1",
    category: "Hardware",
    description:
      "Hardware wallet yang mendukung CIP-56 (standar token Canton Network). Keamanan tingkat tertinggi untuk penyimpanan CC secara offline.",
    meta: "CIP-56 Standard",
    icon: HardDrive,
    url: "https://www.cypherock.com",
  },
];

const CATEGORY_ORDER: PartnerCategory[] = [
  "Exchange",
  "Custody",
  "Infrastructure",
  "Developer",
  "Retail Wallet",
  "Hardware",
];

type BadgeVariant = "gold" | "blue" | "green" | "purple";

const CATEGORY_BADGE: Record<PartnerCategory, BadgeVariant> = {
  Exchange: "gold",
  Custody: "blue",
  Infrastructure: "blue",
  Developer: "blue",
  "Retail Wallet": "green",
  Hardware: "purple",
};

const BADGE_STYLES: Record<
  BadgeVariant,
  { bg: string; text: string; border: string; shadow: string }
> = {
  gold: {
    bg: "oklch(0.76 0.12 80 / 0.12)",
    text: "oklch(0.85 0.15 78)",
    border: "oklch(0.76 0.12 80 / 0.35)",
    shadow: "0 0 16px oklch(0.76 0.12 80 / 0.2)",
  },
  blue: {
    bg: "oklch(0.65 0.18 240 / 0.12)",
    text: "oklch(0.78 0.18 240)",
    border: "oklch(0.65 0.18 240 / 0.35)",
    shadow: "0 0 16px oklch(0.65 0.18 240 / 0.2)",
  },
  green: {
    bg: "oklch(0.68 0.18 150 / 0.12)",
    text: "oklch(0.78 0.18 150)",
    border: "oklch(0.68 0.18 150 / 0.35)",
    shadow: "0 0 16px oklch(0.68 0.18 150 / 0.2)",
  },
  purple: {
    bg: "oklch(0.62 0.2 295 / 0.12)",
    text: "oklch(0.75 0.2 295)",
    border: "oklch(0.62 0.2 295 / 0.35)",
    shadow: "0 0 16px oklch(0.62 0.2 295 / 0.2)",
  },
};

// ── NavBar ───────────────────────────────────────────────────────────────────

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Directory", href: "#directory" },
    { label: "Exchange", href: "#exchange" },
    { label: "Custody", href: "#custody" },
    { label: "Developer", href: "#developer" },
    { label: "Infrastructure", href: "#infrastructure" },
    { label: "Submit", href: "#submit" },
  ];

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-canton-deep/95 backdrop-blur-md border-b border-white/8 shadow-xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/canton-logo-transparent.dim_200x80.png"
              alt="Canton Network"
              className="h-9 md:h-11 w-auto object-contain"
            />
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg font-grotesk ${
                  link.label === "Submit"
                    ? "text-canton-gold hover:bg-canton-gold/10"
                    : "text-white/60 hover:text-canton-gold hover:bg-white/5"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center">
            <button
              type="button"
              onClick={() => handleNav("#submit")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold font-grotesk transition-all duration-200"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.76 0.12 80), oklch(0.68 0.1 60))",
                color: "oklch(0.10 0.025 255)",
                boxShadow: "0 0 20px oklch(0.76 0.12 80 / 0.3)",
              }}
            >
              Submit Partner
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 text-white/70 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-0.5 bg-current mb-1.5 transition-all" />
            <div className="w-5 h-0.5 bg-current mb-1.5 transition-all" />
            <div className="w-3 h-0.5 bg-current transition-all ml-auto" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/8 bg-canton-deep/98 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="block w-full text-left px-3 py-3 text-sm font-medium text-white/70 hover:text-canton-gold hover:bg-white/5 rounded-lg transition-colors font-grotesk"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

// ── HeroSection ──────────────────────────────────────────────────────────────

function HeroSection() {
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const totalPartners = PARTNERS.length;
  const uniqueCategories = CATEGORY_ORDER.length;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden canton-hero-bg">
      {/* Hex grid overlay */}
      <div className="absolute inset-0 hex-bg opacity-100 pointer-events-none" />

      {/* Animated orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full blur-3xl"
          style={{
            width: "600px",
            height: "600px",
            top: "-200px",
            right: "-100px",
            background:
              "radial-gradient(circle, oklch(0.65 0.18 240 / 0.08) 0%, transparent 70%)",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl"
          style={{
            width: "500px",
            height: "500px",
            bottom: "-150px",
            left: "-100px",
            background:
              "radial-gradient(circle, oklch(0.76 0.12 80 / 0.07) 0%, transparent 70%)",
            animation: "float 10s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute rounded-full blur-2xl"
          style={{
            width: "300px",
            height: "300px",
            top: "40%",
            left: "60%",
            background:
              "radial-gradient(circle, oklch(0.62 0.2 295 / 0.06) 0%, transparent 70%)",
            animation: "float 6s ease-in-out infinite 2s",
          }}
        />
      </div>

      {/* Diagonal line accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, transparent 45%, oklch(0.76 0.12 80 / 0.03) 45.5%, oklch(0.76 0.12 80 / 0.03) 46%, transparent 46.5%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-4xl">
          {/* Eyebrow tag */}
          <div className="animate-fade-in flex items-center gap-2 mb-6">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold font-mono-dm tracking-wider uppercase"
              style={{
                background: "oklch(0.76 0.12 80 / 0.12)",
                border: "1px solid oklch(0.76 0.12 80 / 0.3)",
                color: "oklch(0.85 0.15 78)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "oklch(0.85 0.15 78)",
                  boxShadow: "0 0 8px oklch(0.85 0.15 78)",
                }}
              />
              Community Directory
            </div>
          </div>

          {/* Main headline */}
          <h1
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="text-white">Canton Network</span>
            <br />
            <span className="text-white">Ecosystem & </span>
            <span className="text-gradient-gold">Partners Directory</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-white/55 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mb-10 animate-fade-in-up font-grotesk"
            style={{ animationDelay: "0.2s" }}
          >
            Menyatukan semua organisasi yang membangun dan mendukung ekosistem
            Canton Network dalam satu halaman untuk memudahkan pencarian dan
            kolaborasi.
          </p>

          {/* Stats row */}
          <div
            className="flex flex-wrap gap-6 mb-12 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            {[
              { value: `${totalPartners}`, label: "Total Partners" },
              { value: `${uniqueCategories}`, label: "Kategori" },
              { value: "6", label: "Exchange Global" },
              { value: "6", label: "Custody Partner" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-display text-3xl font-bold text-gradient-gold">
                  {stat.value}+
                </span>
                <span className="text-white/40 text-xs font-grotesk mt-0.5 tracking-wide uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <button
              type="button"
              onClick={() => handleScroll("directory")}
              className="group flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold font-grotesk transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.76 0.12 80), oklch(0.68 0.1 60))",
                color: "oklch(0.10 0.025 255)",
                boxShadow:
                  "0 0 32px oklch(0.76 0.12 80 / 0.35), 0 4px 16px oklch(0.10 0.025 255 / 0.5)",
              }}
            >
              <Search className="w-4 h-4" />
              Jelajahi Direktori
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("submit")}
              className="group flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold font-grotesk transition-all duration-300 text-white/80 hover:text-white"
              style={{
                background: "oklch(0.22 0.04 255 / 0.5)",
                border: "1px solid oklch(0.76 0.12 80 / 0.25)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Send className="w-4 h-4" />
              Submit Organisasi
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-fade-in"
        style={{ animationDelay: "1s" }}
      >
        <span className="text-xs font-grotesk tracking-widest uppercase">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
}

// ── AboutSection ─────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-20"
      style={{ background: "oklch(0.115 0.028 255)" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.76 0.12 80 / 0.2), transparent)",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Icon + title */}
            <div className="shrink-0 flex flex-col items-center md:items-start gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: "oklch(0.76 0.12 80 / 0.1)",
                  border: "1px solid oklch(0.76 0.12 80 / 0.25)",
                }}
              >
                <Info className="w-7 h-7" style={{ color: "oklch(0.85 0.15 78)" }} />
              </div>
              <span
                className="text-xs font-mono-dm font-medium tracking-widest uppercase px-3 py-1 rounded-full whitespace-nowrap"
                style={{
                  color: "oklch(0.85 0.15 78)",
                  background: "oklch(0.76 0.12 80 / 0.08)",
                  border: "1px solid oklch(0.76 0.12 80 / 0.2)",
                }}
              >
                Tentang Direktori
              </span>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                About This Directory
              </h2>
              <p className="text-white/55 font-grotesk leading-relaxed mb-6 text-base md:text-lg">
                Proyek independen ini dibuat untuk membantu developer, pengguna, dan
                institusi menemukan siapa saja yang menjadi bagian dari ekosistem Canton
                Network — termasuk partner resmi, komunitas, dan inisiatif teknologi.
              </p>
              <p className="text-white/40 font-grotesk leading-relaxed text-sm">
                Direktori ini bukan afiliasi resmi Canton Network atau Digital Asset. Data
                dikumpulkan dari sumber publik dan diperbarui secara berkala oleh komunitas.
                Jika organisasi kamu belum terdaftar atau ada informasi yang perlu
                diperbarui, silakan{" "}
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("submit");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="underline underline-offset-2 hover:text-white/70 transition-colors"
                  style={{ color: "oklch(0.85 0.15 78)" }}
                >
                  kirimkan melalui form
                </button>
                .
              </p>

              {/* Quick facts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                {[
                  {
                    icon: Users,
                    label: "Komunitas Driven",
                    desc: "Data dikurasi oleh komunitas Canton",
                  },
                  {
                    icon: CheckCircle2,
                    label: "Data Terverifikasi",
                    desc: "Setiap entry diverifikasi dari sumber resmi",
                  },
                  {
                    icon: Globe,
                    label: "Open Directory",
                    desc: "Terbuka untuk semua partner ekosistem",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{
                      background: "oklch(0.14 0.03 255 / 0.6)",
                      border: "1px solid oklch(0.28 0.04 255 / 0.4)",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: "oklch(0.76 0.12 80 / 0.1)",
                        border: "1px solid oklch(0.76 0.12 80 / 0.2)",
                      }}
                    >
                      <item.icon
                        className="w-4 h-4"
                        style={{ color: "oklch(0.85 0.15 78)" }}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white/80 font-grotesk mb-0.5">
                        {item.label}
                      </div>
                      <div className="text-xs text-white/35 font-grotesk">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── PlatformCard ─────────────────────────────────────────────────────────────

interface PlatformCardProps {
  partner: Partner;
  delay?: number;
}

function PlatformCard({ partner, delay = 0 }: PlatformCardProps) {
  const [hovered, setHovered] = useState(false);
  const badgeVariant = CATEGORY_BADGE[partner.category];
  const styles = BADGE_STYLES[badgeVariant];
  const Icon = partner.icon;

  const cardStyle: React.CSSProperties = {
    background: hovered
      ? "linear-gradient(135deg, oklch(0.20 0.04 255), oklch(0.18 0.04 255))"
      : "oklch(0.165 0.035 255)",
    border: `1px solid ${
      hovered
        ? styles.border
        : "oklch(0.28 0.04 255 / 0.4)"
    }`,
    boxShadow: hovered
      ? `${styles.shadow}, 0 8px 24px oklch(0.08 0.02 255 / 0.6)`
      : "0 2px 8px oklch(0.08 0.02 255 / 0.5)",
    transform: hovered ? "translateY(-2px)" : "translateY(0)",
    transition: "all 0.2s ease",
    animationDelay: `${delay}s`,
    animationFillMode: "both",
    textDecoration: "none",
    display: "block",
    color: "inherit",
  };

  const cardContent = (
    <>
      {/* Subtle top shimmer on hover */}
      <div
        className="absolute top-0 left-6 right-6 h-px rounded-full transition-all duration-300"
        style={{
          background: hovered
            ? `linear-gradient(90deg, transparent, ${styles.text}, transparent)`
            : "transparent",
          opacity: hovered ? 0.5 : 0,
        }}
      />

      {/* ExternalLink icon */}
      <div
        className="absolute top-4 right-4 transition-all duration-200"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered
            ? "scale(1) translate(0, 0)"
            : "scale(0.8) translate(2px, -2px)",
        }}
      >
        <ExternalLink className="w-3.5 h-3.5" style={{ color: styles.text }} />
      </div>

      <div className="flex items-start gap-4">
        {/* Icon area */}
        <div
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
          style={{
            background: styles.bg,
            border: `1px solid ${styles.border}`,
          }}
        >
          {Icon ? (
            <Icon className="w-5 h-5" style={{ color: styles.text }} />
          ) : (
            <Hexagon className="w-5 h-5" style={{ color: styles.text }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Badge + meta row */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold font-mono-dm tracking-wide"
              style={{
                background: styles.bg,
                border: `1px solid ${styles.border}`,
                color: styles.text,
              }}
            >
              {partner.category}
            </span>
            {partner.meta && (
              <span className="text-xs font-grotesk text-white/30">
                {partner.meta}
              </span>
            )}
          </div>

          {/* Name */}
          <h3
            className="font-display text-base font-semibold mb-1.5 transition-colors duration-200"
            style={{
              color: hovered ? "oklch(0.96 0.008 250)" : "oklch(0.88 0.008 250)",
            }}
          >
            {partner.name}
          </h3>

          {/* Description */}
          <p className="text-sm leading-relaxed text-white/40 font-grotesk">
            {partner.description}
          </p>
        </div>
      </div>
    </>
  );

  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded-2xl p-5 canton-card cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={cardStyle}
    >
      {cardContent}
    </a>
  );
}

// ── SectionHeader ─────────────────────────────────────────────────────────────

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  accentColor = "gold",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  accentColor?: "gold" | "blue" | "green" | "purple";
}) {
  const colorMap = {
    gold: "oklch(0.85 0.15 78)",
    blue: "oklch(0.78 0.18 240)",
    green: "oklch(0.78 0.18 150)",
    purple: "oklch(0.75 0.2 295)",
  };
  const borderMap = {
    gold: "oklch(0.76 0.12 80 / 0.25)",
    blue: "oklch(0.65 0.18 240 / 0.25)",
    green: "oklch(0.68 0.18 150 / 0.25)",
    purple: "oklch(0.62 0.2 295 / 0.25)",
  };
  const bgMap = {
    gold: "oklch(0.76 0.12 80 / 0.08)",
    blue: "oklch(0.65 0.18 240 / 0.08)",
    green: "oklch(0.68 0.18 150 / 0.08)",
    purple: "oklch(0.62 0.2 295 / 0.08)",
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-px h-8"
          style={{
            background: `linear-gradient(to bottom, transparent, ${colorMap[accentColor]}, transparent)`,
          }}
        />
        <span
          className="text-xs font-mono-dm font-medium tracking-widest uppercase px-3 py-1 rounded-full"
          style={{
            color: colorMap[accentColor],
            background: bgMap[accentColor],
            border: `1px solid ${borderMap[accentColor]}`,
          }}
        >
          {eyebrow}
        </span>
      </div>
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
        {title}
      </h2>
      <p className="text-white/45 text-base font-grotesk max-w-2xl">{subtitle}</p>
    </div>
  );
}

// ── DirectorySection (Search + Filter + All partners) ────────────────────────

const FILTER_OPTIONS: Array<{ label: string; value: PartnerCategory | "All" }> = [
  { label: "All", value: "All" },
  { label: "Exchange", value: "Exchange" },
  { label: "Custody", value: "Custody" },
  { label: "Infrastructure", value: "Infrastructure" },
  { label: "Developer", value: "Developer" },
  { label: "Retail Wallet", value: "Retail Wallet" },
  { label: "Hardware", value: "Hardware" },
];

const SECTION_ACCENT: Record<PartnerCategory, "gold" | "blue" | "green" | "purple"> = {
  Exchange: "gold",
  Custody: "blue",
  Infrastructure: "blue",
  Developer: "blue",
  "Retail Wallet": "green",
  Hardware: "purple",
};

const SECTION_SUBTITLE: Record<PartnerCategory, string> = {
  Exchange:
    "Exchange resmi yang mendukung trading token CC dengan pasangan USDT dan volume terbesar.",
  Custody:
    "Solusi penyimpanan tingkat institusional untuk manajemen aset CC skala besar.",
  Infrastructure:
    "Infrastruktur node dan validator yang mendukung Canton Network.",
  Developer:
    "Tools dan SDK untuk membangun di atas Canton Network dan mengintegrasikan dukungan token CC.",
  "Retail Wallet":
    "Dompet non-custodial untuk pengguna individu yang ingin mengelola aset CC secara mandiri.",
  Hardware:
    "Keamanan tertinggi dengan cold storage untuk penyimpanan CC secara offline.",
};

function DirectorySection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<PartnerCategory | "All">("All");

  const filteredPartners = useMemo(() => {
    return PARTNERS.filter((p) => {
      const matchesCategory =
        activeFilter === "All" || p.category === activeFilter;
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  // Group filtered partners by category for rendering
  const groupedPartners = useMemo(() => {
    const grouped: Partial<Record<PartnerCategory, Partner[]>> = {};
    for (const category of CATEGORY_ORDER) {
      const items = filteredPartners.filter((p) => p.category === category);
      if (items.length > 0) {
        grouped[category] = items;
      }
    }
    return grouped;
  }, [filteredPartners]);

  const hasResults = filteredPartners.length > 0;
  const isSearching = searchQuery !== "" || activeFilter !== "All";

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveFilter("All");
  };

  return (
    <section id="directory" className="relative py-24 canton-section-bg">
      <div className="absolute inset-0 hex-bg opacity-40 pointer-events-none" />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.76 0.12 80 / 0.2), transparent)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-px h-8"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, oklch(0.85 0.15 78), transparent)",
              }}
            />
            <span
              className="text-xs font-mono-dm font-medium tracking-widest uppercase px-3 py-1 rounded-full"
              style={{
                color: "oklch(0.85 0.15 78)",
                background: "oklch(0.76 0.12 80 / 0.08)",
                border: "1px solid oklch(0.76 0.12 80 / 0.2)",
              }}
            >
              Partner Directory
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Ekosistem Partner
          </h2>
          <p className="text-white/45 text-base md:text-lg font-grotesk max-w-2xl">
            {PARTNERS.length}+ organisasi yang mendukung Canton Network — dari exchange
            global hingga developer tools.
          </p>
        </div>

        {/* Search + Filter Controls */}
        <div className="mb-10 space-y-4">
          {/* Search input */}
          <div className="relative max-w-lg">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "oklch(0.65 0.03 255)" }}
            />
            <input
              type="text"
              placeholder="Cari partner... (nama atau deskripsi)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-xl text-sm font-grotesk outline-none transition-all duration-200"
              style={{
                background: "oklch(0.165 0.035 255)",
                border: `1px solid ${
                  searchQuery
                    ? "oklch(0.76 0.12 80 / 0.5)"
                    : "oklch(0.28 0.04 255 / 0.4)"
                }`,
                color: "oklch(0.90 0.008 250)",
                boxShadow: searchQuery
                  ? "0 0 0 3px oklch(0.76 0.12 80 / 0.1)"
                  : "none",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                style={{ color: "oklch(0.65 0.03 255)" }}
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category filter tabs */}
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((option) => {
              const isActive = activeFilter === option.value;
              const badgeVariant =
                option.value === "All"
                  ? "gold"
                  : CATEGORY_BADGE[option.value as PartnerCategory];
              const styles = BADGE_STYLES[badgeVariant];
              const count =
                option.value === "All"
                  ? PARTNERS.length
                  : PARTNERS.filter((p) => p.category === option.value).length;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setActiveFilter(option.value)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold font-grotesk transition-all duration-200"
                  style={{
                    background: isActive ? styles.bg : "oklch(0.165 0.035 255)",
                    border: `1px solid ${
                      isActive ? styles.border : "oklch(0.28 0.04 255 / 0.4)"
                    }`,
                    color: isActive ? styles.text : "oklch(0.60 0.03 255)",
                    boxShadow: isActive ? styles.shadow : "none",
                  }}
                >
                  {option.label}
                  <span
                    className="px-1.5 py-0.5 rounded-full text-xs font-mono-dm"
                    style={{
                      background: isActive ? styles.border : "oklch(0.22 0.04 255)",
                      color: isActive ? styles.text : "oklch(0.50 0.03 255)",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active filter indicator */}
          {isSearching && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-grotesk text-white/40">
                {filteredPartners.length} partner ditemukan
              </span>
              <button
                type="button"
                onClick={handleClearSearch}
                className="flex items-center gap-1 text-xs font-grotesk transition-colors"
                style={{ color: "oklch(0.85 0.15 78)" }}
              >
                <X className="w-3 h-3" />
                Reset filter
              </button>
            </div>
          )}
        </div>

        {/* Partner grid by category */}
        {hasResults ? (
          <div className="space-y-16">
            {(Object.keys(groupedPartners) as PartnerCategory[]).map((category) => {
              const partners = groupedPartners[category] ?? [];
              const accent = SECTION_ACCENT[category];
              const subtitle = SECTION_SUBTITLE[category];
              const sectionId = category.toLowerCase().replace(/\s+/g, "-");

              return (
                <div key={category} id={sectionId}>
                  <SectionHeader
                    eyebrow={category}
                    title={category === "Exchange" ? "Platform Perdagangan"
                      : category === "Custody" ? "Custody & Trust"
                      : category === "Infrastructure" ? "Infrastructure & Validators"
                      : category === "Developer" ? "Developer Tooling"
                      : category === "Retail Wallet" ? "Retail Wallets"
                      : "Hardware Wallets"}
                    subtitle={subtitle}
                    accentColor={accent}
                  />
                  <div
                    className={`grid gap-4 ${
                      partners.length === 1
                        ? "grid-cols-1 max-w-lg"
                        : partners.length === 2
                        ? "grid-cols-1 sm:grid-cols-2 max-w-2xl"
                        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    }`}
                  >
                    {partners.map((partner, i) => (
                      <PlatformCard
                        key={`${partner.name}-${partner.category}`}
                        partner={partner}
                        delay={i * 0.08}
                      />
                    ))}
                  </div>

                  {/* Note for Exchange section */}
                  {category === "Exchange" && activeFilter === "All" && !searchQuery && (
                    <div
                      className="mt-6 px-5 py-4 rounded-xl flex items-start gap-3"
                      style={{
                        background: "oklch(0.76 0.12 80 / 0.06)",
                        border: "1px solid oklch(0.76 0.12 80 / 0.15)",
                      }}
                    >
                      <Globe
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: "oklch(0.85 0.15 78)" }}
                      />
                      <p className="text-sm font-grotesk text-white/50">
                        <span
                          style={{ color: "oklch(0.85 0.15 78)" }}
                          className="font-medium"
                        >
                          Catatan:
                        </span>{" "}
                        Token CC juga dilaporkan tersedia di banyak listing mayor lainnya
                        di pasar global. Daftar di atas mencakup exchange utama yang telah
                        terkonfirmasi.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{
                background: "oklch(0.165 0.035 255)",
                border: "1px solid oklch(0.28 0.04 255 / 0.4)",
              }}
            >
              <Search className="w-7 h-7" style={{ color: "oklch(0.50 0.03 255)" }} />
            </div>
            <h3 className="font-display text-xl font-semibold text-white/60 mb-2">
              Tidak ada hasil ditemukan
            </h3>
            <p className="text-sm font-grotesk text-white/35 mb-6 max-w-xs">
              Coba kata kunci lain atau reset filter untuk melihat semua partner.
            </p>
            <button
              type="button"
              onClick={handleClearSearch}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold font-grotesk transition-all duration-200"
              style={{
                background: "oklch(0.76 0.12 80 / 0.1)",
                border: "1px solid oklch(0.76 0.12 80 / 0.25)",
                color: "oklch(0.85 0.15 78)",
              }}
            >
              <X className="w-4 h-4" />
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ── SubmitSection ─────────────────────────────────────────────────────────────

function SubmitSection() {
  return (
    <section
      id="submit"
      className="relative py-24"
      style={{ background: "oklch(0.115 0.028 255)" }}
    >
      <div className="absolute inset-0 hex-bg opacity-30 pointer-events-none" />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.76 0.12 80 / 0.2), transparent)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="flex justify-center mb-6">
            <span
              className="text-xs font-mono-dm font-medium tracking-widest uppercase px-3 py-1 rounded-full"
              style={{
                color: "oklch(0.85 0.15 78)",
                background: "oklch(0.76 0.12 80 / 0.08)",
                border: "1px solid oklch(0.76 0.12 80 / 0.2)",
              }}
            >
              Submit Partner
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Daftarkan Organisasi Kamu
          </h2>

          <p className="text-white/50 font-grotesk text-base md:text-lg leading-relaxed mb-10">
            Kalau organisasi kamu belum terdaftar, kirim detailnya agar bisa ditambahkan
            ke direktori ini. Kami menerima submission dari exchange, wallet, validator,
            developer tools, dan semua inisiatif yang mendukung Canton Network.
          </p>

          {/* Card */}
          <div
            className="relative rounded-2xl p-8 md:p-10 text-left overflow-hidden"
            style={{
              background: "oklch(0.165 0.035 255)",
              border: "1px solid oklch(0.76 0.12 80 / 0.2)",
              boxShadow: "0 0 60px oklch(0.76 0.12 80 / 0.08)",
            }}
          >
            {/* Decorative gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, oklch(0.76 0.12 80 / 0.05) 0%, transparent 60%)",
              }}
            />
            {/* Top line */}
            <div
              className="absolute top-0 left-16 right-16 h-px rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.76 0.12 80 / 0.5), transparent)",
              }}
            />

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Icon */}
              <div
                className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: "oklch(0.76 0.12 80 / 0.1)",
                  border: "1px solid oklch(0.76 0.12 80 / 0.3)",
                }}
              >
                <Send className="w-8 h-8" style={{ color: "oklch(0.85 0.15 78)" }} />
              </div>

              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-white mb-2">
                  Submit Your Organization
                </h3>
                <p className="text-white/45 font-grotesk text-sm leading-relaxed mb-5">
                  Isi form berikut dengan informasi organisasi kamu: nama, kategori, URL
                  resmi, dan deskripsi singkat. Tim kami akan mereview dan menambahkan ke
                  direktori dalam 2-3 hari kerja.
                </p>

                {/* What we accept */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    "Exchange",
                    "Custody",
                    "Retail Wallet",
                    "Developer Tools",
                    "Infrastructure",
                    "Hardware",
                    "Community",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-lg font-grotesk"
                      style={{
                        background: "oklch(0.22 0.04 255)",
                        color: "oklch(0.65 0.03 255)",
                        border: "1px solid oklch(0.28 0.04 255 / 0.5)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://forms.gle/cantonpartner"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold font-grotesk transition-all duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.76 0.12 80), oklch(0.68 0.1 60))",
                      color: "oklch(0.10 0.025 255)",
                      boxShadow: "0 0 24px oklch(0.76 0.12 80 / 0.3)",
                    }}
                  >
                    <Send className="w-4 h-4" />
                    Submit via Google Form
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                  <a
                    href="mailto:cantonecosystem@proton.me"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold font-grotesk transition-all duration-300 text-white/70 hover:text-white"
                    style={{
                      background: "oklch(0.22 0.04 255 / 0.5)",
                      border: "1px solid oklch(0.28 0.04 255 / 0.5)",
                    }}
                  >
                    <Globe className="w-4 h-4" />
                    Email Langsung
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social tip */}
          <div
            className="mt-8 px-5 py-4 rounded-xl flex items-start gap-3 text-left"
            style={{
              background: "oklch(0.65 0.18 240 / 0.06)",
              border: "1px solid oklch(0.65 0.18 240 / 0.15)",
            }}
          >
            <Globe
              className="w-4 h-4 mt-0.5 shrink-0"
              style={{ color: "oklch(0.78 0.18 240)" }}
            />
            <p className="text-sm font-grotesk text-white/50">
              <span style={{ color: "oklch(0.78 0.18 240)" }} className="font-medium">
                Spread the word:
              </span>{" "}
              Tag{" "}
              <a
                href="https://twitter.com/CantonNetwork"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-white/70 transition-colors"
                style={{ color: "oklch(0.78 0.18 240)" }}
              >
                @CantonNetwork
              </a>{" "}
              di X/Twitter untuk memberitahu bahwa direktori ini ada dan terbuka untuk
              semua partner ekosistem.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────

function CantonFooter() {
  const navLinks = [
    { label: "Directory", href: "#directory" },
    { label: "Exchange", href: "#exchange" },
    { label: "Custody", href: "#custody" },
    { label: "Developer", href: "#developer" },
    { label: "Infrastructure", href: "#infrastructure" },
    { label: "Submit", href: "#submit" },
  ];

  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      className="relative pt-16 pb-8"
      style={{
        background: "oklch(0.09 0.022 255)",
        borderTop: "1px solid oklch(0.28 0.04 255 / 0.3)",
      }}
    >
      <div className="absolute inset-0 hex-bg opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <img
              src="/assets/generated/canton-logo-transparent.dim_200x80.png"
              alt="Canton Network"
              className="h-10 w-auto object-contain mb-4"
            />
            <p className="text-white/35 text-sm font-grotesk leading-relaxed max-w-xs">
              Direktori komunitas independen untuk ekosistem Canton Network. Membantu
              developer, pengguna, dan institusi menavigasi ekosistem.
            </p>

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full"
              style={{
                background: "oklch(0.76 0.12 80 / 0.08)",
                border: "1px solid oklch(0.76 0.12 80 / 0.2)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: "oklch(0.85 0.15 78)",
                  boxShadow: "0 0 6px oklch(0.85 0.15 78)",
                }}
              />
              <span
                className="text-xs font-mono-dm font-semibold tracking-wider"
                style={{ color: "oklch(0.85 0.15 78)" }}
              >
                Community Directory
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">
              Navigasi
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.href)}
                    className="text-sm font-grotesk text-white/35 hover:text-white/70 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span
                      className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "oklch(0.85 0.15 78)" }}
                    />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem stats */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">
              Ekosistem
            </h4>
            <div className="space-y-3">
              {[
                { label: "Exchange Terdaftar", value: "6+" },
                { label: "Custody Partner", value: "6" },
                { label: "Retail Wallet", value: "7" },
                { label: "Developer Tools", value: "1+" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-xs font-grotesk text-white/30">{stat.label}</span>
                  <span
                    className="text-sm font-mono-dm font-semibold"
                    style={{ color: "oklch(0.85 0.15 78)" }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-6"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.28 0.04 255 / 0.5), transparent)",
          }}
        />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-grotesk text-white/25 text-center md:text-left">
            Direktori komunitas independen. Bukan afiliasi resmi Canton Network atau
            Digital Asset.
          </p>
          <p className="text-xs font-grotesk text-white/25 text-center md:text-right">
            © {new Date().getFullYear()} Canton Network Ecosystem. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/50 transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function CantonPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
            entry.target.classList.remove("opacity-0", "translate-y-4");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const cards = pageRef.current?.querySelectorAll(".observe-animate");
    cards?.forEach((card) => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ background: "oklch(0.10 0.025 255)", color: "oklch(0.96 0.008 250)" }}
    >
      <NavBar />
      <main>
        <HeroSection />
        <AboutSection />
        <DirectorySection />
        <SubmitSection />
      </main>
      <CantonFooter />
    </div>
  );
}
