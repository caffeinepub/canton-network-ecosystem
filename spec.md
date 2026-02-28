# ICP Protocol Hub

## Current State
Web app lengkap dengan 6 halaman:
- `/` — Identity Generator (Canton-Compatible Identity & Wallet Prototype)
- `/ecosystem` — Canton Network Ecosystem Directory (exchange & wallet)
- `/wallet` — CC Token Wallet
- `/integration` — Integration Guide (splice-wallet-kernel)
- `/developer` — Developer Docs
- `/featured-apps` — Featured Apps dari ekosistem Canton

Semua branding, teks, dan referensi menggunakan "Canton Network", "Canton Identity", "CC token", "canton-compatible-identity", dll.

## Requested Changes (Diff)

### Add
- Tidak ada fitur baru

### Modify
- Semua navbar: "Canton Identity" → "ICP Protocol"
- Badge "Prototype" tetap
- Hero IdentityPrototypePage: headline dan subheadline diubah ke konteks ICP
- Teks "Canton-Compatible Digital Identity" → "ICP-Compatible Digital Identity"
- Teks "Canton Network" → "Internet Computer Protocol (ICP)" di semua halaman
- Teks "CC token" → "ICP token" di WalletPage
- EcosystemDirectoryPage: judul → "ICP Protocol Ecosystem Directory", deskripsi diperbarui ke konteks ICP
- WalletPage: "Canton Tokens" → "ICP Tokens", "CC Wallet" → "ICP Wallet"
- FeaturedAppsPage: badge "Featured Apps · Canton Ecosystem" → "Featured Apps · ICP Ecosystem"
- DeveloperDocsPage: "Canton SDK Reference Docs" → "ICP SDK Reference Docs"
- IntegrationGuidePage: judul dan konteks diubah ke ICP
- ConnectWalletModal: "Canton Network · splice-wallet-kernel" → "ICP Network · splice-wallet-kernel", "Canton Mainnet" → "ICP Mainnet"
- cryptoUtils.ts: type "canton-compatible-identity" → "icp-compatible-identity", nama file download dari "canton-identity-" → "icp-identity-"
- Footer semua halaman: "Canton Network" → "Internet Computer Protocol"
- SecuritySection IdentityPrototype: referensi Canton → ICP
- RoadmapSection: konteks Canton → ICP

### Remove
- Tidak ada

## Implementation Plan
1. Update cryptoUtils.ts — type string dan download filename
2. Update ConnectWalletModal.tsx — semua teks Canton → ICP
3. Update IdentityPrototypePage.tsx — navbar, hero, security, roadmap, footer
4. Update EcosystemDirectoryPage.tsx — navbar, hero, about, footer
5. Update WalletPage.tsx — navbar, hero, wallet content, footer
6. Update IntegrationGuidePage.tsx — navbar, hero, footer
7. Update DeveloperDocsPage.tsx — navbar, hero, footer
8. Update FeaturedAppsPage.tsx — navbar, hero, footer
