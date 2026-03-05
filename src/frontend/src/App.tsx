import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import DeveloperDocsPage from "./pages/DeveloperDocsPage";
import EcosystemDirectoryPage from "./pages/EcosystemDirectoryPage";
import FeaturedAppsPage from "./pages/FeaturedAppsPage";
import IdentityPrototypePage from "./pages/IdentityPrototypePage";
import IntegrationGuidePage from "./pages/IntegrationGuidePage";
import LaunchpadPage from "./pages/LaunchpadPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import MarketDetailPage from "./pages/MarketDetailPage";
import MarketsPage from "./pages/MarketsPage";
import StakingPage from "./pages/StakingPage";
import WalletPage from "./pages/WalletPage";

// ── Root route ────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

// ── Identity Prototype page (/) ───────────────────────────────────────────────
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IdentityPrototypePage,
});

// ── Ecosystem Directory page (/ecosystem) ─────────────────────────────────────
const ecosystemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ecosystem",
  component: EcosystemDirectoryPage,
});

// ── Wallet page (/wallet) ─────────────────────────────────────────────────────
const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wallet",
  component: WalletPage,
});

// ── Integration Guide page (/integration) ─────────────────────────────────────
const integrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/integration",
  component: IntegrationGuidePage,
});

// ── Developer Docs page (/developer) ──────────────────────────────────────────
const developerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/developer",
  component: DeveloperDocsPage,
});

// ── Featured Apps page (/featured-apps) ───────────────────────────────────────
const featuredAppsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/featured-apps",
  component: FeaturedAppsPage,
});

// ── Markets list page (/markets) ──────────────────────────────────────────────
const marketsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/markets",
  component: MarketsPage,
});

// ── Market detail page (/markets/:id) ─────────────────────────────────────────
const marketDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/markets/$id",
  component: MarketDetailPage,
});

// ── Leaderboard page (/leaderboard) ───────────────────────────────────────────
const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: LeaderboardPage,
});

// ── Staking page (/staking) ────────────────────────────────────────────────────
const stakingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/staking",
  component: StakingPage,
});

// ── Launchpad page (/launchpad) ────────────────────────────────────────────────
const launchpadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/launchpad",
  component: LaunchpadPage,
});

// ── Router ────────────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  indexRoute,
  ecosystemRoute,
  walletRoute,
  integrationRoute,
  developerRoute,
  featuredAppsRoute,
  marketsRoute,
  marketDetailRoute,
  leaderboardRoute,
  stakingRoute,
  launchpadRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
