import ConnectWalletModal from "@/components/ConnectWalletModal";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  Database,
  ExternalLink,
  GitBranch,
  Layers,
  Play,
  Shield,
  Terminal,
  Wallet,
  Zap,
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
            {[
              { label: "Identity", href: "/" },
              { label: "Markets", href: "/markets" },
              { label: "Launchpad", href: "/launchpad" },
              { label: "Ecosystem", href: "/ecosystem" },
              { label: "Wallet", href: "/wallet" },
              { label: "Integration", href: "/integration" },
              { label: "Dev Docs", href: "/developer" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`identity-nav-link ${link.href === "/integration" ? "eco-nav-active" : ""}`}
                data-ocid={`nav.${link.label
                  .toLowerCase()
                  .replace(/\s+/g, "_")
                  .replace(/[^a-z0-9_]/g, "")}.link`}
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

// ── CodeBlock ─────────────────────────────────────────────────────────────────
function CodeBlock({
  code,
  language = "bash",
  title,
}: { code: string; language?: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ig-code-block">
      {title && (
        <div className="ig-code-header">
          <div className="flex items-center gap-2">
            <div className="ig-code-dot ig-code-dot-red" />
            <div className="ig-code-dot ig-code-dot-yellow" />
            <div className="ig-code-dot ig-code-dot-green" />
            <span className="ig-code-filename">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="ig-code-lang">{language}</span>
            <button
              type="button"
              onClick={() => void handleCopy()}
              className={`ig-copy-btn ${copied ? "ig-copy-btn-copied" : ""}`}
              aria-label="Copy code"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}
      {!title && (
        <div className="ig-code-header-simple">
          <span className="ig-code-lang">{language}</span>
          <button
            type="button"
            onClick={() => void handleCopy()}
            className={`ig-copy-btn ${copied ? "ig-copy-btn-copied" : ""}`}
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy
              </>
            )}
          </button>
        </div>
      )}
      <pre className="ig-code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ── Architecture Diagram ──────────────────────────────────────────────────────
function ArchDiagram() {
  return (
    <div className="ig-arch-diagram">
      <div className="ig-arch-title">
        <Layers className="w-4 h-4" />
        Integration Architecture
      </div>
      <div className="ig-arch-flow">
        <div className="ig-arch-box ig-arch-box-frontend">
          <div className="ig-arch-box-icon">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="ig-arch-box-label">Frontend</div>
          <div className="ig-arch-box-sub">dApp React</div>
        </div>
        <div className="ig-arch-connector">
          <div className="ig-arch-line" />
          <ArrowRight className="w-4 h-4 ig-arch-arrow" />
          <div className="ig-arch-connector-label">HTTP / WebSocket</div>
        </div>
        <div className="ig-arch-box ig-arch-box-gateway">
          <div className="ig-arch-box-icon">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="ig-arch-box-label">Internet Identity</div>
          <div className="ig-arch-box-sub">identity.ic0.app</div>
        </div>
        <div className="ig-arch-connector">
          <div className="ig-arch-line" />
          <ArrowRight className="w-4 h-4 ig-arch-arrow" />
          <div className="ig-arch-connector-label">Agent JS</div>
        </div>
        <div className="ig-arch-box ig-arch-box-canton">
          <div className="ig-arch-box-icon">
            <Database className="w-5 h-5" />
          </div>
          <div className="ig-arch-box-label">ICP Canister</div>
          <div className="ig-arch-box-sub">Mainnet / Local Dev</div>
        </div>
      </div>
    </div>
  );
}

// ── Step data ─────────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: "setup",
    step: "01",
    icon: GitBranch,
    title: "Setup Project",
    description:
      "Create a new ICP dApp project using the DFX SDK and install dependencies.",
    color: "blue",
    content: (
      <div className="space-y-4">
        <p className="ig-step-text">
          Create a new Internet Computer dApp project using the official DFX
          tool and install required dependencies.
        </p>
        <CodeBlock
          code={`npm create dfx-app@latest my-dapp
cd my-dapp && npm install`}
          language="bash"
          title="Terminal"
        />
        <div className="ig-step-prereq">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <div>
            <div className="ig-step-prereq-title">Prerequisites</div>
            <div className="ig-step-prereq-items">
              <span>Node.js 18+</span>
              <span>DFX SDK</span>
              <span>Internet Identity</span>
              <span>Plug Wallet (optional)</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "build",
    step: "02",
    icon: Layers,
    title: "Install ICP SDK",
    description:
      "Install the ICP Agent JS SDK packages for authentication and canister communication.",
    color: "gold",
    content: (
      <div className="space-y-4">
        <p className="ig-step-text">
          Install the official ICP SDK packages for agent communication and
          Internet Identity authentication.
        </p>
        <CodeBlock
          code={
            "npm install @dfinity/agent @dfinity/auth-client @dfinity/principal"
          }
          language="bash"
          title="Terminal"
        />
        <p className="ig-step-text">This installs the following packages:</p>
        <div className="ig-module-list">
          {[
            {
              name: "@dfinity/agent",
              desc: "HTTP agent for ICP canister calls",
            },
            {
              name: "@dfinity/auth-client",
              desc: "Internet Identity authentication",
            },
            { name: "@dfinity/principal", desc: "Principal ID utilities" },
          ].map((m) => (
            <div key={m.name} className="ig-module-item">
              <CheckCircle2 className="w-3.5 h-3.5 ig-module-check" />
              <div>
                <code className="ig-module-name">{m.name}</code>
                <span className="ig-module-desc"> — {m.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "canton",
    step: "03",
    icon: Database,
    title: "Configure Internet Identity",
    description:
      "Set up AuthClient to authenticate users with Internet Identity on ICP.",
    color: "green",
    content: (
      <div className="space-y-4">
        <p className="ig-step-text">
          Create an AuthClient instance and configure the Internet Identity
          provider for user authentication.
        </p>
        <CodeBlock
          code={`import { AuthClient } from "@dfinity/auth-client";

export async function initAuth() {
  const authClient = await AuthClient.create();
  
  // Check if already authenticated
  if (await authClient.isAuthenticated()) {
    const identity = authClient.getIdentity();
    console.log("Already authenticated:", identity.getPrincipal().toString());
    return authClient;
  }

  // Login with Internet Identity
  await authClient.login({
    identityProvider: "https://identity.ic0.app",
    onSuccess: () => console.log("Login successful"),
    onError: (err) => console.error("Login failed:", err),
  });
  
  return authClient;
}`}
          language="typescript"
          title="src/auth.ts"
        />
      </div>
    ),
  },
  {
    id: "gateway",
    step: "04",
    icon: Play,
    title: "Create Actor",
    description:
      "Create an ICP Actor to interact with your canister smart contract.",
    color: "purple",
    content: (
      <div className="space-y-4">
        <p className="ig-step-text">
          Use the authenticated identity to create an Actor that communicates
          with your deployed ICP canister.
        </p>
        <CodeBlock
          code={`import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "./declarations/backend";

export async function createActor(identity: Identity) {
  const agent = await HttpAgent.create({
    identity,
    host: "https://ic0.app",
  });

  return Actor.createActor(idlFactory, {
    agent,
    canisterId: process.env.VITE_CANISTER_ID ?? "",
  });
}`}
          language="typescript"
          title="src/actor.ts"
        />
        <div className="ig-callout ig-callout-warning">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <div>
            <div className="ig-callout-title">Local Development Note</div>
            <p className="ig-callout-text">
              For local dev with{" "}
              <code className="ig-inline-code">dfx start</code>, call{" "}
              <code className="ig-inline-code">agent.fetchRootKey()</code> after
              creating the agent. Never call this on mainnet.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "connect",
    step: "05",
    icon: Wallet,
    title: "Build Frontend",
    description:
      "Implement the Internet Identity login button in your React dApp.",
    color: "blue",
    content: (
      <div className="space-y-4">
        <p className="ig-step-text">
          Create a React component with the Internet Identity login flow and
          principal display.
        </p>
        <CodeBlock
          code={`import { useState } from "react";
import { initAuth } from "./auth";

export function LoginButton() {
  const [principal, setPrincipal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const authClient = await initAuth();
      const identity = authClient.getIdentity();
      setPrincipal(identity.getPrincipal().toString());
    } finally {
      setLoading(false);
    }
  };

  return principal ? (
    <p>Connected: {principal.slice(0, 10)}…</p>
  ) : (
    <button onClick={handleLogin} disabled={loading}>
      {loading ? "Connecting..." : "Connect with Internet Identity"}
    </button>
  );
}`}
          language="tsx"
          title="LoginButton.tsx"
        />
        <div className="ig-flow-steps">
          <div className="ig-flow-title">Connection Flow</div>
          {[
            "User clicks Connect with Internet Identity",
            "Internet Identity popup opens",
            "User authenticates with their anchor",
            "Principal ID returned to dApp",
          ].map((step, i) => (
            <div key={step} className="ig-flow-step">
              <div className="ig-flow-step-num">{i + 1}</div>
              <span className="ig-flow-step-text">{step}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "transaction",
    step: "06",
    icon: Zap,
    title: "Deploy to ICP",
    description: "Deploy your dApp to the Internet Computer mainnet using DFX.",
    color: "gold",
    content: (
      <div className="space-y-4">
        <p className="ig-step-text">
          Deploy your canister and frontend to the Internet Computer mainnet.
          Make sure you have ICP cycles for deployment.
        </p>
        <CodeBlock
          code={`# Deploy to ICP mainnet
dfx deploy --network ic

# Check deployment status
dfx canister --network ic status backend`}
          language="bash"
          title="Deploy to Mainnet"
        />
        <p className="ig-step-text">The deployment process:</p>
        <div className="ig-sdk-steps">
          {[
            {
              step: "Build",
              desc: "Compiles Motoko/Rust canister code to Wasm",
            },
            { step: "Install", desc: "Uploads Wasm to Internet Computer" },
            {
              step: "Live",
              desc: "Internet Computer commits canister to the network",
            },
          ].map((item) => (
            <div key={item.step} className="ig-sdk-step">
              <div className="ig-sdk-step-badge">{item.step}</div>
              <span className="ig-sdk-step-desc">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "explorer",
    step: "07",
    icon: ExternalLink,
    title: "Check on ICP Dashboard",
    description:
      "Verify your canister deployment and monitor activity on the ICP Dashboard.",
    color: "green",
    content: (
      <div className="space-y-4">
        <p className="ig-step-text">
          Use the official ICP Dashboard to verify your deployment, inspect
          canister activity, and monitor network statistics.
        </p>
        <a
          href="https://dashboard.internetcomputer.org"
          target="_blank"
          rel="noopener noreferrer"
          className="ig-explorer-link"
        >
          <div className="flex items-center gap-3">
            <div className="ig-explorer-icon">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div>
              <div className="ig-explorer-name">ICP Dashboard</div>
              <div className="ig-explorer-url">
                dashboard.internetcomputer.org
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 ig-explorer-arrow" />
        </a>
        <p className="ig-step-text">
          For local dev, inspect canister status with DFX:
        </p>
        <CodeBlock
          code={`# View canister info
dfx canister info backend

# Check canister logs
dfx canister logs backend`}
          language="bash"
          title="Local Canister Inspection"
        />
      </div>
    ),
  },
];

// ── Production Config Section ─────────────────────────────────────────────────
function ProductionSection() {
  return (
    <section className="ig-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="ig-section-header">
          <div className="identity-section-eyebrow mx-auto">
            <Shield className="w-3.5 h-3.5" />
            Production Deployment
          </div>
          <h2 className="identity-section-title mt-3 text-center">
            Deploy to Internet Computer
          </h2>
          <p className="identity-section-subtitle mt-2 text-center max-w-xl mx-auto">
            When moving from local development to production ICP mainnet, update
            your canister configuration and ensure you have enough cycles.
          </p>
        </div>
        <div className="ig-prod-grid">
          <div className="ig-prod-card">
            <h3 className="ig-prod-card-title">ICP Canister Configuration</h3>
            <CodeBlock
              code={`// Production ICP configuration
export const config = {
  icHost: "https://ic0.app",
  identityProvider: "https://identity.ic0.app",
  canisterId: process.env.VITE_CANISTER_ID ?? "",
  ledgerCanisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
};`}
              language="typescript"
              title="src/config.ts"
            />
          </div>
          <div className="ig-prod-checklist">
            <h3 className="ig-prod-card-title">Production Checklist</h3>
            <div className="ig-checklist">
              {[
                {
                  done: true,
                  item: "Set IC host to https://ic0.app for mainnet",
                },
                { done: true, item: "Configure Internet Identity provider" },
                { done: true, item: "Set canisterId from dfx deploy output" },
                { done: false, item: "Obtain ICP cycles for deployment" },
                {
                  done: false,
                  item: "Configure CORS for your frontend domain",
                },
                { done: false, item: "Remove fetchRootKey() for mainnet" },
                { done: false, item: "Set up monitoring and alerting" },
              ].map((item) => (
                <div key={item.item} className="ig-checklist-item">
                  <div
                    className={`ig-checklist-icon ${item.done ? "ig-checklist-done" : "ig-checklist-todo"}`}
                  >
                    {item.done ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </div>
                  <span
                    className={`ig-checklist-text ${item.done ? "ig-checklist-text-done" : ""}`}
                  >
                    {item.item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function IntegrationGuidePage() {
  const [walletOpen, setWalletOpen] = useState(false);

  return (
    <div className="identity-page">
      <NavBar onConnectWallet={() => setWalletOpen(true)} />
      <ConnectWalletModal
        isOpen={walletOpen}
        onClose={() => setWalletOpen(false)}
      />

      {/* Hero */}
      <section className="ig-hero">
        <div className="identity-grid-overlay" />
        <div className="identity-orb identity-orb-1" />
        <div className="identity-orb identity-orb-2" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
          <div className="flex flex-col items-start max-w-3xl">
            <div className="identity-eyebrow-badge mb-6">
              <BookOpen className="w-3.5 h-3.5" />
              Developer Integration Guide
            </div>
            <h1 className="ig-hero-title">
              ICP Integration Guide
              <br />
              <span className="identity-headline-accent">Step-by-Step</span>
            </h1>
            <p className="ig-hero-sub mt-6 max-w-xl">
              Connect your dApp to the Internet Computer using Internet Identity
              and ICP Agent JS. Covers setup, authentication, canister calls,
              and production deployment.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-10">
              <a
                href="https://github.com/dfinity"
                target="_blank"
                rel="noopener noreferrer"
                className="identity-cta-primary group"
              >
                <GitBranch className="w-4 h-4" />
                View DFINITY GitHub
                <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
              <button
                type="button"
                onClick={() => setWalletOpen(true)}
                className="identity-cta-secondary"
              >
                <Wallet className="w-4 h-4" />
                Try Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </section>

      <main>
        {/* Architecture section */}
        <section className="ig-section">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <ArchDiagram />
          </div>
        </section>

        {/* Steps */}
        <section className="ig-section">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="ig-section-header">
              <div className="identity-section-eyebrow mx-auto">
                <Terminal className="w-3.5 h-3.5" />
                Integration Steps
              </div>
              <h2 className="identity-section-title mt-3 text-center">
                7 Steps to Integration
              </h2>
            </div>

            <div className="ig-steps-list">
              {STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.id}
                    id={`step-${step.id}`}
                    className={`ig-step-card ig-step-card-${step.color}`}
                  >
                    <div className="ig-step-left">
                      <div
                        className={`ig-step-badge ig-step-badge-${step.color}`}
                      >
                        <span className="ig-step-badge-num">{step.step}</span>
                      </div>
                      <div
                        className={`ig-step-icon-wrap ig-step-icon-wrap-${step.color}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="ig-step-connector" />
                    </div>
                    <div className="ig-step-right">
                      <h3 className="ig-step-title">{step.title}</h3>
                      <p className="ig-step-desc">{step.description}</p>
                      <div className="ig-step-content-wrap">{step.content}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Production section */}
        <ProductionSection />
      </main>

      {/* Footer */}
      <footer className="identity-footer">
        <div className="identity-footer-top-line" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="identity-footer-bottom">
            <p className="identity-footer-copyright">
              © {new Date().getFullYear()} ICP Integration Guide. Community
              Initiative.
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
