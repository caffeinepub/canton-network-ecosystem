import { useState } from "react";
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
import { Loader2, Shuffle } from "lucide-react";
import { useBuatLink } from "../hooks/useQueries";
import { toast } from "sonner";

interface CreateLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function generateRandomCode(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validateKode(kode: string): boolean {
  return /^[a-zA-Z0-9-]{1,30}$/.test(kode);
}

export default function CreateLinkModal({
  open,
  onOpenChange,
}: CreateLinkModalProps) {
  const [urlTujuan, setUrlTujuan] = useState("");
  const [kode, setKode] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [errors, setErrors] = useState<{ url?: string; kode?: string }>({});

  const { mutateAsync: buatLink, isPending } = useBuatLink();

  const handleRandomKode = () => {
    setKode(generateRandomCode());
    setErrors((prev) => ({ ...prev, kode: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { url?: string; kode?: string } = {};

    if (!urlTujuan.trim()) {
      newErrors.url = "URL tujuan wajib diisi.";
    } else if (!validateUrl(urlTujuan.trim())) {
      newErrors.url = "Format URL tidak valid. Contoh: https://example.com";
    }

    const finalKode = kode.trim() || generateRandomCode();
    if (kode.trim() && !validateKode(kode.trim())) {
      newErrors.kode =
        "Kode hanya boleh berisi huruf, angka, dan tanda hubung (-). Maks 30 karakter.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await buatLink({
        kode: finalKode,
        urlTujuan: urlTujuan.trim(),
        deskripsi: deskripsi.trim() || null,
      });
      toast.success("Link referral berhasil dibuat!");
      handleClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal membuat link.";
      toast.error(message.includes("already") || message.includes("kode")
        ? "Kode sudah digunakan. Coba kode lain."
        : "Gagal membuat link. Coba lagi.");
    }
  };

  const handleClose = () => {
    setUrlTujuan("");
    setKode("");
    setDeskripsi("");
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display font-700 text-xl">
            Buat Link Referral Baru
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* URL Tujuan */}
          <div className="space-y-1.5">
            <Label htmlFor="url" className="font-500">
              URL Tujuan <span className="text-destructive">*</span>
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/daftar"
              value={urlTujuan}
              onChange={(e) => {
                setUrlTujuan(e.target.value);
                setErrors((prev) => ({ ...prev, url: undefined }));
              }}
              className={errors.url ? "border-destructive" : ""}
            />
            {errors.url && (
              <p className="text-destructive text-xs">{errors.url}</p>
            )}
          </div>

          {/* Kode Referral */}
          <div className="space-y-1.5">
            <Label htmlFor="kode" className="font-500">
              Kode Referral{" "}
              <span className="text-muted-foreground text-xs">(opsional — auto generate jika kosong)</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="kode"
                placeholder="misalnya: promo2024"
                value={kode}
                maxLength={30}
                onChange={(e) => {
                  setKode(e.target.value);
                  setErrors((prev) => ({ ...prev, kode: undefined }));
                }}
                className={errors.kode ? "border-destructive flex-1" : "flex-1"}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleRandomKode}
                title="Generate kode acak"
              >
                <Shuffle className="w-4 h-4" />
              </Button>
            </div>
            {errors.kode && (
              <p className="text-destructive text-xs">{errors.kode}</p>
            )}
            <p className="text-muted-foreground text-xs">
              Hanya huruf, angka, dan tanda hubung. Maks 30 karakter.
            </p>
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <Label htmlFor="deskripsi" className="font-500">
              Deskripsi{" "}
              <span className="text-muted-foreground text-xs">(opsional)</span>
            </Label>
            <Textarea
              id="deskripsi"
              placeholder="Deskripsi singkat tentang link ini..."
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
                  Membuat...
                </>
              ) : (
                "Buat Link"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
