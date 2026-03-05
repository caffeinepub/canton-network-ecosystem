import ConnectWalletModal from "@/components/ConnectWalletModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Award,
  CheckCircle,
  ChevronRight,
  Clock,
  Coins,
  ExternalLink,
  Globe,
  Info,
  Mail,
  Shield,
  TrendingUp,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type SnsStatus = "Open" | "Committed" | "Adopted" | "Failed";

interface SnsProject {
  id: number;
  name: string;
  symbol: string;
  description: string;
  status: SnsStatus;
  icpRaised: number;
  icpGoal: number;
  participants: number;
  endDate: string;
  minContribution: number;
  maxContribution: number;
  totalSupply: string;
  salePercent: string;
  logo: string;
  website: string;
  nnsProposal: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const SNS_PROJECTS: SnsProject[] = [
  {
    id: 1,
    name: "OpenChat",
    symbol: "CHAT",
    description:
      "A decentralized messaging app on the Internet Computer. Users own their data and governance.",
    status: "Adopted",
    icpRaised: 1_000_000,
    icpGoal: 1_000_000,
    participants: 18_432,
    endDate: "Completed",
    minContribution: 1,
    maxContribution: 100_000,
    totalSupply: "50B CHAT",
    salePercent: "25%",
    logo: "💬",
    website: "https://oc.app",
    nnsProposal: "https://dashboard.internetcomputer.org/governance",
  },
  {
    id: 2,
    name: "DSCVR",
    symbol: "DSCVR",
    description:
      "Web3 social platform with decentralized governance, portals, and creator tools.",
    status: "Adopted",
    icpRaised: 850_000,
    icpGoal: 850_000,
    participants: 12_100,
    endDate: "Completed",
    minContribution: 1,
    maxContribution: 50_000,
    totalSupply: "10B DSCVR",
    salePercent: "20%",
    logo: "🔭",
    website: "https://dscvr.one",
    nnsProposal: "https://dashboard.internetcomputer.org/governance",
  },
  {
    id: 3,
    name: "ICPSwap",
    symbol: "ICS",
    description:
      "Decentralized exchange and DeFi hub on the Internet Computer Protocol.",
    status: "Adopted",
    icpRaised: 600_000,
    icpGoal: 600_000,
    participants: 9_200,
    endDate: "Completed",
    minContribution: 1,
    maxContribution: 100_000,
    totalSupply: "5B ICS",
    salePercent: "15%",
    logo: "🔄",
    website: "https://icpswap.com",
    nnsProposal: "https://dashboard.internetcomputer.org/governance",
  },
  {
    id: 4,
    name: "Kinic",
    symbol: "KIN",
    description: "Decentralized search engine and Web3 knowledge graph on ICP.",
    status: "Adopted",
    icpRaised: 200_000,
    icpGoal: 200_000,
    participants: 4_500,
    endDate: "Completed",
    minContribution: 1,
    maxContribution: 10_000,
    totalSupply: "1B KIN",
    salePercent: "10%",
    logo: "🔍",
    website: "https://kinic.io",
    nnsProposal: "https://dashboard.internetcomputer.org/governance",
  },
  {
    id: 5,
    name: "Neutron",
    symbol: "NTN",
    description:
      "AI-powered DeFi protocol for decentralized lending and borrowing on ICP.",
    status: "Open",
    icpRaised: 320_000,
    icpGoal: 500_000,
    participants: 6_780,
    endDate: "2026-03-28",
    minContribution: 1,
    maxContribution: 50_000,
    totalSupply: "2B NTN",
    salePercent: "18%",
    logo: "⚡",
    website: "https://internetcomputer.org",
    nnsProposal: "https://dashboard.internetcomputer.org/governance",
  },
  {
    id: 6,
    name: "HorizonDAO",
    symbol: "HRZ",
    description:
      "Cross-chain governance DAO connecting ICP with Ethereum and Bitcoin ecosystems.",
    status: "Open",
    icpRaised: 145_000,
    icpGoal: 750_000,
    participants: 2_340,
    endDate: "2026-04-10",
    minContribution: 5,
    maxContribution: 25_000,
    totalSupply: "800M HRZ",
    salePercent: "22%",
    logo: "🌐",
    website: "https://internetcomputer.org",
    nnsProposal: "https://dashboard.internetcomputer.org/governance",
  },
  {
    id: 7,
    name: "ArcadeICP",
    symbol: "ARC",
    description:
      "On-chain gaming platform. Play, earn and govern Web3 games entirely on ICP.",
    status: "Committed",
    icpRaised: 400_000,
    icpGoal: 400_000,
    participants: 7_200,
    endDate: "Awaiting NNS Vote",
    minContribution: 1,
    maxContribution: 20_000,
    totalSupply: "3B ARC",
    salePercent: "30%",
    logo: "🎮",
    website: "https://internetcomputer.org",
    nnsProposal: "https://dashboard.internetcomputer.org/governance",
  },
  {
    id: 8,
    name: "VaultFi",
    symbol: "VFI",
    description:
      "Decentralized asset management and automated yield strategies on ICP.",
    status: "Failed",
    icpRaised: 80_000,
    icpGoal: 500_000,
    participants: 1_100,
    endDate: "Ended",
    minContribution: 10,
    maxContribution: 100_000,
    totalSupply: "500M VFI",
    salePercent: "12%",
    logo: "🏦",
    website: "https://internetcomputer.org",
    nnsProposal: "https://dashboard.internetcomputer.org/governance",
  },
];

const STATS = [
  { label: "Projects Launched", value: "24", icon: Award },
  { label: "Total ICP Raised", value: "4.2M ICP", icon: Coins },
  { label: "Total Participants", value: "128,000+", icon: Users },
  { label: "Success Rate", value: "92%", icon: TrendingUp },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "NNS Proposal",
    description:
      "A project submits an SNS sale proposal to the NNS for community vote. The community reviews and votes on whether to approve the token sale.",
    icon: Shield,
    color: "oklch(0.68 0.16 245)",
    colorDim: "oklch(0.52 0.16 245 / 0.12)",
    colorBorder: "oklch(0.52 0.16 245 / 0.3)",
  },
  {
    step: 2,
    title: "Sale Opens",
    description:
      "If approved, ICP holders can contribute during the open sale window. Contributors receive tokens proportional to their ICP contribution.",
    icon: Zap,
    color: "oklch(0.80 0.15 70)",
    colorDim: "oklch(0.80 0.15 70 / 0.12)",
    colorBorder: "oklch(0.80 0.15 70 / 0.3)",
  },
  {
    step: 3,
    title: "Committed",
    description:
      "When the funding goal is met, the sale enters committed state awaiting final NNS approval vote to distribute tokens.",
    icon: CheckCircle,
    color: "oklch(0.72 0.18 150)",
    colorDim: "oklch(0.68 0.18 150 / 0.12)",
    colorBorder: "oklch(0.68 0.18 150 / 0.3)",
  },
  {
    step: 4,
    title: "Token Distribution",
    description:
      "Tokens are distributed to all participants, and the project's governance DAO goes live with the SNS fully controlled by the community.",
    icon: Award,
    color: "oklch(0.72 0.16 60)",
    colorDim: "oklch(0.72 0.16 60 / 0.12)",
    colorBorder: "oklch(0.72 0.16 60 / 0.3)",
  },
];

