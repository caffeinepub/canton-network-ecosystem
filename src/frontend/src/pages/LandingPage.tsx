import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Check,
  LinkIcon,
  MousePointerClick,
  Share2,
  User,
  Zap,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const FEATURES = [
  {
    icon: LinkIcon,
    title: "Buat Link Unik",
    desc: "Buat kode referral yang mudah diingat dan personal untuk setiap kampanye.",
  },
  {
    icon: BarChart3,
    title: "Lacak Klik",
    desc: "Monitor performa link kamu secara real-time — lihat berapa kali dibuka.",
  },
  {
    icon: Share2,
    title: "Bagikan ke Mana Saja",
    desc: "Satu link, semua platform. WhatsApp, Instagram, email, atau blog — bebas.",
  },
];

const STEPS = [
  {
    num: "01",
    icon: User,
    title: "Daftar & Login",
    desc: "Masuk dengan Internet Identity — aman dan tanpa kata sandi.",
  },
  {
    num: "02",
    icon: LinkIcon,
    title: "Buat Link Referral",
    desc: "Isi URL tujuan dan kode referral kamu, atau biarkan sistem generate otomatis.",
  },
  {
    num: "03",
    icon: MousePointerClick,
    title: "Bagikan & Pantau",
    desc: "Salin link dan sebar ke mana saja. Lihat jumlah klik bertambah.",
  },
];

export default function LandingPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
            <LinkIcon className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-700 text-lg tracking-tight text-foreground">
            RefHub
          </span>
        </div>
        {identity ? (
          <Link to="/">
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-600"
            >
              Dashboard <ArrowRight className="ml-1 w-3.5 h-3.5" />
            </Button>
          </Link>
        ) : (
          <Button
            size="sm"
            onClick={login}
            disabled={isLoggingIn}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-600"
          >
            {isLoggingIn ? "Masuk..." : "Masuk"}
          </Button>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-6 md:px-10 overflow-hidden">
        {/* Background decorative blobs */}
        <div
          aria-hidden
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.21 145) 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          aria-hidden
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-8 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.68 0.18 210) 0%, transparent 70%)",
            transform: "translate(-30%, 30%)",
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-6 text-sm font-mono-dm animate-fade-in">
            <Zap className="w-3.5 h-3.5" />
            <span>Referral tracking berbasis blockchain</span>
          </div>

          <h1 className="font-display font-800 text-5xl md:text-7xl leading-[0.95] tracking-tight mb-6 animate-fade-in-up-delay-1">
            Sebarkan Link{" "}
            <span className="text-gradient-brand block md:inline">
              Referralmu
            </span>{" "}
            dengan Mudah
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up-delay-2">
            Buat, kelola, dan pantau link referral kamu dalam satu platform.
            Lihat berapa kali dibuka, dan salin link dalam sekejap.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up-delay-3">
            {identity ? (
              <Link to="/">
                <Button
                  size="lg"
                  className="gradient-brand text-primary-foreground font-display font-600 text-base px-8 shadow-glow hover:shadow-glow-lg transition-all"
                >
                  Buka Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                onClick={login}
                disabled={isLoggingIn}
                className="gradient-brand text-primary-foreground font-display font-600 text-base px-8 shadow-glow hover:shadow-glow-lg transition-all"
              >
                {isLoggingIn ? "Masuk..." : "Mulai Sekarang"}
                {!isLoggingIn && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              className="font-display font-500 text-base px-8"
              onClick={() => {
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Lihat Fitur
            </Button>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6 md:px-10 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-700 text-3xl md:text-4xl tracking-tight mb-3">
              Semua yang Kamu Butuhkan
            </h2>
            <p className="text-muted-foreground text-lg">
              Platform lengkap untuk mengelola referral dengan efisien.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="bg-card rounded-2xl p-7 border border-border card-hover"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-5">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-600 text-xl mb-2">
                  {f.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-700 text-3xl md:text-4xl tracking-tight mb-3">
              Cara Kerja
            </h2>
            <p className="text-muted-foreground text-lg">
              Tiga langkah mudah untuk mulai.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div
              aria-hidden
              className="hidden md:block absolute top-8 left-[calc(16.6%+16px)] right-[calc(16.6%+16px)] h-px bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20"
            />

            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center shadow-glow">
                    <step.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    <span className="font-mono-dm text-[9px] font-500 text-primary">
                      {i + 1}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-600 text-lg mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl p-10 md:p-14 text-center relative overflow-hidden gradient-brand">
            <div
              aria-hidden
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 80% 20%, white 0%, transparent 50%)",
              }}
            />
            <h2 className="font-display font-800 text-3xl md:text-4xl text-primary-foreground mb-4 relative">
              Siap Mulai?
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg relative">
              Daftar gratis, tidak perlu kartu kredit.
            </p>
            <ul className="flex flex-col sm:flex-row justify-center gap-3 mb-8 relative">
              {[
                "Gratis selamanya",
                "Tanpa limit link",
                "Real-time analytics",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-1.5 text-primary-foreground/90 text-sm"
                >
                  <Check className="w-4 h-4" /> {t}
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              onClick={identity ? undefined : login}
              disabled={isLoggingIn}
              className="bg-background text-foreground hover:bg-background/90 font-display font-600 text-base px-8 relative"
              asChild={!!identity}
            >
              {identity ? (
                <Link to="/">
                  Buka Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              ) : (
                <span>
                  {isLoggingIn ? "Masuk..." : "Mulai Gratis"}{" "}
                  {!isLoggingIn && (
                    <ArrowRight className="ml-2 w-4 h-4 inline" />
                  )}
                </span>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 px-6 md:px-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-brand flex items-center justify-center">
              <LinkIcon className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-display font-600 text-foreground">
              RefHub
            </span>
          </div>
          <p>
            © 2026. Built with <span className="text-primary">♥</span> using{" "}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
