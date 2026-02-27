import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useUpdateLinkData } from "../hooks/useQueries";
import { toast } from "sonner";
import type { ReferralLink } from "../backend.d";

interface EditLinkModalProps {
  link: ReferralLink | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function EditLinkModal({
  link,
  open,
  onOpenChange,
}: EditLinkModalProps) {
  const [urlTujuan, setUrlTujuan] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [urlError, setUrlError] = useState<string>();

  const { mutateAsync: updateLink, isPending } = useUpdateLinkData();

  useEffect(() => {
    if (link) {
      setUrlTujuan(link.urlTujuan);
      setDeskripsi(link.deskripsi ?? "");
      setUrlError(undefined);
    }
  }, [link]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link) return;

    if (!urlTujuan.trim()) {
      setUrlError("URL tujuan wajib diisi.");
      return;
    }
    if (!validateUrl(urlTujuan.trim())) {
      setUrlError("Format URL tidak valid.");
      return;
    }

    try {
      await updateLink({
        kode: link.kode,
        newUrlTujuan: urlTujuan.trim(),
        newDeskripsi: deskripsi.trim() || null,
      });
      toast.success("Link berhasil diperbarui!");
      onOpenChange(false);
    } catch {
      toast.error("Gagal memperbarui link. Coba lagi.");
    }
  };

  const handleClose = () => {
    setUrlError(undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display font-700 text-xl">
            Edit Link{" "}
            <span className="text-primary font-mono-dm text-base">
              /{link?.kode}
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* URL Tujuan */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-url" className="font-500">
              URL Tujuan <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-url"
              type="url"
              value={urlTujuan}
              onChange={(e) => {
                setUrlTujuan(e.target.value);
                setUrlError(undefined);
              }}
              className={urlError ? "border-destructive" : ""}
            />
            {urlError && (
              <p className="text-destructive text-xs">{urlError}</p>
            )}
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-deskripsi" className="font-500">
              Deskripsi{" "}
              <span className="text-muted-foreground text-xs">(opsional)</span>
            </Label>
            <Textarea
              id="edit-deskripsi"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="gradient-brand text-primary-foreground font-display font-600"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
