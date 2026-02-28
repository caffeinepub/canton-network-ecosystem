import ConnectWalletModal from "@/components/ConnectWalletModal";
import {
  BookOpen,
  Check,
  ChevronRight,
  Code2,
  Copy,
  ExternalLink,
  FileJson,
  Package,
  Settings,
  Shield,
  Terminal,
  Wallet,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
              { label: "Ecosystem", href: "/ecosystem" },
              { label: "Wallet", href: "/wallet" },
              { label: "Integration", href: "/integration" },
              { label: "Dev Docs", href: "/developer" },
              { label: "Featured Apps", href: "/featured-apps" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`identity-nav-link ${link.href === "/developer" ? "eco-nav-active" : ""}`}
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
  language = "typescript",
  title,
}: {
  code: string;
  language?: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ig-code-block">
      <div className="ig-code-header">
        <div className="flex items-center gap-2">
          <div className="ig-code-dot ig-code-dot-red" />
          <div className="ig-code-dot ig-code-dot-yellow" />
          <div className="ig-code-dot ig-code-dot-green" />
          {title && <span className="ig-code-filename">{title}</span>}
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
      <pre className="ig-code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ── Section data ──────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "quickstart", label: "Quick Start", icon: Zap },
  { id: "install", label: "Install SDK", icon: Package },
  { id: "connect-wallet", label: "connectWallet.ts", icon: Code2 },
  { id: "react-integration", label: "React Integration", icon: BookOpen },
  { id: "transactions", label: "Submit Transaction", icon: Terminal },
  { id: "identity-format", label: "Identity File Format", icon: FileJson },
  { id: "production", label: "Production Config", icon: Settings },
];

