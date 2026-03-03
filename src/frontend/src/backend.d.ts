import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Transaction {
    id: bigint;
    to: Principal;
    from: Principal;
    note?: string;
    timestamp: Time;
    amount: bigint;
}
export interface LeaderboardEntry {
    betsCount: bigint;
    user: Principal;
    totalLost: bigint;
    totalWon: bigint;
    profit: bigint;
}
export type Time = bigint;
export interface Bet {
    id: bigint;
    claimed: boolean;
    marketId: bigint;
    bettor: Principal;
    timestamp: Time;
    position: BetPosition;
    amount: bigint;
}
export interface Market {
    id: bigint;
    status: MarketStatus;
    title: string;
    creator: Principal;
    totalYesPool: bigint;
    resolvedOutcome?: boolean;
    createdAt: Time;
    description: string;
    deadline: Time;
    imageUrl: string;
    category: MarketCategory;
    totalNoPool: bigint;
}
export interface ReferralLink {
    id: bigint;
    tanggalDibuat: Time;
    kode: string;
    deskripsi?: string;
    pemilik: Principal;
    urlTujuan: string;
    jumlahKlik: bigint;
}
export interface UserProfile {
    name: string;
}
export enum BetPosition {
    no = "no",
    yes = "yes"
}
export enum MarketCategory {
    Technology = "Technology",
    Entertainment = "Entertainment",
    Crypto = "Crypto",
    Politics = "Politics",
    Sports = "Sports"
}
export enum MarketStatus {
    resolved = "resolved",
    active = "active",
    cancelled = "cancelled"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminMintCC(to: Principal, amount: bigint, note: string | null): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    buatLink(kode: string, urlTujuan: string, deskripsi: string | null): Promise<ReferralLink>;
    claimReward(betId: bigint): Promise<bigint>;
    createMarket(title: string, description: string, category: MarketCategory, imageUrl: string, deadline: Time): Promise<Market>;
    getCCBalance(): Promise<bigint>;
    getCCTransactionHistory(_principal: Principal | null): Promise<Array<Transaction>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getKodeLink(kode: string): Promise<ReferralLink>;
    getLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getLinkByOwner(owner: Principal): Promise<Array<ReferralLink>>;
    getLinksByCurrentUser(): Promise<Array<ReferralLink>>;
    getMarket(id: bigint): Promise<Market | null>;
    getMarketBets(marketId: bigint): Promise<Array<Bet>>;
    getMarkets(): Promise<Array<Market>>;
    getMarketsByCategory(category: MarketCategory): Promise<Array<Market>>;
    getOrCreateBalance(): Promise<bigint>;
    getUserBets(): Promise<Array<Bet>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hapusLink(kode: string): Promise<void>;
    incrementClickCount(kode: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    placeBet(marketId: bigint, position: BetPosition, amount: bigint): Promise<Bet>;
    redirectLinkAndCount(kode: string): Promise<string>;
    resolveMarket(marketId: bigint, outcome: boolean): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendCC(to: Principal, amount: bigint, note: string | null): Promise<void>;
    updateLinkData(kode: string, newUrlTujuan: string | null, newDeskripsi: string | null): Promise<ReferralLink>;
}
