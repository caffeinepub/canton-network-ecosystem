# ICP Protocol Hub

## Current State
The app has a Markets page (`/markets`) and a Market Detail page (`/markets/$id`) with full ICP-based prediction market functionality (place bets, view pools, claim rewards). There is no integration with the Unhedged.gg external API.

## Requested Changes (Diff)

### Add
- A new "Unhedged API Bet" panel/card on the Market Detail page that allows users to place bets via the Unhedged external API (`POST https://unhedged.gg/api/v1/bets`)
- The panel accepts: Market ID (pre-filled with current market id), Outcome Index (0 = YES, 1 = NO selector), Amount in ICP
- The panel shows the API endpoint, method, and auth token (masked) for transparency
- Shows loading state while request is in flight
- Shows success or error result from the API response
- A "Developer Reference" collapsible section on the Markets page showing the curl command and API documentation for the Unhedged integration

### Modify
- `MarketDetailPage.tsx`: Add an `UnhedgedBetPanel` component in the right column (below the main BetForm), showing the Unhedged API integration form
- `MarketsPage.tsx`: Optionally add a small "External API" info banner/badge indicating Unhedged integration is available

### Remove
- Nothing removed

## Implementation Plan
1. In `MarketDetailPage.tsx`: Add `UnhedgedBetPanel` component that:
   - Has a distinct visual style (e.g. amber/gold accent) to differentiate from the native ICP bet form
   - Has fields: Market ID (read-only, from URL param), Outcome (YES=0 / NO=1 toggle), Amount (number input, default 100)
   - On submit: fires `fetch('https://unhedged.gg/api/v1/bets', { method: 'POST', headers: { Authorization: 'Bearer ak_MGZbA18VEeXakyPlrlcmPZgjiGNbnfuYBXTjZIBGbM7vqKaf', 'Content-Type': 'application/json' }, body: JSON.stringify({ marketId: id, outcomeIndex, amount }) })`
   - Shows response status and message
   - Displays the curl command equivalent for transparency
2. In `MarketsPage.tsx`: Add a small info note in the controls area or footer mentioning Unhedged external API is available on market detail pages
