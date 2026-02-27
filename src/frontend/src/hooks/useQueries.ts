import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { ReferralLink, UserProfile } from "../backend.d";

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

export function useGetKodeLink(kode: string, enabled: boolean = true) {
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
