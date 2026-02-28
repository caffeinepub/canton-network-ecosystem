import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Shield,
  Unplug,
  Wallet,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type FlowState = "idle" | "step1" | "step2" | "step3" | "step4" | "connected";

interface StepStatus {
  status: "pending" | "loading" | "done";
  label: string;
  sub: string;
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_ACCOUNT = "icp::1220a3f8b2c7d5e9f1a4b8c2d6e0f3a7b1c5d9e2";
const MOCK_SESSION = "sess_7x9kQmN3pR8sT2vY5wZ1bC4dE6fG0hJ";
const INITIAL_STEPS: StepStatus[] = [
  {
    status: "pending",
    label: "Initializing Connection",
    sub: "Setting up secure channel...",
  },
  {
    status: "pending",
    label: "Connecting to Wallet Gateway",
    sub: "Contacting ICP wallet kernel...",
  },
  {
    status: "pending",
    label: "Awaiting User Approval",
    sub: "Session requires authorization...",
  },
  {
    status: "pending",
    label: "Session Established",
    sub: "Finalizing account handshake...",
  },
];

// ── StepItem component ────────────────────────────────────────────────────────
function StepItem({ step, index }: { step: StepStatus; index: number }) {
  return (
    <div className="cwm-step-item">
      <div
        className={`cwm-step-indicator ${
          step.status === "done"
            ? "cwm-step-done"
            : step.status === "loading"
              ? "cwm-step-loading"
              : "cwm-step-pending"
        }`}
      >
        {step.status === "done" ? (
          <CheckCircle2 className="w-3.5 h-3.5" />
        ) : step.status === "loading" ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <span className="cwm-step-num">{index + 1}</span>
        )}
      </div>
      <div className="cwm-step-content">
        <div
          className={`cwm-step-label ${
            step.status === "done"
              ? "cwm-step-label-done"
              : step.status === "loading"
                ? "cwm-step-label-loading"
                : "cwm-step-label-pending"
          }`}
        >
          {step.label}
        </div>
        <div className="cwm-step-sub">{step.sub}</div>
      </div>
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function ConnectWalletModal({
  isOpen,
  onClose,
}: ConnectWalletModalProps) {
  const [flowState, setFlowState] = useState<FlowState>("idle");
  const [steps, setSteps] = useState<StepStatus[]>(INITIAL_STEPS);

  const updateStep = useCallback(
    (index: number, status: StepStatus["status"]) => {
      setSteps((prev) =>
        prev.map((s, i) => (i === index ? { ...s, status } : s)),
      );
    },
    [],
  );

  const startFlow = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 500));
    setFlowState("step1");
    updateStep(0, "loading");

    await new Promise((r) => setTimeout(r, 1000));
    updateStep(0, "done");

    await new Promise((r) => setTimeout(r, 200));
    setFlowState("step2");
    updateStep(1, "loading");

    await new Promise((r) => setTimeout(r, 1000));
    updateStep(1, "done");

    await new Promise((r) => setTimeout(r, 200));
    setFlowState("step3");
    updateStep(2, "loading");

    await new Promise((r) => setTimeout(r, 1000));
    updateStep(2, "done");

    await new Promise((r) => setTimeout(r, 200));
    setFlowState("step4");
    updateStep(3, "loading");

    await new Promise((r) => setTimeout(r, 1000));
    updateStep(3, "done");

