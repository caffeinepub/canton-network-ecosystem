# Canton-Compatible Identity & Wallet Prototype

## Current State
The project has an existing Canton Network Ecosystem directory app (exchange/wallet listings, search/filter, partner directory). It has a React frontend with Tailwind CSS and a Motoko backend.

## Requested Changes (Diff)

### Add
- Hero section with headline "Create a Canton-Compatible Digital Identity" and primary CTA button
- Password input field (min 8 characters) for encrypting the private key before generation
- Identity generation logic using Web Crypto API (Ed25519 keypair, AES encryption, SHA-256 hash)
- Output section displaying: Public Key, Identity ID, Encrypted Private Key -- each with a Copy button
- Download Identity File button that exports a JSON file with identity_id, public_key, encrypted_private_key, created_at, type
- Security notice section disclaiming local-only processing and no Canton Network affiliation
- Roadmap section: Phase 1 (Identity Generator), Phase 2 (Participant Node Integration), Phase 3 (Institutional Onboarding API)
- Footer with community initiative info, collaboration note, contact placeholder
- Smooth loading animation during key generation
- Form validation (password min 8 chars)

### Modify
- Replace existing app content with the new Canton-Compatible Identity & Wallet Prototype UI
- Update app title/branding to "Canton-Compatible Identity & Wallet Prototype"

### Remove
- Previous Canton Network Ecosystem directory content (exchange/wallet listings, partner directory, search/filter)

## Implementation Plan
1. Replace the main App component with the new Identity Prototype UI
2. Implement Web Crypto API logic: Ed25519 keypair generation, SHA-256 identity ID hashing, AES-GCM encryption of private key with password-derived key (PBKDF2)
3. Build output section with copy-to-clipboard for each field
4. Implement JSON download of identity file
5. Add security notice section
6. Add roadmap section (Phase 1-3)
7. Add footer
8. Apply dark navy/charcoal institutional fintech styling with subtle animations
