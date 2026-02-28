import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSaveCallerUserProfile } from "../hooks/useQueries";

interface ProfileSetupModalProps {
  open: boolean;
  onComplete: () => void;
}

export default function ProfileSetupModal({
  open,
  onComplete,
}: ProfileSetupModalProps) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string>();
  const { mutateAsync: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("Nama tidak boleh kosong.");
      return;
    }
    try {
      await saveProfile({ name: name.trim() });
      toast.success("Profil berhasil dibuat!");
      onComplete();
    } catch {
      toast.error("Gagal menyimpan profil.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <DialogHeader>
          <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6 text-primary-foreground" />
          </div>
          <DialogTitle className="font-display font-700 text-xl text-center">
            Selamat Datang!
          </DialogTitle>
          <DialogDescription className="text-center">
            Masukkan nama untuk melengkapi profilmu.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="setup-name">Nama</Label>
            <Input
              id="setup-name"
              placeholder="Nama kamu"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(undefined);
              }}
              autoFocus
              className={nameError ? "border-destructive" : ""}
            />
            {nameError && (
              <p className="text-destructive text-xs">{nameError}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full gradient-brand text-primary-foreground font-display font-600"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              "Mulai"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
