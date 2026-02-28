import type { Transaction } from "@/backend.d";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useGetCCBalance,
  useGetCCTransactionHistory,
  useSendCC,
} from "@/hooks/useQueries";
import { Principal } from "@icp-sdk/core/principal";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock,
  Coins,
  Copy,
  ExternalLink,
  Hash,
  Loader2,
  LogIn,
  Mail,
  RefreshCw,
  Send,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ── Helpers ───────────────────────────────────────────────────────────────────

function truncatePrincipal(principal: string): string {
  if (principal.length <= 18) return principal;
  return `${principal.slice(0, 10)}...${principal.slice(-5)}`;
}

function formatCC(amount: bigint): string {
  // Assuming 8 decimal places like most ICP tokens
  const whole = amount / BigInt(100_000_000);
  const frac = amount % BigInt(100_000_000);
  const fracStr = frac.toString().padStart(8, "0").replace(/0+$/, "");
  if (fracStr.length === 0) {
    return `${new Intl.NumberFormat("en-US").format(Number(whole))}.00`;
  }
  const display = fracStr.length > 2 ? fracStr.slice(0, 2) : fracStr;
  return `${new Intl.NumberFormat("en-US").format(Number(whole))}.${display}`;
}

function formatTimestamp(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  return new Date(ms).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isValidPrincipal(text: string): boolean {
  if (!text.trim()) return false;
  try {
    Principal.fromText(text.trim());
    return true;
  } catch {
    return false;
  }
}

// ── Shared NavBar ─────────────────────────────────────────────────────────────
function WalletNavBar({
  activePage,
}: { activePage: "identity" | "ecosystem" | "wallet" }) {
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
              { label: "Identity", href: "/", page: "identity" },
              { label: "Ecosystem", href: "/ecosystem", page: "ecosystem" },
              { label: "Wallet", href: "/wallet", page: "wallet" },
              {
                label: "Integration",
                href: "/integration",
                page: "integration",
              },
              { label: "Dev Docs", href: "/developer", page: "developer" },
              {
                label: "Featured Apps",
                href: "/featured-apps",
                page: "featured",
              },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`identity-nav-link ${activePage === link.page ? "eco-nav-active" : ""}`}
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

// ── LoginPrompt ───────────────────────────────────────────────────────────────
function LoginPrompt() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="wallet-login-wrap">
      <div className="wallet-login-card">
        <div className="wallet-login-card-line" />
        <div className="wallet-login-icon-wrap">
          <Wallet className="w-8 h-8 wallet-login-icon" />
        </div>
        <h2 className="wallet-login-title">ICP Wallet</h2>
        <p className="wallet-login-sub">
          Log in to view your balance, send ICP tokens, and see your transaction
          history.
        </p>
        <button
          type="button"
          onClick={login}
          disabled={isLoggingIn}
          className="wallet-login-btn"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Log In to Continue
            </>
          )}
        </button>
        <p className="wallet-login-note">
          Uses Internet Identity — decentralized, secure, no passwords.
        </p>
      </div>
    </div>
  );
}

