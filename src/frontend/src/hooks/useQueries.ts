import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReferralLink, Transaction, UserProfile } from "../backend.d";
import { useActor } from "./useActor";

// ─── User Profile ───────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ─── Referral Links ──────────────────────────────────────────────────────────

export function useGetLinksByCurrentUser() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ReferralLink[]>({
    queryKey: ["myLinks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLinksByCurrentUser();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useBuatLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      kode,
      urlTujuan,
      deskripsi,
    }: {
      kode: string;
      urlTujuan: string;
      deskripsi: string | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.buatLink(kode, urlTujuan, deskripsi);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myLinks"] });
    },
  });
}

export function useHapusLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (kode: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.hapusLink(kode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myLinks"] });
    },
  });
}

export function useUpdateLinkData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      kode,
      newUrlTujuan,
      newDeskripsi,
    }: {
      kode: string;
      newUrlTujuan: string | null;
      newDeskripsi: string | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateLinkData(kode, newUrlTujuan, newDeskripsi);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myLinks"] });
    },
  });
}

export function useGetKodeLink(kode: string, enabled = true) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ReferralLink>({
    queryKey: ["link", kode],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getKodeLink(kode);
    },
    enabled: !!actor && !actorFetching && enabled,
    retry: false,
  });
}

export function useRedirectLinkAndCount() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (kode: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.redirectLinkAndCount(kode);
    },
  });
}

// ─── CC Wallet ───────────────────────────────────────────────────────────────

export function useGetCCBalance(enabled = true) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ["ccBalance"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getCCBalance();
    },
    enabled: !!actor && !actorFetching && enabled,
    refetchInterval: 30_000, // auto-refresh every 30s
  });
}

export function useGetCCTransactionHistory(enabled = true) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ["ccHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCCTransactionHistory(null);
    },
    enabled: !!actor && !actorFetching && enabled,
  });
}

export function useSendCC() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      to,
      amount,
      note,
    }: {
      to: Principal;
      amount: bigint;
      note: string | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.sendCC(to, amount, note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ccBalance"] });
      queryClient.invalidateQueries({ queryKey: ["ccHistory"] });
    },
  });
}
