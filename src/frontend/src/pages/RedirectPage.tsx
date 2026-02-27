import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { Loader2, LinkIcon, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActor } from "../hooks/useActor";

type RedirectState = "loading" | "redirecting" | "error";

export default function RedirectPage() {
  const { kode } = useParams({ strict: false }) as { kode: string };
  const { actor, isFetching: actorFetching } = useActor();
  const [state, setState] = useState<RedirectState>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (actorFetching || !actor || !kode) return;

    let cancelled = false;

    async function doRedirect() {
      try {
        const url = await actor!.redirectLinkAndCount(kode);
        if (cancelled) return;
        setState("redirecting");
        // Small delay so user sees the "redirecting" state
        setTimeout(() => {
          if (!cancelled) {
            window.location.href = url;
          }
        }, 600);
      } catch (err: unknown) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        const isNotFound = msg.toLowerCase().includes("not found") ||
          msg.toLowerCase().includes("tidak ditemukan") ||
          msg.toLowerCase().includes("does not exist");
        setErrorMessage(
          isNotFound
            ? `Link dengan kode "${kode}" tidak ditemukan.`
            : "Terjadi kesalahan saat memproses link ini."
        );
        setState("error");
      }
    }

    doRedirect();

    return () => {
      cancelled = true;
    };
  }, [actor, actorFetching, kode]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-6 shadow-glow">
          {state === "error" ? (
            <AlertCircle className="w-8 h-8 text-primary-foreground" />
          ) : (
            <LinkIcon className="w-8 h-8 text-primary-foreground" />
          )}
        </div>

        {(state === "loading" || state === "redirecting") && (
          <>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <h1 className="font-display font-700 text-xl text-foreground">
                {state === "redirecting" ? "Mengalihkan..." : "Memuat link..."}
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              {state === "redirecting"
                ? "Kamu akan segera diarahkan ke tujuan."
                : `Memvalidasi link `}
              {state === "loading" && (
                <span className="font-mono-dm text-foreground">/{kode}</span>
              )}
            </p>
            <div className="mt-8 flex justify-center">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary animate-pulse"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {state === "error" && (
          <>
            <h1 className="font-display font-700 text-xl mb-2">
              Link Tidak Ditemukan
            </h1>
            <p className="text-muted-foreground text-sm mb-8">{errorMessage}</p>
            <Button asChild className="gradient-brand text-primary-foreground font-display font-600">
              <Link to="/">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Kembali ke Beranda
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
