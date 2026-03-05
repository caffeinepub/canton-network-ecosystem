# ICP Protocol Hub

## Current State

Multi-page ICP ecosystem hub with the following pages:
- `/` – Canton-Compatible Identity & Wallet Prototype (Ed25519 keypair generator)
- `/ecosystem` – Exchange & Wallet directory for ICP/Canton ecosystem
- `/wallet` – Send/receive ICP wallet with CantonScan links
- `/integration` – Splice Wallet Kernel integration guide
- `/developer` – Developer docs with code snippets
- `/featured-apps` – Featured ICP ecosystem apps
- `/markets` – Prediction markets using Unhedged API
- `/markets/:id` – Market detail with External Bet panel
- `/leaderboard` – Leaderboard page
- `/staking` – ICP Staking guide with dissolve delay table

## Requested Changes (Diff)

### Add
- New page `/launchpad` mirroring features from https://nns.ic0.app/launchpad/
  - **Hero section**: Headline "ICP SNS Launchpad", subheadline about decentralized token sales via SNS
  - **Stats bar**: Total projects launched, total ICP raised, total participants (mock numbers)
  - **Tab filter**: All / Open / Committed / Adopted / Failed – filters the SNS project list
  - **SNS Project Cards**: Grid of SNS project cards, each showing:
    - Project logo, name, description
    - Status badge (Open / Committed / Adopted / Failed / Pending)
    - Sale progress bar (ICP raised / ICP goal)
    - Participants count
    - Time remaining / end date
    - Min/max contribution in ICP
    - "Participate" button (links to nns.ic0.app/launchpad for real action)
  - **Project Detail Modal**: clicking a card opens a modal with full details:
    - Full description
    - Token info (symbol, total supply, % distributed in sale)
    - Neurons fund participation toggle info
    - Timeline (proposal → open → committed → adopted)
    - Link to NNS proposal & official site
  - **How It Works section**: 4 steps explaining SNS token sale process
  - **FAQ section**: Common questions about SNS participation
  - Nav link "Launchpad" added to all page navbars

### Modify
- `App.tsx` – register `/launchpad` route
- All page NavBar components – add "Launchpad" link

### Remove
- Nothing removed

## Implementation Plan

1. Create `src/frontend/src/pages/LaunchpadPage.tsx` with all sections
2. Register route in `App.tsx`
3. Add "Launchpad" nav link to NavBar in `StakingPage.tsx` and other pages that have independent NavBar components