// ── SidebarNav ────────────────────────────────────────────────────────────────
function SidebarNav({ activeSection }: { activeSection: string }) {
  const scrollToSection = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="dd-sidebar" aria-label="Documentation navigation">
      <div className="dd-sidebar-title">
        <BookOpen className="w-3.5 h-3.5" />
        Contents
      </div>
      <ul className="dd-sidebar-list">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => scrollToSection(s.id)}
                className={`dd-sidebar-item ${activeSection === s.id ? "dd-sidebar-item-active" : ""}`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {s.label}
                {activeSection === s.id && (
                  <ChevronRight className="w-3 h-3 ml-auto" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="dd-sidebar-footer">
        <a
          href="https://github.com/hyperledger-labs/splice-wallet-kernel"
          target="_blank"
          rel="noopener noreferrer"
          className="dd-sidebar-ext-link"
        >
          <ExternalLink className="w-3 h-3" />
          GitHub Repository
        </a>
        <a href="/integration" className="dd-sidebar-ext-link mt-1">
          <BookOpen className="w-3 h-3" />
          Integration Guide
        </a>
      </div>
    </nav>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function DocSection({
  id,
  icon: Icon,
  title,
  badge,
  children,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="dd-section">
      <div className="dd-section-header">
        <div className="dd-section-icon-wrap">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="dd-section-title">{title}</h2>
          {badge && <span className="dd-section-badge">{badge}</span>}
        </div>
      </div>
      <div className="dd-section-body">{children}</div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DeveloperDocsPage() {
  const [walletOpen, setWalletOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("quickstart");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection observer for active section tracking
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) observerRef.current?.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="identity-page">
      <NavBar onConnectWallet={() => setWalletOpen(true)} />
      <ConnectWalletModal
        isOpen={walletOpen}
        onClose={() => setWalletOpen(false)}
      />

      {/* Hero */}
      <section className="dd-hero">
        <div className="identity-grid-overlay" />
        <div className="identity-orb identity-orb-1" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-16">
          <div className="flex flex-col items-start max-w-2xl">
            <div className="identity-eyebrow-badge mb-6">
              <Code2 className="w-3.5 h-3.5" />
              Developer Documentation
            </div>
            <h1 className="ig-hero-title">
              ICP SDK
              <br />
              <span className="identity-headline-accent">Reference Docs</span>
            </h1>
            <p className="ig-hero-sub mt-5 max-w-lg">
              Copy-paste ready code snippets for integrating ICP Protocol wallet
              functionality into your dApp using the splice-wallet SDK.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <button
                type="button"
                onClick={() => setWalletOpen(true)}
                className="identity-cta-primary"
              >
                <Wallet className="w-4 h-4" />
                Try Connect Wallet
              </button>
              <a href="/integration" className="identity-cta-secondary">
                <BookOpen className="w-4 h-4" />
                Integration Guide
              </a>
            </div>
          </div>
        </div>
      </section>

      <main>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="dd-layout">
            {/* Sticky sidebar */}
            <div className="dd-sidebar-col">
              <div className="dd-sidebar-sticky">
                <SidebarNav activeSection={activeSection} />
              </div>
            </div>

            {/* Content */}
            <div className="dd-content-col">
              {/* Quick Start */}
              <DocSection
                id="quickstart"
                icon={Zap}
                title="Quick Start"
                badge="5 min"
              >
                <p className="dd-body-text">
                  Get up and running with the Canton wallet SDK in under 5
                  minutes.
                </p>
                <div className="dd-prereq-list">
                  <div className="dd-prereq-title">Prerequisites</div>
                  {[
                    "Node.js 18 or higher",
                    "Yarn package manager",
                    "Access to a Canton Network node (local or remote)",
                  ].map((req) => (
                    <div key={req} className="dd-prereq-item">
                      <Check className="w-3.5 h-3.5 dd-prereq-icon" />
                      {req}
                    </div>
                  ))}
                </div>
                <p className="dd-body-text mt-4">
                  Three commands to get started:
                </p>
                <CodeBlock
                  code={`git clone https://github.com/hyperledger-labs/splice-wallet-kernel.git
cd splice-wallet-kernel
yarn install && yarn build:all && yarn start:all`}
                  language="bash"
                  title="Terminal"
                />
              </DocSection>

              {/* Install SDK */}
              <DocSection id="install" icon={Package} title="Install SDK">
                <p className="dd-body-text">
                  Add the dApp SDK to your existing project using npm or yarn.
                </p>
                <CodeBlock
                  code={`npm install @splice-wallet/dapp-sdk
# or
yarn add @splice-wallet/dapp-sdk`}
                  language="bash"
                  title="Package Installation"
                />
                <div className="dd-info-box">
                  <Shield className="w-4 h-4 shrink-0 dd-info-icon" />
                  <div>
                    <div className="dd-info-title">TypeScript Support</div>
                    <p className="dd-info-text">
                      The SDK includes TypeScript type definitions. No
                      additional <code className="ig-inline-code">@types</code>{" "}
                      package needed.
                    </p>
                  </div>
                </div>
              </DocSection>

              {/* connectWallet.ts */}
              <DocSection
                id="connect-wallet"
                icon={Code2}
                title="connectWallet.ts"
              >
                <p className="dd-body-text">
                  Create a wallet client and export the{" "}
                  <code className="ig-inline-code">connectWallet</code>{" "}
                  function. This establishes a session with the Wallet Gateway.
                </p>
                <CodeBlock
                  code={`import { createWalletClient } from "@splice-wallet/dapp-sdk";

const wallet = createWalletClient({
  gatewayUrl: "http://localhost:3001",
});

export async function connectWallet() {
  const session = await wallet.connect();
  console.log("Connected account:", session.account);
  return session;
}`}
                  language="typescript"
                  title="src/connectWallet.ts"
                />
                <div className="dd-param-table">
                  <div className="dd-param-header">
                    <span>Parameter</span>
                    <span>Type</span>
                    <span>Description</span>
                  </div>
                  {[
                    {
                      param: "gatewayUrl",
                      type: "string",
                      desc: "URL of the running Wallet Gateway",
                    },
                    {
                      param: "session.account",
                      type: "string",
                      desc: "Canton account address after connect",
                    },
                    {
                      param: "session.token",
                      type: "string",
                      desc: "Session authentication token",
                    },
                  ].map((row) => (
                    <div key={row.param} className="dd-param-row">
                      <code className="dd-param-name">{row.param}</code>
                      <code className="dd-param-type">{row.type}</code>
                      <span className="dd-param-desc">{row.desc}</span>
                    </div>
                  ))}
                </div>
              </DocSection>

              {/* React Integration */}
              <DocSection
                id="react-integration"
                icon={BookOpen}
                title="React Integration"
              >
                <p className="dd-body-text">
                  A complete React component that handles connection state,
                  loading, and error conditions.
                </p>
                <CodeBlock
                  code={`import { useState } from "react";
import { connectWallet } from "./connectWallet";

export function WalletConnectButton() {
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const session = await connectWallet();
      setAccount(session.account);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {account ? (
        <p>Connected: {account}</p>
      ) : (
        <>
          <button onClick={handleConnect} disabled={loading}>
            {loading ? "Connecting..." : "Connect Canton Wallet"}
          </button>
          {error && <p className="error">{error}</p>}
        </>
      )}
    </div>
  );
}`}
                  language="tsx"
                  title="WalletConnectButton.tsx"
                />
              </DocSection>

              {/* Submit Transaction */}
              <DocSection
                id="transactions"
                icon={Terminal}
                title="Submit Transaction"
              >
                <p className="dd-body-text">
                  After connecting, submit transactions to the Canton ledger.
                  Always include error handling for production use.
                </p>
                <CodeBlock
                  code={`import { connectWallet } from "./connectWallet";

async function sendTransaction() {
  let session;
  
  try {
    session = await connectWallet();
  } catch (err) {
    console.error("Failed to connect wallet:", err);
    return;
  }

  try {
    const result = await wallet.submitTransaction({
      templateId: "Splice.Canton:Transfer",
      payload: {
        owner: session.account,
        recipient: "canton::1220recipient...",
        amount: 100,
        currency: "CC",
        note: "Payment for services"
      }
    });

    console.log("Transaction committed:", result.transactionId);
    return result;
  } catch (err) {
    console.error("Transaction failed:", err);
    throw err;
  }
}`}
                  language="typescript"
                  title="sendTransaction.ts"
                />
                <div className="dd-info-box">
                  <Terminal className="w-4 h-4 shrink-0 dd-info-icon" />
                  <div>
                    <div className="dd-info-title">Transaction Flow</div>
                    <div className="dd-tx-flow">
                      {[
                        "Sign locally",
                        "Submit to Gateway",
                        "Gateway forwards to Ledger API",
                        "Canton commits",
                      ].map((step, i) => (
                        <div key={step} className="dd-tx-step">
                          <span className="dd-tx-num">{i + 1}</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DocSection>

              {/* Identity File Format */}
              <DocSection
                id="identity-format"
                icon={FileJson}
                title="Identity File Format"
              >
                <p className="dd-body-text">
                  The standard JSON schema for ICP-compatible identity files
                  exported by the Identity Generator.
                </p>
                <CodeBlock
                  code={`{
  "identity_id": "sha256-hash-of-public-key",
  "public_key": "base64-encoded-ed25519-public-key",
  "encrypted_private_key": "aes256gcm-encrypted-base64",
  "created_at": "2026-01-01T00:00:00.000Z",
  "type": "icp-compatible-identity"
}`}
                  language="json"
                  title="identity.json"
                />
                <div className="dd-schema-table">
                  <div className="dd-schema-header">
                    <span>Field</span>
                    <span>Format</span>
                    <span>Description</span>
                  </div>
                  {[
                    {
                      field: "identity_id",
                      format: "hex string",
                      desc: "SHA-256 hash of the public key",
                    },
                    {
                      field: "public_key",
                      format: "base64",
                      desc: "Ed25519 public key, base64 encoded",
                    },
                    {
                      field: "encrypted_private_key",
                      format: "base64",
                      desc: "AES-256-GCM encrypted private key",
                    },
                    {
                      field: "created_at",
                      format: "ISO 8601",
                      desc: "UTC timestamp of key generation",
                    },
                    {
                      field: "type",
                      format: "string literal",
                      desc: "Always 'icp-compatible-identity'",
                    },
                  ].map((row) => (
                    <div key={row.field} className="dd-schema-row">
                      <code className="dd-param-name">{row.field}</code>
                      <code className="dd-param-type">{row.format}</code>
                      <span className="dd-param-desc">{row.desc}</span>
                    </div>
                  ))}
                </div>
              </DocSection>

              {/* Production Config */}
              <DocSection
                id="production"
                icon={Settings}
                title="Production Config"
              >
                <p className="dd-body-text">
                  Update the gateway configuration file before deploying to the
                  public Canton Network.
                </p>
                <CodeBlock
                  code={`// packages/wallet-gateway/config.ts
export const config = {
  ledgerUrl: "https://your-public-canton-node",
  authConfig: {
    type: "oauth2",
    clientId: "your-client-id",
    scope: "openid ledger:write"
  },
  validatorEndpoint: "https://validator.canton-network.com"
};`}
                  language="typescript"
                  title="packages/wallet-gateway/config.ts"
                />
                <div className="dd-warning-box">
                  <Shield className="w-4 h-4 shrink-0" />
                  <div>
                    <div className="dd-warning-title">Security Notice</div>
                    <p className="dd-warning-text">
                      Never commit your{" "}
                      <code className="ig-inline-code">clientId</code> or other
                      secrets to version control. Use environment variables in
                      production:{" "}
                      <code className="ig-inline-code">
                        process.env.CANTON_CLIENT_ID
                      </code>
                    </p>
                  </div>
                </div>
                <CodeBlock
                  code={`// Recommended: use environment variables
export const config = {
  ledgerUrl: process.env.CANTON_LEDGER_URL ?? "http://localhost:6865",
  authConfig: {
    type: "oauth2",
    clientId: process.env.CANTON_CLIENT_ID ?? "",
    scope: "openid ledger:write"
  },
  validatorEndpoint: process.env.CANTON_VALIDATOR_URL ?? ""
};`}
                  language="typescript"
                  title="config.ts (recommended)"
                />
              </DocSection>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="identity-footer">
        <div className="identity-footer-top-line" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="identity-footer-bottom">
            <p className="identity-footer-copyright">
              © {new Date().getFullYear()} ICP Developer Docs. Community
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
