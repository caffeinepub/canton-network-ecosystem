# ICP Protocol Hub

## Current State
The `/markets` page displays hardcoded sample markets (SAMPLE_MARKETS array with 8 static entries). The MarketDetailPage also uses a SAMPLE_MARKETS_MAP fallback. The UnhedgedBetPanel on the detail page allows placing external bets via the Unhedged API using a hardcoded API key.

## Requested Changes (Diff)

### Add
- Fetch real markets from the Unhedged API (`https://unhedged.gg/api/v1/markets`) using the existing API key (`ak_MGZbA18VEeXakyPlrlcmPZgjiGNbnfuYBXTjZIBGbM7vqKaf`) on the MarketsPage
- Loading state while fetching markets from Unhedged
- Error state if fetch fails with a retry button
- Map Unhedged API market format to the display format used by MarketCard

### Modify
- MarketsPage: Replace SAMPLE_MARKETS with live data fetched from Unhedged API on component mount; keep search and category filter working on top of the fetched data
- MarketCard: Support Unhedged market data shape (title, description, category, probability/volume fields from Unhedged format); adapt helpers to handle the API response shape
- Keep the backend ICP markets as secondary source if Unhedged fetch fails (graceful fallback)

### Remove
- SAMPLE_MARKETS static array from MarketsPage (no longer needed as primary source)
- SAMPLE_MARKETS_MAP from MarketDetailPage is kept as last-resort fallback only

## Implementation Plan
1. In MarketsPage, add a `useEffect` (or React Query `useQuery`) that calls `GET https://unhedged.gg/api/v1/markets` with `Authorization: Bearer ak_MGZbA18VEeXakyPlrlcmPZgjiGNbnfuYBXTjZIBGbM7vqKaf`
2. Adapt the fetched data to the existing Market display interface used by MarketCard (map `id`, `title`, `description`, `category`, probability/pool fields)
3. Show loading skeleton cards while fetching
4. Show an error banner with retry if the API call fails
5. Keep category filter and search working on top of fetched markets
6. Keep stat counters (Active Markets, Total Liquidity) driven by fetched data
