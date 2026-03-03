import ConnectWalletModal from "@/components/ConnectWalletModal";
import {
  type ICPIdentity,
  checkEd25519Support,
  downloadIdentityFile,
  evaluatePasswordStrength,
  generateICPIdentity,
} from "@/lib/cryptoUtils";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Hash,
  Key,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  Shield,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
type GenerationState = "idle" | "generating" | "done" | "error";

interface CopyState {
  publicKey: boolean;
  identityId: boolean;
  encryptedPrivateKey: boolean;
}

// ── NavBar ────────────────────────────────────────────────────────────────────
function NavBar({ onConnectWallet }: { onConnectWallet: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "identity-nav-scrolled" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo mark */}
          <div className="flex items-center gap-3">
            <div className="identity-logo-mark">
              <div className="identity-logo-inner" />
            </div>
            <span className="identity-nav-title">ICP Protocol</span>
            <span className="identity-beta-badge">Prototype</span>
          </div>
          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: "Generate", id: "generate" },
              { label: "Security", id: "security" },
              { label: "Roadmap", id: "roadmap" },
            ].map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollTo(link.id)}
                className="identity-nav-link"
              >
                {link.label}
              </button>
            ))}
            <a href="/markets" className="identity-nav-link">
              Markets
            </a>
            <a href="/leaderboard" className="identity-nav-link">
              Leaderboard
            </a>
            <a href="/ecosystem" className="identity-nav-link">
              Ecosystem
            </a>
            <a href="/wallet" className="identity-nav-link">
              Wallet
            </a>
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

