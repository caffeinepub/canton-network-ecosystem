import ConnectWalletModal from "@/components/ConnectWalletModal";
import {
  Award,
  CheckCircle,
  ChevronRight,
  Clock,
  Coins,
  ExternalLink,
  Lock,
  Mail,
  Shield,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

// ── NavBar ────────────────────────────────────────────────────────────────────
function NavBar({ onConnectWallet }: { onConnectWallet: () => void }) {
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
          {/* Logo mark */}
          <a href="/" className="flex items-center gap-3 no-underline">
            <div className="identity-logo-mark">
              <div className="identity-logo-inner" />
            </div>
            <span className="identity-nav-title">ICP Protocol</span>
          </a>
          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            <a href="/" className="identity-nav-link" data-ocid="nav.home.link">
              Home
            </a>
            <a
              href="/markets"
              className="identity-nav-link"
              data-ocid="nav.markets.link"
            >
              Markets
            </a>
            <a
              href="/launchpad"
              className="identity-nav-link"
              data-ocid="nav.launchpad.link"
            >
              Launchpad
            </a>
            <a
              href="/ecosystem"
              className="identity-nav-link"
              data-ocid="nav.ecosystem.link"
            >
              Ecosystem
            </a>
            <a
              href="/wallet"
              className="identity-nav-link"
              data-ocid="nav.wallet.link"
            >
              Wallet
            </a>
            <a
              href="/staking"
              className="identity-nav-link"
              style={{
                color: "oklch(0.72 0.18 245)",
                background: "oklch(0.52 0.16 245 / 0.1)",
              }}
              data-ocid="nav.staking.link"
            >
              Staking
            </a>
            <a
              href="/integration"
              className="identity-nav-link"
              data-ocid="nav.integration.link"
            >
              Integration
            </a>
            <button
              type="button"
              onClick={onConnectWallet}
              className="ig-connect-btn ml-2"
              data-ocid="nav.connect_wallet.button"
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

// ── HeroSection ───────────────────────────────────────────────────────────────
function HeroSection() {
  const scrollToGuide = () => {
    document.getElementById("guide")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="identity-hero relative overflow-hidden">
      {/* Grid overlay */}
      <div className="identity-grid-overlay" />
      {/* Ambient orbs */}
      <div
        className="identity-orb"
        style={{
          width: 500,
          height: 500,
          top: -100,
          right: -80,
          background:
            "radial-gradient(circle, oklch(0.76 0.12 80 / 0.07), transparent 70%)",
          animation: "float 10s ease-in-out infinite",
          position: "absolute",
          borderRadius: "50%",
          pointerEvents: "none",
          filter: "blur(80px)",
        }}
      />
      <div
        className="identity-orb"
        style={{
          width: 400,
          height: 400,
          bottom: -80,
          left: -60,
          background:
            "radial-gradient(circle, oklch(0.52 0.16 245 / 0.06), transparent 70%)",
          animation: "float 13s ease-in-out infinite reverse 2s",
          position: "absolute",
          borderRadius: "50%",
          pointerEvents: "none",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-20 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="identity-eyebrow-badge mb-8 animate-fade-in-down">
          <span className="identity-eyebrow-dot" />
          Network Nervous System · ICP Governance
        </div>

        {/* Headline */}
        <h1
          className="identity-headline animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          Stake ICP &amp; Earn
          <br />
          <span
            style={{
              background:
                "linear-gradient(135deg, oklch(0.85 0.15 78) 0%, oklch(0.72 0.18 60) 60%, oklch(0.68 0.16 245) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Voting Rewards
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="identity-subheadline mt-6 max-w-2xl animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Lock your ICP in the Network Nervous System (NNS) to earn voting
          rewards and help govern the Internet Computer. Up to 15% APY for
          long-term stakers.
        </p>

        {/* CTA buttons */}
        <div
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.35s" }}
        >
          <a
            href="https://nns.ic0.app"
            target="_blank"
            rel="noopener noreferrer"
            className="identity-cta-primary group"
            style={{
              background: "oklch(0.72 0.16 60)",
              boxShadow:
                "0 0 28px oklch(0.72 0.16 60 / 0.35), 0 4px 16px oklch(0.04 0.01 255 / 0.5)",
              textDecoration: "none",
            }}
            data-ocid="staking.nns.primary_button"
          >
            <TrendingUp className="w-4 h-4" />
            Start Staking on NNS
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <button
            type="button"
            onClick={scrollToGuide}
            className="identity-cta-secondary"
            data-ocid="staking.learn_more.button"
          >
            <ChevronRight className="w-4 h-4" />
            Learn More
          </button>
        </div>

        {/* Trust badges */}
        <div
          className="mt-16 flex flex-wrap justify-center gap-8 animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          {[
            { icon: TrendingUp, label: "Up to 15% APY" },
            { icon: Shield, label: "Decentralized Governance" },
            { icon: Lock, label: "Non-Custodial" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="identity-trust-item">
              <Icon className="w-4 h-4" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Overview Cards ─────────────────────────────────────────────────────────────
function OverviewCards() {
  const cards = [
    {
      icon: Coins,
      title: "What is Staking?",
      text: "ICP holders can lock tokens in a Neuron in the NNS to participate in governance and earn rewards. The longer you lock, the more rewards you receive.",
      color: "oklch(0.76 0.12 80)",
      colorDim: "oklch(0.76 0.12 80 / 0.1)",
      colorBorder: "oklch(0.76 0.12 80 / 0.25)",
    },
    {
      icon: Lock,
      title: "What is a Neuron?",
      text: "A Neuron is a locked ICP container that lets you vote on proposals and earn a share of voting rewards. You control its dissolve delay and can follow other neurons.",
      color: "oklch(0.68 0.16 245)",
      colorDim: "oklch(0.52 0.16 245 / 0.1)",
      colorBorder: "oklch(0.52 0.16 245 / 0.25)",
    },
    {
      icon: Award,
      title: "Voting Rewards",
      text: "Rewards are distributed for voting on governance proposals. The longer you lock (dissolve delay), the higher your voting power and reward multiplier.",
      color: "oklch(0.72 0.18 150)",
      colorDim: "oklch(0.68 0.18 150 / 0.1)",
      colorBorder: "oklch(0.68 0.18 150 / 0.25)",
    },
  ];

  return (
    <section className="identity-section relative">
      <div className="identity-section-divider" />
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="identity-section-heading text-center mb-12">
          <div className="identity-section-eyebrow mx-auto">
            <Coins className="w-3.5 h-3.5" />
            Staking Overview
          </div>
          <h2 className="identity-section-title mt-3">How ICP Staking Works</h2>
          <p className="identity-section-subtitle mt-2 max-w-xl mx-auto">
            The NNS is the world's largest autonomous decentralized governance
            system. Participate and earn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div
              key={card.title}
              className="identity-security-card"
              style={{
                animationDelay: `${i * 0.1}s`,
                borderColor: card.colorBorder,
                background: "oklch(0.12 0.025 255)",
              }}
              data-ocid={`staking.overview.card.${i + 1}`}
            >
              <div
                className="identity-security-card-icon"
                style={{
                  background: card.colorDim,
                  borderColor: card.colorBorder,
                  color: card.color,
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  flexShrink: 0,
                }}
              >
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="identity-security-card-title">{card.title}</h3>
                <p className="identity-security-card-text mt-2">{card.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Step Guide ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    step: 1,
    title: "Get ICP",
    desc: "Buy ICP on a supported exchange such as Binance, Coinbase, Kraken, OKX, or MEXC. ICP is widely available on major global exchanges.",
    icon: Coins,
  },
  {
    step: 2,
    title: "Set Up a Wallet",
    desc: "Use NNS Dapp (nns.ic0.app) with Internet Identity for the most secure and seamless experience. No third-party wallet needed.",
    icon: Wallet,
  },
  {
    step: 3,
    title: "Transfer ICP to NNS",
    desc: "Send your ICP from the exchange to your NNS Dapp account address. Use your ICP address shown in the NNS Dapp.",
    icon: TrendingUp,
  },
  {
    step: 4,
    title: "Create a Neuron",
    desc: 'Navigate to the "Neurons" section in NNS Dapp and click "Stake Neurons". Enter the amount of ICP you want to stake.',
    icon: Lock,
  },
  {
    step: 5,
    title: "Set Dissolve Delay",
    desc: "Choose a lock-up period (minimum 6 months, maximum 8 years). A longer dissolve delay earns you a higher reward multiplier.",
    icon: Clock,
  },
  {
    step: 6,
    title: "Start Voting",
    desc: "Vote on governance proposals manually or follow another neuron (e.g., DFINITY Foundation) to vote automatically and maximize rewards.",
    icon: CheckCircle,
  },
];

function StepGuide() {
  return (
    <section id="guide" className="identity-section relative">
      <div className="identity-section-divider" />
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="identity-section-heading text-center mb-12">
          <div className="identity-section-eyebrow mx-auto">
            <CheckCircle className="w-3.5 h-3.5" />
            Step-by-Step Guide
          </div>
          <h2 className="identity-section-title mt-3">
            How to Stake ICP in 6 Steps
          </h2>
          <p className="identity-section-subtitle mt-2 max-w-xl mx-auto">
            From buying ICP to earning your first voting rewards — a complete
            walkthrough.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="identity-roadmap-card identity-roadmap-card-active flex gap-5"
              style={{ padding: "24px 26px" }}
              data-ocid={`staking.step.card.${s.step}`}
            >
              {/* Step number */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "oklch(0.52 0.16 245 / 0.12)",
                  border: "1px solid oklch(0.52 0.16 245 / 0.3)",
                  color: "oklch(0.72 0.16 245)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                }}
              >
                {s.step}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <s.icon
                    className="w-4 h-4"
                    style={{ color: "oklch(0.68 0.16 245)" }}
                  />
                  <h3
                    className="identity-roadmap-title"
                    style={{ fontSize: "0.95rem" }}
                  >
                    {s.title}
                  </h3>
                </div>
                <p className="identity-roadmap-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Dissolve Delay Table ───────────────────────────────────────────────────────
const DISSOLVE_DATA = [
  { delay: "6 months", multiplier: "1.00x", apy: "~5%", highlight: false },
  { delay: "1 year", multiplier: "1.06x", apy: "~6%", highlight: false },
  { delay: "2 years", multiplier: "1.14x", apy: "~8%", highlight: false },
  { delay: "4 years", multiplier: "1.25x", apy: "~11%", highlight: false },
  { delay: "8 years", multiplier: "1.50x", apy: "~15%", highlight: true },
];

function DissolveTable() {
  return (
    <section className="identity-section relative">
      <div className="identity-section-divider" />
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="identity-section-heading text-center mb-12">
          <div className="identity-section-eyebrow mx-auto">
            <Clock className="w-3.5 h-3.5" />
            Dissolve Delay Rewards
          </div>
          <h2 className="identity-section-title mt-3">
            Longer Lock = Higher Rewards
          </h2>
          <p className="identity-section-subtitle mt-2 max-w-lg mx-auto">
            The dissolve delay multiplier increases your share of voting
            rewards. Maximum rewards at 8 years.
          </p>
        </div>

        <div
          className="identity-card"
          style={{ padding: 0, overflow: "hidden" }}
          data-ocid="staking.dissolve.table"
        >
          <div className="identity-card-top-line" />
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              padding: "14px 24px",
              borderBottom: "1px solid oklch(1 0 0 / 0.07)",
              background: "oklch(1 0 0 / 0.02)",
            }}
          >
            {["Dissolve Delay", "Bonus Multiplier", "Est. APY"].map((h) => (
              <span
                key={h}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.09em",
                  textTransform: "uppercase" as const,
                  color: "oklch(0.55 0.04 255)",
                }}
              >
                {h}
              </span>
            ))}
          </div>
          {/* Rows */}
          {DISSOLVE_DATA.map((row, i) => (
            <div
              key={row.delay}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                padding: "16px 24px",
                borderBottom:
                  i < DISSOLVE_DATA.length - 1
                    ? "1px solid oklch(1 0 0 / 0.05)"
                    : "none",
                background: row.highlight
                  ? "oklch(0.76 0.12 80 / 0.06)"
                  : "transparent",
                transition: "background 0.2s",
              }}
              data-ocid={`staking.dissolve.row.${i + 1}`}
            >
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.88rem",
                  fontWeight: 500,
                  color: row.highlight
                    ? "oklch(0.88 0.01 255)"
                    : "oklch(0.72 0.02 255)",
                }}
              >
                {row.delay}
                {row.highlight && (
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: "0.65rem",
                      fontFamily: "'DM Mono', monospace",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase" as const,
                      padding: "2px 7px",
                      borderRadius: 100,
                      background: "oklch(0.76 0.12 80 / 0.12)",
                      border: "1px solid oklch(0.76 0.12 80 / 0.3)",
                      color: "oklch(0.82 0.14 80)",
                    }}
                  >
                    Max
                  </span>
                )}
              </span>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: row.highlight
                    ? "oklch(0.82 0.14 80)"
                    : "oklch(0.68 0.14 245)",
                }}
              >
                {row.multiplier}
              </span>
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  color: row.highlight
                    ? "oklch(0.82 0.14 80)"
                    : "oklch(0.72 0.18 150)",
                }}
              >
                {row.apy}
              </span>
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: 12,
            fontSize: "0.72rem",
            color: "oklch(0.42 0.02 255)",
            fontFamily: "'DM Mono', monospace",
            textAlign: "center",
          }}
        >
          * APY estimates are approximate and vary based on network voting
          activity and total ICP staked.
        </p>
      </div>
    </section>
  );
}

