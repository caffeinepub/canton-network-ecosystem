import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  Copy,
  ExternalLink,
  MousePointerClick,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ReferralLink } from "../backend.d";
import { useHapusLink } from "../hooks/useQueries";

interface LinkCardProps {
  link: ReferralLink;
  onEdit: (link: ReferralLink) => void;
}

export default function LinkCard({ link, onEdit }: LinkCardProps) {
  const [copied, setCopied] = useState(false);
  const { mutateAsync: hapusLink, isPending: isDeleting } = useHapusLink();

  const referralUrl = `${window.location.origin}/r/${link.kode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin link.");
    }
  };

  const handleDelete = async () => {
    try {
      await hapusLink(link.kode);
      toast.success("Link berhasil dihapus.");
    } catch {
      toast.error("Gagal menghapus link.");
    }
  };

  const formattedDate = new Date(
    Number(link.tanggalDibuat / BigInt(1_000_000)),
  ).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="group border border-border bg-card card-hover overflow-hidden">
      <CardContent className="p-5">
        {/* Top row: kode + klik badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono-dm font-500 text-primary text-sm bg-primary/10 px-2 py-0.5 rounded">
                /{link.kode}
              </span>
              <span className="text-muted-foreground text-xs">
                {formattedDate}
              </span>
            </div>
            {link.deskripsi && (
              <p className="text-sm text-muted-foreground truncate">
                {link.deskripsi}
              </p>
            )}
          </div>
          <Badge
            variant="secondary"
            className="flex items-center gap-1 shrink-0 font-mono-dm text-xs bg-primary/10 text-primary border-0"
          >
            <MousePointerClick className="w-3 h-3" />
            {link.jumlahKlik.toString()} klik
          </Badge>
        </div>

        {/* URL Tujuan */}
        <a
          href={link.urlTujuan}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4 group/url"
        >
          <ExternalLink className="w-3 h-3 shrink-0 group-hover/url:text-primary transition-colors" />
          <span className="truncate">{link.urlTujuan}</span>
        </a>

        {/* Referral URL + copy */}
        <div className="flex items-center gap-2 bg-muted/60 rounded-lg px-3 py-2 mb-4">
          <span className="flex-1 text-xs font-mono-dm text-foreground truncate">
            {referralUrl}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 shrink-0 transition-all ${
              copied
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={handleCopy}
            title={copied ? "Tersalin!" : "Salin link"}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(link)}
          >
            <Pencil className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-muted-foreground hover:text-destructive"
                disabled={isDeleting}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display font-700">
                  Hapus Link Ini?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Link{" "}
                  <span className="font-mono-dm text-foreground">
                    /{link.kode}
                  </span>{" "}
                  akan dihapus permanen. Data klik tidak bisa dipulihkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