// ── HeroSection ───────────────────────────────────────────────────────────────
function HeroSection({
  onScrollToGenerate,
}: { onScrollToGenerate: () => void }) {
  return (
    <section className="identity-hero relative overflow-hidden">
      {/* Grid overlay */}
      <div className="identity-grid-overlay" />
      {/* Ambient orbs */}
      <div className="identity-orb identity-orb-1" />
      <div className="identity-orb identity-orb-2" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-20 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="identity-eyebrow-badge mb-8 animate-fade-in-down">
          <span className="identity-eyebrow-dot" />
          Community Prototype · Independent Initiative
        </div>

        {/* Headline */}
        <h1
          className="identity-headline animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          Create an ICP-Compatible
          <br />
          <span className="identity-headline-accent">Digital Identity</span>
        </h1>

        {/* Subheadline */}
        <p
          className="identity-subheadline mt-6 max-w-2xl animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Generate secure cryptographic keypairs for institutional onboarding
          and permissioned DLT environments. All operations run locally in your
          browser.
        </p>

        {/* CTA */}
        <div
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.35s" }}
        >
          <button
            type="button"
            onClick={onScrollToGenerate}
            className="identity-cta-primary group"
          >
            <Key className="w-4 h-4" />
            Generate Secure Identity
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("security")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="identity-cta-secondary"
          >
            <ShieldCheck className="w-4 h-4" />
            Security Info
          </button>
        </div>

        {/* Trust indicators */}
        <div
          className="mt-16 flex flex-wrap justify-center gap-8 animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          {[
            { icon: Lock, label: "Client-Side Only" },
            { icon: Shield, label: "No Server Calls" },
            { icon: Key, label: "Ed25519 Keypairs" },
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

// ── PasswordStrengthBar ───────────────────────────────────────────────────────
function PasswordStrengthBar({
  strength,
}: { strength: "weak" | "medium" | "strong" | null }) {
  if (!strength) return null;
  const levels = { weak: 1, medium: 2, strong: 3 };
  const colors = {
    weak: "identity-strength-weak",
    medium: "identity-strength-medium",
    strong: "identity-strength-strong",
  };
  const labels = { weak: "Weak", medium: "Medium", strong: "Strong" };
  const level = levels[strength];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${
              i <= level ? colors[strength] : "identity-strength-empty"
            }`}
          />
        ))}
      </div>
      <span
        className={`text-xs font-medium identity-strength-${strength}-text`}
      >
        {labels[strength]} password
      </span>
    </div>
  );
}

// ── CopyButton ────────────────────────────────────────────────────────────────
function CopyButton({
  isCopied,
  onCopy,
  label,
}: { isCopied: boolean; onCopy: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className={`identity-copy-btn ${isCopied ? "identity-copy-btn-copied" : ""}`}
      aria-label={`Copy ${label}`}
    >
      {isCopied ? (
        <span className="flex items-center gap-1">
          <Check className="w-3 h-3" />
          Copied!
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <Copy className="w-3 h-3" />
          Copy
        </span>
      )}
    </button>
  );
}

// ── IdentityField ─────────────────────────────────────────────────────────────
interface IdentityFieldProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  isCopied: boolean;
  onCopy: () => void;
}

function IdentityField({
  label,
  value,
  icon: Icon,
  isCopied,
  onCopy,
}: IdentityFieldProps) {
  return (
    <div className="identity-output-field">
      <div className="identity-output-field-header">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 identity-output-icon" />
          <span className="identity-output-label">{label}</span>
        </div>
        <CopyButton isCopied={isCopied} onCopy={onCopy} label={label} />
      </div>
      <div className="identity-output-value font-mono">{value}</div>
    </div>
  );
}

// ── GenerateSection ───────────────────────────────────────────────────────────
function GenerateSection() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<"weak" | "medium" | "strong" | null>(
    null,
  );
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generationState, setGenerationState] =
    useState<GenerationState>("idle");
  const [identity, setIdentity] = useState<ICPIdentity | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [copyState, setCopyState] = useState<CopyState>({
    publicKey: false,
    identityId: false,
    encryptedPrivateKey: false,
  });
  const [outputVisible, setOutputVisible] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkEd25519Support().then(setSupported);
  }, []);

  // Trigger animation when output appears
  useEffect(() => {
    if (generationState === "done") {
      // Small delay to let DOM render, then trigger animation
      const t = setTimeout(() => setOutputVisible(true), 50);
      return () => clearTimeout(t);
    }
    setOutputVisible(false);
  }, [generationState]);

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (val.length === 0) {
      setStrength(null);
      setPasswordError(null);
    } else {
      setStrength(evaluatePasswordStrength(val));
      if (val.length < 8) {
        setPasswordError("Password must be at least 8 characters");
      } else {
        setPasswordError(null);
      }
    }
  };

  const handleGenerate = useCallback(async () => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    setPasswordError(null);
    setGenerationState("generating");
    setIdentity(null);
    setErrorMessage(null);

    // Small artificial delay for UX feel
    await new Promise((r) => setTimeout(r, 400));

    try {
      const result = await generateICPIdentity(password);
      setIdentity(result);
      setGenerationState("done");
      setTimeout(() => {
        outputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 400);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to generate identity. Your browser may not support Ed25519.",
      );
      setGenerationState("error");
    }
  }, [password]);

  const handleReset = () => {
    setIdentity(null);
    setGenerationState("idle");
    setPassword("");
    setStrength(null);
    setPasswordError(null);
    setErrorMessage(null);
    setCopyState({
      publicKey: false,
      identityId: false,
      encryptedPrivateKey: false,
    });
    setOutputVisible(false);
  };

  const handleCopy = useCallback(
    async (field: keyof CopyState, value: string) => {
      await navigator.clipboard.writeText(value);
      setCopyState((prev) => ({ ...prev, [field]: true }));
      setTimeout(() => {
        setCopyState((prev) => ({ ...prev, [field]: false }));
      }, 2000);
    },
    [],
  );

  const handleDownload = () => {
    if (identity) downloadIdentityFile(identity);
  };

  return (
    <section id="generate" className="identity-section relative">
      <div className="identity-section-divider" />
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Section heading */}
        <div className="identity-section-heading mb-10">
          <div className="identity-section-eyebrow">
            <Key className="w-3.5 h-3.5" />
            Identity Generator
          </div>
          <h2 className="identity-section-title mt-3">
            Generate Secure Identity
          </h2>
          <p className="identity-section-subtitle mt-2">
            Enter a strong password to encrypt your private key. The password is
            never stored or transmitted.
          </p>
        </div>

        {/* Browser support warning */}
        {supported === false && (
          <div className="identity-warning mb-8">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              <div className="font-semibold mb-1">Browser Not Supported</div>
              <div className="text-sm opacity-80">
                Ed25519 key generation requires Chrome 100+, Firefox 130+, or
                Safari 17+. Please update your browser and try again.
              </div>
            </div>
          </div>
        )}

        {/* Generator card */}
        <div className="identity-card">
          {/* Inner top accent line */}
          <div className="identity-card-top-line" />

          {/* Form (shown when not done) */}
          {generationState !== "done" && (
            <div className="animate-fade-in">
              {/* Password field */}
              <div className="mb-6">
                <label htmlFor="enc-password" className="identity-label">
                  Encryption Password
                </label>
                <div className="relative mt-2">
                  <input
                    id="enc-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className={`identity-input pr-10 ${passwordError ? "identity-input-error" : ""}`}
                    disabled={generationState === "generating"}
                    autoComplete="new-password"
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        !passwordError &&
                        password.length >= 8
                      ) {
                        void handleGenerate();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="identity-show-password-btn"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Password strength */}
                {password.length > 0 && strength && (
                  <PasswordStrengthBar strength={strength} />
                )}

                {/* Error */}
                {passwordError && (
                  <p className="identity-field-error mt-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Info note */}
              <div className="identity-info-note mb-6">
                <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <p>
                  Your password derives an AES-256-GCM key via PBKDF2 (100,000
                  iterations) to encrypt the private key. It is never stored
                  anywhere.
                </p>
              </div>

              {/* Generate button */}
              <button
                type="button"
                onClick={() => void handleGenerate()}
                disabled={
                  generationState === "generating" ||
                  !password ||
                  password.length < 8 ||
                  supported === false
                }
                className="identity-generate-btn w-full"
              >
                {generationState === "generating" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Identity...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    Generate Secure Identity
                  </>
                )}
              </button>

              {/* Error state */}
              {generationState === "error" && errorMessage && (
                <div className="identity-warning mt-4 animate-fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="text-sm">{errorMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* Output (shown when done) */}
          {generationState === "done" && (
            <div
              ref={outputRef}
              className={`${outputVisible ? "animate-fade-in-up" : "opacity-0"}`}
            >
              {/* Success header */}
              <div className="identity-success-header mb-6">
                <div className="identity-success-icon">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="identity-success-title">
                    Identity Generated Successfully
                  </div>
                  <div className="identity-success-sub">
                    Save your password — without it, your encrypted key cannot
                    be recovered.
                  </div>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-4 mb-6">
                {identity && (
                  <>
                    <IdentityField
                      label="Public Key"
                      value={identity.publicKey}
                      icon={Key}
                      isCopied={copyState.publicKey}
                      onCopy={() =>
                        void handleCopy("publicKey", identity.publicKey)
                      }
                    />
                    <IdentityField
                      label="Identity ID"
                      value={identity.identityId}
                      icon={Hash}
                      isCopied={copyState.identityId}
                      onCopy={() =>
                        void handleCopy("identityId", identity.identityId)
                      }
                    />
                    <IdentityField
                      label="Encrypted Private Key"
                      value={identity.encryptedPrivateKey}
                      icon={Lock}
                      isCopied={copyState.encryptedPrivateKey}
                      onCopy={() =>
                        void handleCopy(
                          "encryptedPrivateKey",
                          identity.encryptedPrivateKey,
                        )
                      }
                    />
                  </>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="identity-download-btn flex-1"
                >
                  <Download className="w-4 h-4" />
                  Download Identity File
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="identity-reset-btn"
                >
                  <RefreshCw className="w-4 h-4" />
                  Generate New
                </button>
              </div>

              {/* Timestamp */}
              {identity && (
                <p className="identity-timestamp mt-4">
                  Generated: {new Date(identity.createdAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── SecuritySection ───────────────────────────────────────────────────────────
function SecuritySection() {
  const points = [
    {
      icon: Lock,
      title: "Local Computation",
      text: "All cryptographic operations run entirely within your browser. No data is sent to any server at any time.",
    },
    {
      icon: Shield,
      title: "Web Crypto API",
      text: "Key generation uses the browser's native Web Crypto API with Ed25519 and AES-256-GCM — standards used in enterprise DLT systems.",
    },
    {
      icon: AlertTriangle,
      title: "Password Responsibility",
      text: "Your password derives the encryption key via PBKDF2 with 100,000 iterations. Without it, your private key cannot be recovered.",
    },
    {
      icon: ShieldCheck,
      title: "Independent Prototype",
      text: "This is an independent community prototype. It is not affiliated with Internet Computer Protocol (ICP), DFINITY Foundation, or any official organization.",
    },
  ];

  return (
    <section id="security" className="identity-section relative">
      <div className="identity-section-divider" />
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <div className="identity-section-heading text-center mb-12">
          <div className="identity-section-eyebrow mx-auto">
            <Shield className="w-3.5 h-3.5" />
            Security & Privacy
          </div>
          <h2 className="identity-section-title mt-3">Security Notice</h2>
          <p className="identity-section-subtitle mt-2 max-w-xl mx-auto">
            Understanding how this tool protects your cryptographic identity.
          </p>
        </div>

        {/* Primary notice */}
        <div className="identity-security-notice mb-10">
          <div className="identity-security-notice-icon">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="identity-security-notice-title">
              Privacy Guarantee
            </h3>
            <p className="identity-security-notice-text mt-1">
              This tool generates keys locally in your browser. No data is
              transmitted to any server. This is an independent community
              prototype and is not affiliated with Internet Computer Protocol
              (ICP).
            </p>
            <p className="identity-security-notice-sub mt-3">
              Store your password securely. Without it, your encrypted private
              key cannot be recovered.
            </p>
          </div>
        </div>

        {/* Security points grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {points.map(({ icon: Icon, title, text }) => (
            <div key={title} className="identity-security-card">
              <div className="identity-security-card-icon">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="identity-security-card-title">{title}</h4>
                <p className="identity-security-card-text mt-1">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── RoadmapSection ────────────────────────────────────────────────────────────
const ROADMAP_PHASES = [
  {
    phase: "Phase 1",
    title: "Identity Generator",
    status: "active" as const,
    statusLabel: "Active",
    description:
      "Generate and export ICP-compatible cryptographic identities using Ed25519 keypairs encrypted with AES-256-GCM.",
    features: [
      "Ed25519 keypair generation",
      "AES-256-GCM private key encryption",
      "Identity ID (SHA-256 hash)",
      "JSON identity export",
    ],
  },
  {
    phase: "Phase 2",
    title: "Participant Node Integration",
    status: "upcoming" as const,
    statusLabel: "Upcoming",
    description:
      "Connect identities to ICP nodes for seamless network onboarding and identity verification workflows.",
    features: [
      "Node connection interface",
      "Identity verification",
      "Participant onboarding flow",
      "Network status dashboard",
    ],
  },
  {
    phase: "Phase 3",
    title: "Institutional Onboarding API",
    status: "future" as const,
    statusLabel: "Future",
    description:
      "REST API for enterprise identity management, batch provisioning, and integration with institutional custody solutions.",
    features: [
      "REST API endpoints",
      "Batch identity provisioning",
      "Enterprise key management",
      "Custody system integration",
    ],
  },
];

function RoadmapSection() {
  return (
    <section id="roadmap" className="identity-section relative">
      <div className="identity-section-divider" />
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <div className="identity-section-heading text-center mb-12">
          <div className="identity-section-eyebrow mx-auto">
            <ChevronRight className="w-3.5 h-3.5" />
            Development Roadmap
          </div>
          <h2 className="identity-section-title mt-3">Development Roadmap</h2>
          <p className="identity-section-subtitle mt-2 max-w-lg mx-auto">
            A phased approach to building a complete ICP-compatible identity
            infrastructure.
          </p>
        </div>

        {/* Phase cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROADMAP_PHASES.map((phase, index) => (
            <div
              key={phase.phase}
              className={`identity-roadmap-card identity-roadmap-card-${phase.status} animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Phase label + status badge */}
              <div className="flex items-start justify-between mb-4">
                <span className="identity-roadmap-phase-label">
                  {phase.phase}
                </span>
                <span
                  className={`identity-roadmap-badge identity-roadmap-badge-${phase.status}`}
                >
                  {phase.statusLabel}
                </span>
              </div>

              {/* Title */}
              <h3 className="identity-roadmap-title mb-3">{phase.title}</h3>

              {/* Description */}
              <p className="identity-roadmap-desc mb-5">{phase.description}</p>

              {/* Feature list */}
              <ul className="space-y-2">
                {phase.features.map((feature) => (
                  <li key={feature} className="identity-roadmap-feature">
                    <div
                      className={`identity-roadmap-dot identity-roadmap-dot-${phase.status}`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
              ICP-Compatible Identity &amp; Wallet Prototype
            </p>
            <p className="identity-footer-disclaimer mt-3">
              Built as an independent community initiative. Not affiliated with
              DFINITY Foundation or Internet Computer Protocol.
            </p>
          </div>

          {/* Collaboration */}
          <div>
            <h4 className="identity-footer-heading mb-4">
              <Users className="w-4 h-4" />
              Open for Collaboration
            </h4>
            <p className="identity-footer-body">
              This project is open to contributors, researchers, and
              institutions interested in ICP identity tooling. Community
              participation is welcome.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="identity-footer-link mt-3 inline-flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              View on GitHub (Coming Soon)
            </a>
          </div>

          {/* Contact */}
          <div>
            <h4 className="identity-footer-heading mb-4">
              <Mail className="w-4 h-4" />
              Contact
            </h4>
            <p className="identity-footer-body">
              For inquiries, contributions, or partnership discussions, reach
              out at:
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
export default function IdentityPrototypePage() {
  const [walletOpen, setWalletOpen] = useState(false);

  const scrollToGenerate = () => {
    document.getElementById("generate")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="identity-page">
      <NavBar onConnectWallet={() => setWalletOpen(true)} />
      <ConnectWalletModal
        isOpen={walletOpen}
        onClose={() => setWalletOpen(false)}
      />
      <main>
        <HeroSection onScrollToGenerate={scrollToGenerate} />
        <GenerateSection />
        <SecuritySection />
        <RoadmapSection />
      </main>
      <Footer />
    </div>
  );
}
