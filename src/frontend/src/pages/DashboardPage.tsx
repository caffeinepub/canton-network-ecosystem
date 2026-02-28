import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronDown,
  LinkIcon,
  LogOut,
  MousePointerClick,
  Plus,
} from "lucide-react";
import { useState } from "react";
import type { ReferralLink } from "../backend.d";
import CreateLinkModal from "../components/CreateLinkModal";
import EditLinkModal from "../components/EditLinkModal";
import LinkCard from "../components/LinkCard";
import ProfileSetupModal from "../components/ProfileSetupModal";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useGetLinksByCurrentUser,
} from "../hooks/useQueries";

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  loading?: boolean;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <p className="text-muted-foreground text-xs font-500 mb-0.5">{label}</p>
        {loading ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <p className="font-display font-700 text-2xl">{value}</p>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editLink, setEditLink] = useState<ReferralLink | null>(null);

  const { data: links, isLoading: linksLoading } = useGetLinksByCurrentUser();
  const {
    data: profile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup =
    isAuthenticated && !profileLoading && profileFetched && profile === null;

  const totalKlik =
    links?.reduce((sum, l) => sum + Number(l.jumlahKlik), 0) ?? 0;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const userInitial =
    profile?.name?.charAt(0).toUpperCase() ??
    identity?.getPrincipal().toString().charAt(0).toUpperCase() ??
    "U";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
              <LinkIcon className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-700 text-base tracking-tight">
              RefHub
            </span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 font-500 h-9"
              >
                <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-primary-foreground text-xs font-700 font-display">
                  {userInitial}
                </div>
                <span className="text-sm hidden sm:inline">
                  {profileLoading ? "..." : (profile?.name ?? "Pengguna")}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 md:px-8 py-8">
        {/* Page title + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
          <div>
            <h1 className="font-display font-700 text-2xl md:text-3xl mb-1">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              Kelola semua link referral kamu.
            </p>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="gradient-brand text-primary-foreground font-display font-600 shadow-glow hover:shadow-glow-lg transition-all self-start sm:self-auto"
          >
            <Plus className="mr-2 w-4 h-4" />
            Buat Link Baru
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 animate-fade-in-up-delay-1">
          <StatCard
            icon={LinkIcon}
            label="Total Link"
            value={links?.length ?? 0}
            loading={linksLoading}
          />
          <StatCard
            icon={MousePointerClick}
            label="Total Klik"
            value={totalKlik}
            loading={linksLoading}
          />
        </div>

        {/* Links */}
        <div className="animate-fade-in-up-delay-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-display font-600 text-base">Link Referralmu</h2>
            {links && (
              <span className="text-muted-foreground text-xs font-mono-dm">
                ({links.length})
              </span>
            )}
          </div>

          {linksLoading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-44 rounded-2xl" />
              ))}
            </div>
          ) : !links || links.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-2xl">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <LinkIcon className="w-8 h-8 text-primary/60" />
              </div>
              <h3 className="font-display font-600 text-lg mb-2">
                Belum ada link
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs mb-6">
                Buat link referral pertama kamu dan mulai bagikan ke
                orang-orang!
              </p>
              <Button
                onClick={() => setCreateOpen(true)}
                className="gradient-brand text-primary-foreground font-display font-600"
              >
                <Plus className="mr-2 w-4 h-4" />
                Buat Link Pertama
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {links.map((link) => (
                <LinkCard key={link.kode} link={link} onEdit={setEditLink} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-5 px-6 md:px-8">
        <div className="max-w-5xl mx-auto text-center text-xs text-muted-foreground">
          © 2026. Built with <span className="text-primary">♥</span> using{" "}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>

      {/* Modals */}
      <CreateLinkModal open={createOpen} onOpenChange={setCreateOpen} />
      <EditLinkModal
        link={editLink}
        open={!!editLink}
        onOpenChange={(open) => !open && setEditLink(null)}
      />
      <ProfileSetupModal open={showProfileSetup} onComplete={() => {}} />
    </div>
  );
}