const FAQ_ITEMS = [
  {
    q: "What is an SNS token sale?",
    a: "An SNS (Service Nervous System) token sale is a decentralized fundraising mechanism on the Internet Computer. Projects submit proposals to the NNS, and if approved, ICP holders can contribute ICP to receive newly minted project tokens. The SNS then governs the project autonomously.",
  },
  {
    q: "How do I participate?",
    a: "Go to nns.ic0.app, connect with your Internet Identity, navigate to the Launchpad section, find the project you want to support, and contribute ICP during the open sale window. The minimum contribution varies per project.",
  },
  {
    q: "What happens if the sale fails?",
    a: "If a sale fails to reach its funding goal or fails the final NNS vote, all ICP contributions are fully refunded to participants. There is no risk of losing your ICP due to a failed sale.",
  },
  {
    q: "What is the Neurons' Fund?",
    a: "The Neurons' Fund is a mechanism where NNS neurons can opt-in to automatically participate in SNS sales using their maturity. This helps ensure projects have broad community backing and reduces the funding barrier for promising projects.",
  },
  {
    q: "How are tokens distributed?",
    a: "Tokens are distributed proportionally based on ICP contributed. If the sale is oversubscribed, each contributor receives a proportional share of the tokens allocated for the sale. The exact formula ensures fair distribution across all participants.",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getStatusConfig(status: SnsStatus) {
  switch (status) {
    case "Open":
      return {
        color: "oklch(0.68 0.16 245)",
        bg: "oklch(0.52 0.16 245 / 0.12)",
        border: "oklch(0.52 0.16 245 / 0.3)",
        label: "Open",
        dot: "oklch(0.68 0.16 245)",
      };
    case "Committed":
      return {
        color: "oklch(0.80 0.15 70)",
        bg: "oklch(0.80 0.15 70 / 0.12)",
        border: "oklch(0.80 0.15 70 / 0.3)",
        label: "Committed",
        dot: "oklch(0.80 0.15 70)",
      };
    case "Adopted":
      return {
        color: "oklch(0.72 0.18 150)",
        bg: "oklch(0.68 0.18 150 / 0.12)",
        border: "oklch(0.68 0.18 150 / 0.3)",
        label: "Adopted",
        dot: "oklch(0.72 0.18 150)",
      };
    case "Failed":
      return {
        color: "oklch(0.65 0.18 20)",
        bg: "oklch(0.65 0.18 20 / 0.12)",
        border: "oklch(0.65 0.18 20 / 0.3)",
        label: "Failed",
        dot: "oklch(0.65 0.18 20)",
      };
  }
}

function formatICP(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return amount.toLocaleString();
}

function getProgressPercent(raised: number, goal: number): number {
  return Math.min(100, Math.round((raised / goal) * 100));
}

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
          <a href="/" className="flex items-center gap-3 no-underline">
            <div className="identity-logo-mark">
              <div className="identity-logo-inner" />
            </div>
            <span className="identity-nav-title">ICP Protocol</span>
          </a>
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
              style={{
                color: "oklch(0.72 0.18 245)",
                background: "oklch(0.52 0.16 245 / 0.1)",
              }}
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
  const scrollToHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="identity-hero relative overflow-hidden">
      <div className="identity-grid-overlay" />
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          top: -150,
          right: -100,
          background:
            "radial-gradient(circle, oklch(0.68 0.16 245 / 0.08), transparent 70%)",
          animation: "float 12s ease-in-out infinite",
          borderRadius: "50%",
          pointerEvents: "none",
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          bottom: -80,
          left: -60,
          background:
            "radial-gradient(circle, oklch(0.72 0.18 150 / 0.06), transparent 70%)",
          animation: "float 15s ease-in-out infinite reverse 3s",
          borderRadius: "50%",
          pointerEvents: "none",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-20 flex flex-col items-center text-center">
        <div className="identity-eyebrow-badge mb-8 animate-fade-in-down">
          <span className="identity-eyebrow-dot" />
          SNS · Decentralized Token Sales
        </div>

        <h1
          className="identity-headline animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          ICP SNS
          <br />
          <span
            style={{
              background:
                "linear-gradient(135deg, oklch(0.68 0.16 245) 0%, oklch(0.72 0.18 150) 60%, oklch(0.80 0.15 70) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Launchpad
          </span>
        </h1>

        <p
          className="identity-subheadline mt-6 max-w-2xl animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Participate in decentralized token sales and help govern the future of
          Internet Computer dApps. SNS enables projects to launch
          community-owned tokens.
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.35s" }}
        >
          <a
            href="https://nns.ic0.app/launchpad/"
            target="_blank"
            rel="noopener noreferrer"
            className="identity-cta-primary group"
            style={{
              background: "oklch(0.68 0.16 245)",
              boxShadow:
                "0 0 28px oklch(0.68 0.16 245 / 0.35), 0 4px 16px oklch(0.04 0.01 255 / 0.5)",
              textDecoration: "none",
            }}
            data-ocid="launchpad.open_nns.primary_button"
          >
            <Zap className="w-4 h-4" />
            Open NNS Launchpad
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <button
            type="button"
            onClick={scrollToHowItWorks}
            className="identity-cta-secondary"
            data-ocid="launchpad.learn_how.button"
          >
            <ChevronRight className="w-4 h-4" />
            Learn How It Works
          </button>
        </div>

        <div
          className="mt-16 flex flex-wrap justify-center gap-8 animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          {[
            { icon: Shield, label: "Decentralized" },
            { icon: Users, label: "Community Governed" },
            { icon: Globe, label: "On-Chain" },
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

// ── StatsBar ──────────────────────────────────────────────────────────────────

function StatsBar() {
  return (
    <section className="identity-section relative">
      <div className="identity-section-divider" />
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="identity-card"
                style={{
                  padding: "24px 20px",
                  textAlign: "center",
                  animationDelay: `${i * 0.08}s`,
                }}
                data-ocid={`launchpad.stats.card.${i + 1}`}
              >
                <div className="identity-card-top-line" />
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "oklch(0.52 0.16 245 / 0.12)",
                    border: "1px solid oklch(0.52 0.16 245 / 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                    color: "oklch(0.68 0.16 245)",
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: "oklch(0.92 0.01 255)",
                    lineHeight: 1.1,
                    marginBottom: 4,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: "oklch(0.50 0.03 255)",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SnsStatus }) {
  const cfg = getStatusConfig(status);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 100,
        fontSize: "0.68rem",
        fontFamily: "'DM Mono', monospace",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: cfg.dot,
          display: "inline-block",
          ...(status === "Open" ? { animation: "pulse 2s infinite" } : {}),
        }}
      />
      {cfg.label}
    </span>
  );
}

// ── Project Card ──────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: SnsProject;
  index: number;
  onOpen: (p: SnsProject) => void;
}) {
  const pct = getProgressPercent(project.icpRaised, project.icpGoal);
  const cfg = getStatusConfig(project.status);

  return (
    <button
      type="button"
      className="identity-card"
      style={{
        padding: 0,
        overflow: "hidden",
        cursor: "pointer",
        transition:
          "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        animationDelay: `${index * 0.05}s`,
        width: "100%",
        textAlign: "left",
        background: "none",
      }}
      onClick={() => onOpen(project)}
      data-ocid={`launchpad.project.card.${index + 1}`}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = `0 8px 32px ${cfg.color}20, 0 2px 8px oklch(0.04 0.01 255 / 0.4)`;
        el.style.borderColor = cfg.border;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = "";
        el.style.boxShadow = "";
        el.style.borderColor = "";
      }}
    >
      <div className="identity-card-top-line" />
      <div style={{ padding: "20px 22px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                flexShrink: 0,
              }}
            >
              {project.logo}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: "oklch(0.92 0.01 255)",
                  lineHeight: 1.2,
                }}
              >
                {project.name}
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "oklch(0.55 0.04 255)",
                  marginTop: 2,
                }}
              >
                ${project.symbol}
              </div>
            </div>
          </div>
          <StatusBadge status={project.status} />
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.82rem",
            color: "oklch(0.55 0.03 255)",
            lineHeight: 1.55,
            marginBottom: 16,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project.description}
        </p>

        {/* Progress */}
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                color: "oklch(0.55 0.04 255)",
              }}
            >
              {formatICP(project.icpRaised)} / {formatICP(project.icpGoal)} ICP
            </span>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: cfg.color,
              }}
            >
              {pct}%
            </span>
          </div>
          <div
            style={{
              height: 5,
              borderRadius: 100,
              background: "oklch(1 0 0 / 0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: cfg.color,
                borderRadius: 100,
                transition: "width 0.8s ease",
              }}
            />
          </div>
        </div>

        {/* Meta row */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.78rem",
              color: "oklch(0.55 0.03 255)",
            }}
          >
            <Users className="w-3 h-3" />
            {project.participants.toLocaleString()} participants
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.78rem",
              color: "oklch(0.55 0.03 255)",
            }}
          >
            <Clock className="w-3 h-3" />
            {project.endDate}
          </div>
        </div>

        {/* Min contribution */}
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.7rem",
            color: "oklch(0.45 0.03 255)",
            marginBottom: 16,
          }}
        >
          Min contribution: {project.minContribution} ICP
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(project);
          }}
          style={{
            width: "100%",
            padding: "10px 16px",
            borderRadius: 10,
            border: `1px solid ${cfg.border}`,
            background: cfg.bg,
            color: cfg.color,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: "0.82rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            transition: "all 0.2s ease",
          }}
          data-ocid={`launchpad.project.button.${index + 1}`}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "1";
          }}
        >
          {project.status === "Open" || project.status === "Committed"
            ? "Participate"
            : "View Details"}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </button>
  );
}