    await new Promise((r) => setTimeout(r, 400));
    setFlowState("connected");
  }, [updateStep]);

  // Reset & start flow when modal opens
  useEffect(() => {
    if (isOpen) {
      setFlowState("idle");
      setSteps(INITIAL_STEPS);
      void startFlow();
    }
  }, [isOpen, startFlow]);

  const handleDisconnect = () => {
    setFlowState("idle");
    setSteps(INITIAL_STEPS);
    onClose();
  };

  const isFlowing =
    flowState === "step1" ||
    flowState === "step2" ||
    flowState === "step3" ||
    flowState === "step4";

  const handleBackdropKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && !isFlowing) {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isFlowing) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="cwm-backdrop"
      onClick={handleBackdropClick}
      onKeyDown={handleBackdropKeyDown}
      aria-modal="true"
      aria-label="Connect Wallet"
      tabIndex={-1}
    >
      <div className="cwm-panel">
        {/* Top accent line */}
        <div className="cwm-top-line" />

        {/* Header */}
        <div className="cwm-header">
          <div className="flex items-center gap-3">
            <div className="cwm-header-icon">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <div className="cwm-header-title">
                {flowState === "connected"
                  ? "Wallet Connected"
                  : "Connect Wallet"}
              </div>
              <div className="cwm-header-sub">
                ICP Network · splice-wallet-kernel
              </div>
            </div>
          </div>
          {!isFlowing && (
            <button
              type="button"
              onClick={onClose}
              className="cwm-close-btn"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── Flow content ── */}
        {flowState !== "connected" ? (
          /* Connection flow */
          <div className="cwm-body">
            {/* Architecture visual */}
            <div className="cwm-arch">
              <div className="cwm-arch-node cwm-arch-node-active">
                <span className="cwm-arch-label">dApp</span>
              </div>
              <div className="cwm-arch-arrow">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <div
                className={`cwm-arch-node ${
                  flowState === "step2" ||
                  flowState === "step3" ||
                  flowState === "step4"
                    ? "cwm-arch-node-active"
                    : ""
                }`}
              >
                <span className="cwm-arch-label">Gateway</span>
              </div>
              <div className="cwm-arch-arrow">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <div
                className={`cwm-arch-node ${
                  flowState === "step4" ? "cwm-arch-node-active" : ""
                }`}
              >
                <span className="cwm-arch-label">Canton</span>
              </div>
            </div>

            {/* Steps */}
            <div className="cwm-steps">
              {steps.map((step, i) => (
                <StepItem key={step.label} step={step} index={i} />
              ))}
            </div>

            {/* Status text */}
            <div className="cwm-status-text">
              {(flowState === "idle" || flowState === "step1") && (
                <span className="cwm-status-connecting">
                  Establishing secure channel...
                </span>
              )}
              {flowState === "step2" && (
                <span className="cwm-status-connecting">
                  Connecting to Wallet Gateway...
                </span>
              )}
              {flowState === "step3" && (
                <span className="cwm-status-waiting">
                  Awaiting your approval...
                </span>
              )}
              {flowState === "step4" && (
                <span className="cwm-status-connecting">
                  Creating session...
                </span>
              )}
            </div>

            {/* Security note */}
            <div className="cwm-security-note">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>
                Connection is simulated. No real network calls are made.
              </span>
            </div>
          </div>
        ) : (
          /* Connected state */
          <div className="cwm-body cwm-connected-body">
            {/* Success icon */}
            <div className="cwm-success-wrap">
              <div className="cwm-success-ring" />
              <div className="cwm-success-icon">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            {/* Account info */}
            <div className="cwm-account-card">
              <div className="cwm-account-row">
                <span className="cwm-account-key">Account</span>
                <span className="cwm-account-value cwm-account-mono">
                  {MOCK_ACCOUNT.slice(0, 22)}…
                </span>
              </div>
              <div className="cwm-account-divider" />
              <div className="cwm-account-row">
                <span className="cwm-account-key">Session</span>
                <span className="cwm-account-value cwm-account-mono">
                  {MOCK_SESSION}
                </span>
              </div>
              <div className="cwm-account-divider" />
              <div className="cwm-account-row">
                <span className="cwm-account-key">Network</span>
                <span className="cwm-account-value">ICP Mainnet</span>
              </div>
              <div className="cwm-account-divider" />
              <div className="cwm-account-row">
                <span className="cwm-account-key">Status</span>
                <span className="cwm-account-status">
                  <span className="cwm-status-dot" />
                  Active
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="cwm-actions">
              <button
                type="button"
                onClick={onClose}
                className="cwm-btn-primary"
              >
                Continue to App
              </button>
              <button
                type="button"
                onClick={handleDisconnect}
                className="cwm-btn-secondary"
              >
                <Unplug className="w-4 h-4" />
                Disconnect
              </button>
            </div>

            {/* Security note */}
            <div className="cwm-security-note">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>
                This is a UI prototype. No real ICP Network connection is
                established.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