// ── CTA Section ───────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="identity-section relative">
      <div className="identity-section-divider" />
      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <div
          style={{
            position: "relative",
            padding: "56px 40px",
            borderRadius: 20,
            background: "oklch(0.12 0.028 255)",
            border: "1px solid oklch(0.76 0.12 80 / 0.2)",
            boxShadow: "0 0 60px oklch(0.76 0.12 80 / 0.07)",
            overflow: "hidden",
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background:
                "linear-gradient(90deg, transparent, oklch(0.76 0.12 80 / 0.7), oklch(0.52 0.16 245 / 0.5), transparent)",
            }}
          />

          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "oklch(0.76 0.12 80 / 0.12)",
              border: "1px solid oklch(0.76 0.12 80 / 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              color: "oklch(0.80 0.13 78)",
            }}
          >
            <TrendingUp className="w-7 h-7" />
          </div>

          <h2
            className="identity-section-title"
            style={{ marginBottom: 12, fontSize: "1.9rem" }}
          >
            Ready to Start Staking?
          </h2>
          <p
            className="identity-section-subtitle"
            style={{ marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}
          >
            Access the official NNS Dapp to stake your ICP and participate in
            Internet Computer governance.
          </p>

          <a
            href="https://nns.ic0.app"
            target="_blank"
            rel="noopener noreferrer"
            className="identity-cta-primary group"
            style={{
              display: "inline-flex",
              background: "oklch(0.72 0.16 60)",
              boxShadow:
                "0 0 28px oklch(0.72 0.16 60 / 0.35), 0 4px 16px oklch(0.04 0.01 255 / 0.5)",
              textDecoration: "none",
              fontSize: "1rem",
              padding: "14px 28px",
            }}
            data-ocid="staking.open_nns.primary_button"
          >
            <TrendingUp className="w-5 h-5" />
            Open NNS Dapp
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <p
            style={{
              marginTop: 20,
              fontSize: "0.75rem",
              color: "oklch(0.40 0.025 255)",
              lineHeight: 1.6,
              maxWidth: 440,
              marginInline: "auto",
            }}
          >
            Staking involves risks. Always research before investing. This page
            is for informational purposes only and is not financial advice.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="identity-footer">
      <div className="identity-footer-top-line" />
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="identity-logo-mark identity-logo-mark-sm">
                <div className="identity-logo-inner" />
              </div>
              <span className="identity-footer-brand">ICP Protocol</span>
            </div>
            <p className="identity-footer-tagline">
              ICP Ecosystem Hub &amp; Staking Guide
            </p>
            <p className="identity-footer-disclaimer mt-3">
              Built as an independent community initiative. Not affiliated with
              DFINITY Foundation or Internet Computer Protocol.
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="identity-footer-heading mb-4">
              <TrendingUp className="w-4 h-4" />
              Staking Resources
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "NNS Dapp", href: "https://nns.ic0.app" },
                {
                  label: "ICP Dashboard",
                  href: "https://dashboard.internetcomputer.org",
                },
                {
                  label: "Internet Computer",
                  href: "https://internetcomputer.org",
                },
                {
                  label: "DFINITY Foundation",
                  href: "https://dfinity.org",
                },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="identity-footer-link inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="identity-footer-heading mb-4">
              <Users className="w-4 h-4" />
              Community
            </h4>
            <p className="identity-footer-body">
              This project is open to contributors and researchers interested in
              the ICP ecosystem. Community participation is welcome.
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

        {/* Bottom bar */}
        <div className="identity-footer-bottom">
          <p className="identity-footer-copyright">
            © {year} Community Initiative. Open Source.
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
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function StakingPage() {
  const [walletOpen, setWalletOpen] = useState(false);

  return (
    <div className="identity-page">
      <NavBar onConnectWallet={() => setWalletOpen(true)} />
      <ConnectWalletModal
        isOpen={walletOpen}
        onClose={() => setWalletOpen(false)}
      />
      <main>
        <HeroSection />
        <OverviewCards />
        <StepGuide />
        <DissolveTable />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