// ── Project Detail Modal ──────────────────────────────────────────────────────

function ProjectModal({
  project,
  onClose,
}: {
  project: SnsProject | null;
  onClose: () => void;
}) {
  if (!project) return null;
  const pct = getProgressPercent(project.icpRaised, project.icpGoal);
  const cfg = getStatusConfig(project.status);

  const timelineSteps = [
    { label: "Proposal Submitted", done: true },
    {
      label: "Sale Open",
      done: project.status !== "Open",
      active: project.status === "Open",
    },
    {
      label: "Committed",
      done:
        project.status === "Committed" ||
        project.status === "Adopted" ||
        project.status === "Failed",
      active: project.status === "Committed",
    },
    {
      label:
        project.status === "Failed"
          ? "Failed"
          : project.status === "Adopted"
            ? "Adopted"
            : "Adopted/Failed",
      done: project.status === "Adopted" || project.status === "Failed",
      active: false,
      failed: project.status === "Failed",
    },
  ];

  return (
    <Dialog open={!!project} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-lg"
        style={{
          background: "oklch(0.10 0.025 255)",
          border: "1px solid oklch(1 0 0 / 0.1)",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
        data-ocid="launchpad.project.dialog"
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                flexShrink: 0,
              }}
            >
              {project.logo}
            </div>
            <div>
              <DialogTitle
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  color: "oklch(0.92 0.01 255)",
                }}
              >
                {project.name}
              </DialogTitle>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.7rem",
                    color: "oklch(0.50 0.03 255)",
                    fontWeight: 600,
                  }}
                >
                  ${project.symbol}
                </span>
                <StatusBadge status={project.status} />
              </div>
            </div>
          </div>
        </DialogHeader>

        <div style={{ marginTop: 8 }}>
          {/* Description */}
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.85rem",
              color: "oklch(0.60 0.03 255)",
              lineHeight: 1.65,
              marginBottom: 20,
            }}
          >
            {project.description}
          </p>

          {/* Token info grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginBottom: 20,
            }}
          >
            {[
              { label: "Symbol", value: `$${project.symbol}` },
              { label: "Total Supply", value: project.totalSupply },
              { label: "Sale %", value: project.salePercent },
              {
                label: "Min / Max",
                value: `${project.minContribution} / ${formatICP(project.maxContribution)} ICP`,
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "oklch(1 0 0 / 0.03)",
                  border: "1px solid oklch(1 0 0 / 0.07)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.62rem",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: "oklch(0.45 0.03 255)",
                    marginBottom: 3,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: "oklch(0.82 0.02 255)",
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Progress bar (larger) */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "0.8rem",
                  color: "oklch(0.55 0.03 255)",
                }}
              >
                Sale Progress
              </span>
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  color: cfg.color,
                }}
              >
                {pct}%
              </span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 100,
                background: "oklch(1 0 0 / 0.06)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: cfg.color,
                  borderRadius: 100,
                }}
              />
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                color: "oklch(0.45 0.03 255)",
              }}
            >
              {formatICP(project.icpRaised)} ICP raised of{" "}
              {formatICP(project.icpGoal)} ICP goal
            </div>
          </div>

          {/* Participants & time */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 10,
                background: "oklch(1 0 0 / 0.03)",
                border: "1px solid oklch(1 0 0 / 0.07)",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.62rem",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "oklch(0.45 0.03 255)",
                  marginBottom: 3,
                }}
              >
                Participants
              </div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  color: "oklch(0.82 0.02 255)",
                }}
              >
                {project.participants.toLocaleString()}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 10,
                background: "oklch(1 0 0 / 0.03)",
                border: "1px solid oklch(1 0 0 / 0.07)",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.62rem",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "oklch(0.45 0.03 255)",
                  marginBottom: 3,
                }}
              >
                Sale End
              </div>
              <div
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  color: "oklch(0.72 0.02 255)",
                }}
              >
                {project.endDate}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "oklch(0.45 0.03 255)",
                marginBottom: 12,
              }}
            >
              Sale Timeline
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              {timelineSteps.map((step, i) => (
                <div
                  key={step.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: step.failed
                          ? "oklch(0.65 0.18 20 / 0.2)"
                          : step.done
                            ? "oklch(0.72 0.18 150 / 0.2)"
                            : step.active
                              ? cfg.bg
                              : "oklch(1 0 0 / 0.04)",
                        border: `2px solid ${
                          step.failed
                            ? "oklch(0.65 0.18 20 / 0.5)"
                            : step.done
                              ? "oklch(0.72 0.18 150 / 0.6)"
                              : step.active
                                ? cfg.border
                                : "oklch(1 0 0 / 0.1)"
                        }`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 6,
                        flexShrink: 0,
                      }}
                    >
                      {step.failed ? (
                        <X
                          className="w-3 h-3"
                          style={{ color: "oklch(0.65 0.18 20)" }}
                        />
                      ) : step.done ? (
                        <CheckCircle
                          className="w-3 h-3"
                          style={{ color: "oklch(0.72 0.18 150)" }}
                        />
                      ) : step.active ? (
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: cfg.color,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "oklch(0.35 0.02 255)",
                          }}
                        />
                      )}
                    </div>
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.55rem",
                        letterSpacing: "0.04em",
                        textAlign: "center",
                        color: step.done
                          ? "oklch(0.65 0.05 255)"
                          : step.active
                            ? cfg.color
                            : "oklch(0.35 0.02 255)",
                        fontWeight: step.active ? 700 : 500,
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < timelineSteps.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        background: step.done
                          ? "oklch(0.72 0.18 150 / 0.4)"
                          : "oklch(1 0 0 / 0.08)",
                        marginBottom: 24,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(project.status === "Open" || project.status === "Committed") && (
              <a
                href="https://nns.ic0.app/launchpad/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "13px 20px",
                  borderRadius: 12,
                  background: "oklch(0.68 0.16 245)",
                  boxShadow: "0 0 20px oklch(0.68 0.16 245 / 0.3)",
                  color: "oklch(0.97 0.005 245)",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                data-ocid="launchpad.project.participate.button"
              >
                <Zap className="w-4 h-4" />
                Participate on NNS
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <a
                href={project.nnsProposal}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "10px 16px",
                  borderRadius: 10,
                  background: "oklch(1 0 0 / 0.04)",
                  border: "1px solid oklch(1 0 0 / 0.1)",
                  color: "oklch(0.62 0.03 255)",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                data-ocid="launchpad.project.nns_link.button"
              >
                <Info className="w-3.5 h-3.5" />
                View on NNS
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "10px 16px",
                  borderRadius: 10,
                  background: "oklch(1 0 0 / 0.04)",
                  border: "1px solid oklch(1 0 0 / 0.1)",
                  color: "oklch(0.62 0.03 255)",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                data-ocid="launchpad.project.website.button"
              >
                <Globe className="w-3.5 h-3.5" />
                Visit Website
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── SNS Projects Section ──────────────────────────────────────────────────────

type TabFilter = "All" | SnsStatus;

function SnsProjectsSection() {
  const [activeTab, setActiveTab] = useState<TabFilter>("All");
  const [selectedProject, setSelectedProject] = useState<SnsProject | null>(
    null,
  );

  const tabs: TabFilter[] = ["All", "Open", "Committed", "Adopted", "Failed"];

  const filtered = useMemo(() => {
    if (activeTab === "All") return SNS_PROJECTS;
    return SNS_PROJECTS.filter((p) => p.status === activeTab);
  }, [activeTab]);

  const counts: Record<TabFilter, number> = useMemo(() => {
    return {
      All: SNS_PROJECTS.length,
      Open: SNS_PROJECTS.filter((p) => p.status === "Open").length,
      Committed: SNS_PROJECTS.filter((p) => p.status === "Committed").length,
      Adopted: SNS_PROJECTS.filter((p) => p.status === "Adopted").length,
      Failed: SNS_PROJECTS.filter((p) => p.status === "Failed").length,
    };
  }, []);

  return (
    <section className="identity-section relative">
      <div className="identity-section-divider" />
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="identity-section-heading text-center mb-10">
          <div className="identity-section-eyebrow mx-auto">
            <Zap className="w-3.5 h-3.5" />
            Token Sales
          </div>
          <h2 className="identity-section-title mt-3">SNS Projects</h2>
          <p className="identity-section-subtitle mt-2 max-w-xl mx-auto">
            Browse all SNS decentralized token sales on the Internet Computer.
            Click any project to view details.
          </p>
        </div>

        {/* Tab filter */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 32,
            justifyContent: "center",
          }}
          data-ocid="launchpad.status.tab"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "7px 16px",
                borderRadius: 100,
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                ...(activeTab === tab
                  ? {
                      background: "oklch(0.68 0.16 245)",
                      border: "1px solid oklch(0.68 0.16 245)",
                      color: "oklch(0.97 0.005 245)",
                      boxShadow: "0 0 16px oklch(0.68 0.16 245 / 0.3)",
                    }
                  : {
                      background: "oklch(1 0 0 / 0.04)",
                      border: "1px solid oklch(1 0 0 / 0.1)",
                      color: "oklch(0.55 0.03 255)",
                    }),
              }}
              data-ocid="launchpad.filter.tab"
            >
              {tab}
              <span
                style={{
                  padding: "1px 6px",
                  borderRadius: 100,
                  fontSize: "0.62rem",
                  background:
                    activeTab === tab
                      ? "oklch(1 0 0 / 0.2)"
                      : "oklch(1 0 0 / 0.06)",
                  color:
                    activeTab === tab
                      ? "oklch(0.95 0.01 245)"
                      : "oklch(0.45 0.03 255)",
                }}
              >
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "oklch(0.45 0.03 255)",
              fontFamily: "'Outfit', sans-serif",
            }}
            data-ocid="launchpad.project.empty_state"
          >
            No projects in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onOpen={setSelectedProject}
              />
            ))}
          </div>
        )}
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="identity-section relative">
      <div className="identity-section-divider" />
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="identity-section-heading text-center mb-12">
          <div className="identity-section-eyebrow mx-auto">
            <Shield className="w-3.5 h-3.5" />
            SNS Process
          </div>
          <h2 className="identity-section-title mt-3">How It Works</h2>
          <p className="identity-section-subtitle mt-2 max-w-xl mx-auto">
            The SNS sale process is fully governed by the NNS — decentralized
            from proposal to token distribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOW_IT_WORKS_STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="identity-card"
                style={{
                  padding: "28px 22px",
                  animationDelay: `${i * 0.1}s`,
                }}
                data-ocid={`launchpad.how_it_works.card.${i + 1}`}
              >
                <div className="identity-card-top-line" />
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: s.colorDim,
                    border: `1px solid ${s.colorBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                    color: s.color,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "oklch(0.45 0.03 255)",
                    marginBottom: 6,
                  }}
                >
                  Step {s.step}
                </div>
                <h3
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: "1rem",
                    color: "oklch(0.88 0.01 255)",
                    marginBottom: 8,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "0.82rem",
                    color: "oklch(0.55 0.03 255)",
                    lineHeight: 1.6,
                  }}
                >
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── FAQ Section ───────────────────────────────────────────────────────────────

function FaqSection() {
  return (
    <section className="identity-section relative">
      <div className="identity-section-divider" />
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="identity-section-heading text-center mb-12">
          <div className="identity-section-eyebrow mx-auto">
            <Info className="w-3.5 h-3.5" />
            FAQ
          </div>
          <h2 className="identity-section-title mt-3">
            Frequently Asked Questions
          </h2>
          <p className="identity-section-subtitle mt-2 max-w-xl mx-auto">
            Everything you need to know about SNS token sales on the Internet
            Computer.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`faq-${i}`}
              style={{
                border: "1px solid oklch(1 0 0 / 0.08)",
                borderRadius: 12,
                overflow: "hidden",
                background: "oklch(0.11 0.025 255)",
              }}
              data-ocid={`launchpad.faq.panel.${i + 1}`}
            >
              <AccordionTrigger
                style={{
                  padding: "16px 20px",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "oklch(0.82 0.02 255)",
                  textAlign: "left",
                }}
              >
                {item.q}
              </AccordionTrigger>
              <AccordionContent
                style={{
                  padding: "0 20px 16px",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "0.83rem",
                  color: "oklch(0.55 0.03 255)",
                  lineHeight: 1.65,
                }}
              >
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
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
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="identity-logo-mark identity-logo-mark-sm">
                <div className="identity-logo-inner" />
              </div>
              <span className="identity-footer-brand">ICP Protocol</span>
            </div>
            <p className="identity-footer-tagline">
              ICP Ecosystem Hub &amp; SNS Launchpad
            </p>
            <p className="identity-footer-disclaimer mt-3">
              Built as an independent community initiative. Not affiliated with
              DFINITY Foundation or Internet Computer Protocol.
            </p>
          </div>

          <div>
            <h4 className="identity-footer-heading mb-4">
              <Zap className="w-4 h-4" />
              SNS Resources
            </h4>
            <div className="flex flex-col gap-2">
              {[
                {
                  label: "NNS Launchpad",
                  href: "https://nns.ic0.app/launchpad/",
                },
                { label: "NNS Dapp", href: "https://nns.ic0.app" },
                {
                  label: "ICP Dashboard",
                  href: "https://dashboard.internetcomputer.org",
                },
                {
                  label: "Internet Computer",
                  href: "https://internetcomputer.org",
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

export default function LaunchpadPage() {
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
        <StatsBar />
        <SnsProjectsSection />
        <HowItWorksSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
