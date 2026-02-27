import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface UserProfile {
    name: string;
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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    buatLink(kode: string, urlTujuan: string, deskripsi: string | null): Promise<ReferralLink>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getKodeLink(kode: string): Promise<ReferralLink>;
    getLinkByOwner(owner: Principal): Promise<Array<ReferralLink>>;
    getLinksByCurrentUser(): Promise<Array<ReferralLink>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hapusLink(kode: string): Promise<void>;
    incrementClickCount(kode: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    redirectLinkAndCount(kode: string): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateLinkData(kode: string, newUrlTujuan: string | null, newDeskripsi: string | null): Promise<ReferralLink>;
}