// ── BalanceCard ───────────────────────────────────────────────────────────────
function BalanceCard({
  balance,
  isLoading,
  onRefresh,
  isRefreshing,
}: {
  balance: bigint | undefined;
  isLoading: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  return (
    <div className="wallet-balance-card">
      <div className="wallet-balance-card-line" />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="wallet-balance-icon-wrap">
            <Coins className="w-4 h-4 wallet-balance-icon" />
          </div>
          <span className="wallet-balance-label">Available Balance</span>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="wallet-refresh-btn"
          aria-label="Refresh balance"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {isLoading ? (
        <div className="wallet-balance-skeleton">
          <div className="wallet-skeleton-amount" />
          <div className="wallet-skeleton-label" />
        </div>
      ) : (
        <div>
          <div className="wallet-balance-amount">
            {balance !== undefined ? formatCC(balance) : "—"}
            <span className="wallet-balance-unit">CC</span>
          </div>
          <div className="wallet-balance-network">
            Internet Computer · ICP Token
          </div>
          <a
            href="https://www.cantonscan.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="wallet-cantonscan-inline-link mt-3 inline-flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Check on CantonScan
          </a>
        </div>
      )}
    </div>
  );
}

// ── ReceiveCard ───────────────────────────────────────────────────────────────
function ReceiveCard({ principal }: { principal: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(principal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [principal]);

  return (
    <div className="wallet-receive-card">
      <div className="wallet-receive-card-line" />
      <div className="flex items-center gap-2 mb-5">
        <div className="wallet-receive-icon-wrap">
          <ArrowDownLeft className="w-4 h-4 wallet-receive-icon" />
        </div>
        <span className="wallet-section-label">
          Alamat Wallet Kamu (Principal ID)
        </span>
      </div>

      <p className="wallet-receive-hint mb-3">
        Bagikan Principal ID ini agar orang lain bisa mengirim ICP ke wallet
        kamu.
      </p>

      <div className="wallet-address-box">
        <div className="wallet-address-label">
          <Hash className="w-3 h-3" />
          Principal ID
        </div>
        <div className="wallet-address-value font-mono">{principal}</div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          type="button"
          onClick={() => void handleCopy()}
          className={`wallet-copy-addr-btn flex-1 ${copied ? "wallet-copy-addr-btn-copied" : ""}`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Address Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy Address
            </>
          )}
        </button>
        <a
          href={"https://www.cantonscan.com/"}
          target="_blank"
          rel="noopener noreferrer"
          className="wallet-cantonscan-btn flex-1 inline-flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View on CantonScan
        </a>
      </div>
    </div>
  );
}

// ── SendForm ──────────────────────────────────────────────────────────────────
function SendForm({ onSuccess }: { onSuccess: () => void }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [principalError, setPrincipalError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);

  const sendCC = useSendCC();

  const validateRecipient = (val: string) => {
    if (!val.trim()) {
      setPrincipalError(null);
      return;
    }
    if (!isValidPrincipal(val)) {
      setPrincipalError(
        "Format tidak valid. Gunakan ICP Principal ID (contoh: aaaaa-aa atau rdmx6-jaaaa-aaaaa-aaaaq-cai)",
      );
    } else {
      setPrincipalError(null);
    }
  };

  const validateAmount = (val: string) => {
    const num = Number.parseFloat(val);
    if (!val) {
      setAmountError(null);
      return;
    }
    if (Number.isNaN(num) || num <= 0) {
      setAmountError("Amount must be greater than 0");
    } else {
      setAmountError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipient.trim() || !isValidPrincipal(recipient)) {
      setPrincipalError(
        "Format tidak valid. Gunakan ICP Principal ID (contoh: aaaaa-aa atau rdmx6-jaaaa-aaaaa-aaaaq-cai)",
      );
      return;
    }

    const amountNum = Number.parseFloat(amount);
    if (!amount || Number.isNaN(amountNum) || amountNum <= 0) {
      setAmountError("Please enter a valid amount");
      return;
    }

    const amountBigInt = BigInt(Math.round(amountNum * 100_000_000));
    const toPrincipal = Principal.fromText(recipient.trim());

    try {
      await sendCC.mutateAsync({
        to: toPrincipal,
        amount: amountBigInt,
        note: note.trim() || null,
      });

      toast.success("ICP sent successfully!", {
        description: `${amountNum} ICP sent to ${truncatePrincipal(recipient.trim())}`,
      });

      setRecipient("");
      setAmount("");
      setNote("");
      setPrincipalError(null);
      setAmountError(null);
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Transaction failed";
      toast.error("Failed to send ICP", { description: msg });
    }
  };

  return (
    <div className="wallet-send-card">
      <div className="wallet-send-card-line" />
      <div className="flex items-center gap-2 mb-6">
        <div className="wallet-send-icon-wrap">
          <Send className="w-4 h-4 wallet-send-icon" />
        </div>
        <span className="wallet-section-label">Send ICP</span>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
        {/* Recipient */}
        <div>
          <label htmlFor="recipient" className="identity-label block mb-2">
            Alamat Penerima (ICP Principal ID)
          </label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => {
              setRecipient(e.target.value);
              validateRecipient(e.target.value);
            }}
            placeholder="Contoh: aaaaa-aa atau rdmx6-jaaaa-aaaaa-aaaaq-cai"
            className={`identity-input ${principalError ? "identity-input-error" : ""}`}
            autoComplete="off"
            spellCheck={false}
          />
          <p
            className="mt-1.5 text-xs"
            style={{ color: "oklch(0.55 0.03 255)" }}
          >
            Salin Principal ID penerima dari halaman wallet mereka.
          </p>
          {principalError && (
            <p className="identity-field-error mt-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              {principalError}
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="identity-label block mb-2">
            Amount (ICP)
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              validateAmount(e.target.value);
            }}
            placeholder="0.00"
            min="0.00000001"
            step="0.01"
            className={`identity-input ${amountError ? "identity-input-error" : ""}`}
          />
          {amountError && (
            <p className="identity-field-error mt-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              {amountError}
            </p>
          )}
        </div>

        {/* Note */}
        <div>
          <label htmlFor="note" className="identity-label block mb-2">
            Note / Memo{" "}
            <span className="wallet-optional-label">(optional)</span>
          </label>
          <input
            id="note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note for this transaction..."
            maxLength={256}
            className="identity-input"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={
            sendCC.isPending ||
            !recipient ||
            !!principalError ||
            !amount ||
            !!amountError
          }
          className="wallet-send-btn w-full"
        >
          {sendCC.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send ICP
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// ── TransactionRow ─────────────────────────────────────────────────────────────
function TransactionRow({
  tx,
  myPrincipal,
  index,
}: {
  tx: Transaction;
  myPrincipal: string;
  index: number;
}) {
  const [copied, setCopied] = useState(false);

  const fromStr = tx.from.toString ? tx.from.toString() : String(tx.from);
  const toStr = tx.to.toString ? tx.to.toString() : String(tx.to);
  const isSent = fromStr === myPrincipal;
  const counterpart = isSent ? toStr : fromStr;

  const handleCopyCounterpart = useCallback(async () => {
    await navigator.clipboard.writeText(counterpart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [counterpart]);

  return (
    <div
      className="wallet-tx-row animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index * 0.03, 0.4)}s` }}
    >
      {/* Icon + type */}
      <div className="wallet-tx-icon-col">
        <div
          className={`wallet-tx-icon ${isSent ? "wallet-tx-icon-sent" : "wallet-tx-icon-received"}`}
        >
          {isSent ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownLeft className="w-3.5 h-3.5" />
          )}
        </div>
        <div>
          <span
            className={`wallet-tx-badge ${isSent ? "wallet-tx-badge-sent" : "wallet-tx-badge-received"}`}
          >
            {isSent ? "Sent" : "Received"}
          </span>
          <div className="wallet-tx-time">
            <Clock className="w-3 h-3" />
            {formatTimestamp(tx.timestamp)}
          </div>
        </div>
      </div>

      {/* Counterpart */}
      <div className="wallet-tx-addr-col">
        <div className="wallet-tx-addr-label">{isSent ? "To" : "From"}</div>
        <button
          type="button"
          onClick={() => void handleCopyCounterpart()}
          className="wallet-tx-addr"
          title={counterpart}
        >
          <span className="font-mono">{truncatePrincipal(counterpart)}</span>
          {copied ? (
            <Check className="w-3 h-3 shrink-0" />
          ) : (
            <Copy className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100" />
          )}
        </button>
        {tx.note && <div className="wallet-tx-note">{tx.note}</div>}
      </div>

      {/* Amount */}
      <div className="wallet-tx-amount-col">
        <div
          className={`wallet-tx-amount ${isSent ? "wallet-tx-amount-sent" : "wallet-tx-amount-received"}`}
        >
          {isSent ? "−" : "+"}
          {formatCC(tx.amount)}
        </div>
        <div className="wallet-tx-unit">CC</div>
        <a
          href="https://www.cantonscan.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="wallet-tx-scan-link mt-1 inline-flex items-center gap-1"
          title="View on CantonScan"
        >
          <ExternalLink className="w-3 h-3" />
          <span className="text-xs">CantonScan</span>
        </a>
      </div>
    </div>
  );
}

// ── TransactionHistory ────────────────────────────────────────────────────────
function TransactionHistory({
  myPrincipal,
}: {
  myPrincipal: string;
}) {
  const {
    data: transactions,
    isLoading,
    refetch,
    isFetching,
  } = useGetCCTransactionHistory();

  const sorted = transactions
    ? [...transactions].sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))
    : [];

  return (
    <div className="wallet-history-section">
      <div className="wallet-history-header">
        <div className="flex items-center gap-2">
          <div className="wallet-history-icon-wrap">
            <Clock className="w-3.5 h-3.5 wallet-history-icon" />
          </div>
          <span className="wallet-section-label">Transaction History</span>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="wallet-refresh-btn"
          aria-label="Refresh transactions"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {isLoading ? (
        <div className="wallet-history-loading">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="wallet-tx-skeleton"
              style={{ opacity: 1 - i * 0.2 }}
            />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="wallet-history-empty">
          <div className="wallet-empty-icon-wrap">
            <Clock className="w-6 h-6 wallet-empty-icon" />
          </div>
          <h3 className="wallet-empty-title">No Transactions Yet</h3>
          <p className="wallet-empty-text">
            Your transaction history will appear here once you send or receive
            CC.
          </p>
        </div>
      ) : (
        <div className="wallet-tx-list">
          {sorted.map((tx, i) => (
            <TransactionRow
              key={tx.id.toString()}
              tx={tx}
              myPrincipal={myPrincipal}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── WalletContent ─────────────────────────────────────────────────────────────
function WalletContent() {
  const { identity } = useInternetIdentity();
  const myPrincipal = identity?.getPrincipal().toString() ?? "";

  const {
    data: balance,
    isLoading: balanceLoading,
    refetch: refetchBalance,
    isFetching: balanceRefreshing,
  } = useGetCCBalance(!!identity);

  const handleSendSuccess = useCallback(() => {
    void refetchBalance();
  }, [refetchBalance]);

  return (
    <main>
      {/* ── Hero ── */}
      <section className="wallet-hero relative overflow-hidden">
        <div className="identity-grid-overlay" />
        <div className="identity-orb identity-orb-1" />
        <div className="identity-orb identity-orb-2" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-16">
          <div className="identity-eyebrow-badge mb-6 animate-fade-in-down inline-flex">
            <Wallet className="w-3.5 h-3.5" />
            ICP Token Wallet · Internet Computer
          </div>
          <h1
            className="identity-headline animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Send & Receive
            <br />
            <span className="wallet-headline-accent">ICP Tokens</span>
          </h1>
          <p
            className="identity-subheadline mt-4 max-w-xl animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Manage your ICP token balance directly on the Internet Computer
            (ICP). Send tokens, view your address, and track all transactions.
          </p>
        </div>
      </section>

      {/* ── Wallet Grid ── */}
      <section className="identity-section relative">
        <div className="identity-section-divider" />
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="wallet-grid">
            {/* Left column */}
            <div className="wallet-grid-left space-y-5">
              <BalanceCard
                balance={balance}
                isLoading={balanceLoading}
                onRefresh={() => void refetchBalance()}
                isRefreshing={balanceRefreshing && !balanceLoading}
              />
              <ReceiveCard principal={myPrincipal} />
            </div>

            {/* Right column */}
            <div className="wallet-grid-right">
              <SendForm onSuccess={handleSendSuccess} />
            </div>
          </div>

          {/* Transaction History */}
          <div className="mt-8">
            <TransactionHistory myPrincipal={myPrincipal} />
          </div>
        </div>
      </section>

      {/* ── Security Notice ── */}
      <section className="identity-section relative">
        <div className="identity-section-divider" />
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="wallet-security-notice">
            <div className="wallet-security-icon-wrap">
              <ShieldCheck className="w-5 h-5 wallet-security-icon" />
            </div>
            <div>
              <h3 className="wallet-security-title">Security Notice</h3>
              <p className="wallet-security-text mt-1">
                All transactions are executed on-chain via Internet Computer
                smart contracts. Verify recipient Principal IDs carefully —
                transactions are irreversible. This is a community prototype and
                is not affiliated with DFINITY Foundation or Internet Computer
                Protocol.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function WalletFooter() {
  const year = new Date().getFullYear();
  return (
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
              Internet Computer ICP Token Wallet
            </p>
            <p className="identity-footer-disclaimer mt-3">
              Independent community initiative. Not affiliated with DFINITY
              Foundation or Internet Computer Protocol.
            </p>
          </div>
          <div>
            <h4 className="identity-footer-heading mb-4">
              <Users className="w-4 h-4" />
              Open Collaboration
            </h4>
            <p className="identity-footer-body">
              This wallet interface is an independent community prototype for
              ICP token management on the Internet Computer. Contributions
              welcome.
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
          <div>
            <h4 className="identity-footer-heading mb-4">
              <Mail className="w-4 h-4" />
              Contact
            </h4>
            <p className="identity-footer-body">
              Questions, bug reports, or partnership inquiries:
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
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function WalletPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const isLoggedIn = !!identity;

  return (
    <div className="identity-page">
      <WalletNavBar activePage="wallet" />

      {isInitializing ? (
        <div className="wallet-init-loading">
          <Loader2 className="w-8 h-8 animate-spin wallet-init-spinner" />
          <span className="wallet-init-text">Initializing...</span>
        </div>
      ) : isLoggedIn ? (
        <WalletContent />
      ) : (
        <>
          {/* Show hero even when not logged in */}
          <section className="wallet-hero relative overflow-hidden">
            <div className="identity-grid-overlay" />
            <div className="identity-orb identity-orb-1" />
            <div className="identity-orb identity-orb-2" />
            <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-16">
              <div className="identity-eyebrow-badge mb-6 animate-fade-in-down inline-flex">
                <Wallet className="w-3.5 h-3.5" />
                ICP Token Wallet · Internet Computer
              </div>
              <h1
                className="identity-headline animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                Send & Receive
                <br />
                <span className="wallet-headline-accent">ICP Tokens</span>
              </h1>
              <p
                className="identity-subheadline mt-4 max-w-xl animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                Manage your ICP token balance directly on the Internet Computer
                (ICP). Log in to get started.
              </p>
            </div>
          </section>
          <section className="identity-section relative">
            <div className="identity-section-divider" />
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <LoginPrompt />
            </div>
          </section>
        </>
      )}

      <WalletFooter />
    </div>
  );
}
