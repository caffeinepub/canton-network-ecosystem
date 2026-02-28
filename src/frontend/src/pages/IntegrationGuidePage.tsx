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
              { label: "Ecosystem", href: "/ecosystem" },
              { label: "Wallet", href: "/wallet" },
              { label: "Integration", href: "/integration" },
              { label: "Dev Docs", href: "/developer" },
              { label: "Featured Apps", href: "/featured-apps" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`identity-nav-link ${link.href === "/integration" ? "eco-nav-active" : ""}`}
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
          <div className="ig-arch-box-label">Wallet Gateway</div>
          <div className="ig-arch-box-sub">splice-wallet-kernel</div>
        </div>
        <div className="ig-arch-connector">
          <div className="ig-arch-line" />
          <ArrowRight className="w-4 h-4 ig-arch-arrow" />
          <div className="ig-arch-connector-label">Ledger API</div>
        </div>
        <div className="ig-arch-box ig-arch-box-canton">
          <div className="ig-arch-box-icon">
            <Database className="w-5 h-5" />
          </div>
          <div className="ig-arch-box-label">ICP Node</div>
          <div className="ig-arch-box-sub">ICP Local Dev / Mainnet</div>
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
      "Clone the splice-wallet-kernel repository and install dependencies to get started.",
    color: "blue",
    content: (
      <div className="space-y-4">
        <p className="ig-step-text">
          Clone the official Hyperledger Labs repository and install all
          required dependencies using Yarn.
        </p>
        <CodeBlock
          code={`git clone https://github.com/hyperledger-labs/splice-wallet-kernel.git
cd splice-wallet-kernel`}
          language="bash"
          title="Terminal"
        />
        <p className="ig-step-text">Install all dependencies:</p>
        <CodeBlock
          code={`# Install Yarn if not already installed
npm install -g yarn

# Install project dependencies
yarn install`}
          language="bash"
        />
        <div className="ig-step-prereq">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <div>
            <div className="ig-step-prereq-title">Prerequisites</div>
            <div className="ig-step-prereq-items">
              <span>Node.js 18+</span>
              <span>Yarn 1.22+</span>
              <span>Git</span>
              <span>Docker (optional)</span>
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
    title: "Build All Modules",
    description:
      "Compile all packages including wallet-sdk, dapp-sdk, wallet-gateway, and core modules.",
    color: "gold",
    content: (
      <div className="space-y-4">
        <p className="ig-step-text">
          Run the unified build command to compile all modules in the correct
          dependency order.
        </p>
        <CodeBlock code={"yarn build:all"} language="bash" title="Terminal" />
        <p className="ig-step-text">
          This builds the following packages in order:
        </p>
        <div className="ig-module-list">
          {[
            {
              name: "@splice-wallet/core",
              desc: "Core cryptographic primitives",
            },
            {
              name: "@splice-wallet/wallet-sdk",
              desc: "Wallet management SDK",
            },
            { name: "@splice-wallet/dapp-sdk", desc: "dApp integration SDK" },
            {
              name: "wallet-gateway",
              desc: "Gateway server for wallet-dApp bridge",
            },
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
    title: "Run Canton Local Dev Node",
    description:
      "Start a local ICP development node to simulate the permissioned DLT environment.",
    color: "green",
    content: (
      <div className="space-y-4">
        <p className="ig-step-text">
          Start the bundled ICP local development node. This spins up a minimal
          ICP environment for testing.
        </p>
        <CodeBlock
          code={"yarn start:canton"}
          language="bash"
          title="Terminal"
        />
        <p className="ig-step-text">Expected output on successful startup:</p>
        <CodeBlock
          code={`ICP node started
Ledger API running on localhost:6865
Participant node: participant1
Domain: icp-local-dev
✓ ICP node ready`}
          language="text"
          title="Expected Output"
        />
      </div>
    ),
  },
  {
    id: "gateway",
    step: "04",
    icon: Play,
    title: "Run Wallet Gateway + Demo dApp",
    description:
      "Start all services: the wallet gateway, demo dApp, and mock auth server simultaneously.",
    color: "purple",
    content: (
      <div className="space-y-4">
        <p className="ig-step-text">
          Launch all services with a single command. This starts the wallet
          gateway, demo dApp frontend, and the mock auth server.
        </p>
        <CodeBlock code={"yarn start:all"} language="bash" title="Terminal" />
        <div className="ig-services-grid">
          {[
            { port: "3000", name: "Demo dApp", color: "blue" },
            { port: "3001", name: "Wallet Gateway", color: "gold" },
            { port: "3002", name: "Mock Auth Server", color: "green" },
          ].map((s) => (
            <div
              key={s.port}
              className={`ig-service-chip ig-service-chip-${s.color}`}
            >
              <span className="ig-service-port">:{s.port}</span>
              <span className="ig-service-name">{s.name}</span>
            </div>
          ))}
        </div>
        <div className="ig-callout ig-callout-warning">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <div>
            <div className="ig-callout-title">Caffeine Platform Note</div>
            <p className="ig-callout-text">
              Jika Caffeine tidak support multi-service long running process,
              jalankan Canton di server eksternal, di Caffeine hanya jalankan
              dApp. Set <code className="ig-inline-code">gatewayUrl</code> ke
              URL publik gateway-mu.
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
    title: "Connect Wallet Code",
    description:
      "Implement the wallet connection logic in your dApp using the splice-wallet dApp SDK.",
    color: "blue",
    content: (
      <div className="space-y-4">
        <p className="ig-step-text">
          Create a wallet client instance and implement the connect flow. The
          SDK handles the secure session negotiation.
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
        <p className="ig-step-text">Use it in a React component:</p>
        <CodeBlock
          code={`<button onClick={connectWallet}>
  Connect Canton Wallet
</button>`}
          language="tsx"
          title="React Component"
        />
        <div className="ig-flow-steps">
          <div className="ig-flow-title">Connection Flow</div>
          {[
            "dApp requests connect via wallet.connect()",
            "Wallet Gateway opens a new session",
            "User approves the connection request",
            "Session account is returned to dApp",
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
    title: "Submit Transaction",
    description:
      "Submit signed transactions to the Canton ledger via the wallet SDK.",
    color: "gold",
    content: (
      <div className="space-y-4">
        <p className="ig-step-text">
          After connecting, submit transactions using the wallet SDK. The SDK
          handles signing and submission to the ledger API.
        </p>
        <CodeBlock
          code={`await wallet.submitTransaction({
  templateId: "YourTemplate",
  payload: {
    owner: session.account,
    amount: 100
  }
});`}
          language="typescript"
          title="Submit Transaction"
        />
        <p className="ig-step-text">The SDK internally performs:</p>
        <div className="ig-sdk-steps">
          {[
            {
              step: "Sign",
              desc: "Signs the transaction with the session key",
            },
            { step: "Send", desc: "Sends to the Ledger API endpoint" },
            {
              step: "Commit",
              desc: "Canton commits the contract to the ledger",
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
    title: "Check in Explorer",
    description:
      "Verify your transactions on CantonScan or check ledger API logs for local nodes.",
    color: "green",
    content: (
      <div className="space-y-4">
        <p className="ig-step-text">
          For public ICP Protocol transactions, use CantonScan to verify and
          inspect your submitted transactions.
        </p>
        <a
          href="https://www.cantonscan.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="ig-explorer-link"
        >
          <div className="flex items-center gap-3">
            <div className="ig-explorer-icon">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div>
              <div className="ig-explorer-name">CantonScan</div>
              <div className="ig-explorer-url">www.cantonscan.com</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 ig-explorer-arrow" />
        </a>
        <p className="ig-step-text">
          For local Canton dev nodes, check the ledger API logs:
        </p>
        <CodeBlock
          code={`# View Canton node logs
yarn logs:canton

# Or check ledger API directly
curl http://localhost:6865/v2/transactions`}
          language="bash"
          title="Local Node Inspection"
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
            Deploy to Public Canton
          </h2>
          <p className="identity-section-subtitle mt-2 text-center max-w-xl mx-auto">
            When moving from local development to production ICP Protocol,
            update your gateway configuration.
          </p>
        </div>
        <div className="ig-prod-grid">
          <div className="ig-prod-card">
            <h3 className="ig-prod-card-title">Gateway Configuration</h3>
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
              title="config.ts"
            />
          </div>
          <div className="ig-prod-checklist">
            <h3 className="ig-prod-card-title">Production Checklist</h3>
            <div className="ig-checklist">
              {[
                {
                  done: true,
                  item: "Update ledgerUrl to production Canton node",
                },
                { done: true, item: "Configure OAuth2 authentication" },
                { done: true, item: "Set validator endpoint URL" },
                { done: false, item: "Obtain API auth credentials" },
                { done: false, item: "Configure network firewall rules" },
                { done: false, item: "Enable TLS/SSL on all endpoints" },
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
              Integrate ICP Wallet
              <br />
              <span className="identity-headline-accent">Step-by-Step</span>
            </h1>
            <p className="ig-hero-sub mt-6 max-w-xl">
              Complete guide to integrating your dApp with Internet Computer
              Protocol (ICP) using the splice-wallet-kernel from Hyperledger
              Labs. Covers local dev to production deployment.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-10">
              <a
                href="https://github.com/hyperledger-labs/splice-wallet-kernel"
                target="_blank"
                rel="noopener noreferrer"
                className="identity-cta-primary group"
              >
                <GitBranch className="w-4 h-4" />
                View Repository
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
