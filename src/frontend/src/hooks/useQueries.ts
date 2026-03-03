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

// ─── Prediction Markets ──────────────────────────────────────────────────────

import type {
  Bet,
  LeaderboardEntry,
  Market,
  MarketCategory,
} from "../backend.d";
import { BetPosition } from "../backend.d";

export function useGetMarkets() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Market[]>({
    queryKey: ["markets"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMarkets();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30_000,
  });
}

export function useGetMarketsByCategory(
  category: MarketCategory,
  enabled = true,
) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Market[]>({
    queryKey: ["markets", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMarketsByCategory(category);
    },
    enabled: !!actor && !actorFetching && enabled,
    staleTime: 30_000,
  });
}

export function useGetMarket(id: bigint, enabled = true) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Market | null>({
    queryKey: ["market", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMarket(id);
    },
    enabled: !!actor && !actorFetching && enabled,
    staleTime: 15_000,
  });
}

export function useGetMarketBets(marketId: bigint, enabled = true) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Bet[]>({
    queryKey: ["marketBets", marketId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMarketBets(marketId);
    },
    enabled: !!actor && !actorFetching && enabled,
    staleTime: 15_000,
  });
}

export function useGetUserBets(enabled = true) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Bet[]>({
    queryKey: ["userBets"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserBets();
    },
    enabled: !!actor && !actorFetching && enabled,
    staleTime: 30_000,
  });
}

export function useGetLeaderboard() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 60_000,
  });
}

export function useGetOrCreateBalance(enabled = true) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ["orCreateBalance"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getOrCreateBalance();
    },
    enabled: !!actor && !actorFetching && enabled,
    staleTime: 60_000,
  });
}

export function useIsCallerAdmin(enabled = true) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching && enabled,
    staleTime: 300_000,
  });
}

export function usePlaceBet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      marketId,
      position,
      amount,
    }: {
      marketId: bigint;
      position: BetPosition;
      amount: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.placeBet(marketId, position, amount);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["markets"] });
      queryClient.invalidateQueries({
        queryKey: ["market", vars.marketId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["marketBets", vars.marketId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["userBets"] });
      queryClient.invalidateQueries({ queryKey: ["ccBalance"] });
      queryClient.invalidateQueries({ queryKey: ["orCreateBalance"] });
    },
  });
}

export function useCreateMarket() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      category,
      imageUrl,
      deadline,
    }: {
      title: string;
      description: string;
      category: MarketCategory;
      imageUrl: string;
      deadline: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createMarket(
        title,
        description,
        category,
        imageUrl,
        deadline,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["markets"] });
    },
  });
}

export function useResolveMarket() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      marketId,
      outcome,
    }: {
      marketId: bigint;
      outcome: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.resolveMarket(marketId, outcome);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["markets"] });
      queryClient.invalidateQueries({
        queryKey: ["market", vars.marketId.toString()],
      });
    },
  });
}

export function useClaimReward() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (betId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.claimReward(betId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBets"] });
      queryClient.invalidateQueries({ queryKey: ["ccBalance"] });
      queryClient.invalidateQueries({ queryKey: ["orCreateBalance"] });
    },
  });
}

export { BetPosition };
