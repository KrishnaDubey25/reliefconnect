import { Skeleton } from "@/components/ui/skeleton";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import LoginPage from "./pages/LoginPage";

// Direct import for login — MUST NOT be lazy so it renders immediately
// All other pages can be lazy-loaded without risk

const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const RegisterUserPage = lazy(() => import("./pages/RegisterUserPage"));
const RegisterNGOPage = lazy(() => import("./pages/RegisterNGOPage"));
const RegisterAdminPage = lazy(() => import("./pages/RegisterAdminPage"));

// Citizen pages
const UserDashboard = lazy(() => import("./pages/user/UserDashboard"));
const UserNewRequest = lazy(() => import("./pages/user/UserNewRequest"));
const UserMapPage = lazy(() => import("./pages/user/UserMapPage"));

// NGO pages
const NGODashboard = lazy(() => import("./pages/ngo/NGODashboard"));
const NGORequests = lazy(() => import("./pages/ngo/NGORequests"));
const NGOInventory = lazy(() => import("./pages/ngo/NGOInventory"));
const NGOMapPage = lazy(() => import("./pages/ngo/NGOMapPage"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminNGOs = lazy(() => import("./pages/admin/AdminNGOs"));
const AdminRequests = lazy(() => import("./pages/admin/AdminRequests"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminMapPage = lazy(() => import("./pages/admin/AdminMapPage"));

function PageLoader() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

function Wrap({
  children,
  requiredRole,
}: { children: React.ReactNode; requiredRole?: "citizen" | "ngo" | "admin" }) {
  return (
    <Layout>
      <ProtectedRoute requiredRole={requiredRole}>
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </ProtectedRoute>
    </Layout>
  );
}

function AuthWrap({ children }: { children: React.ReactNode }) {
  return <Layout showNav={false}>{children}</Layout>;
}

// Root route renders Outlet — children handle their own rendering.
// Using Navigate as root component blocks child routes from rendering.
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Index route: redirect / → /login synchronously
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Navigate to="/login" />,
});

// Login route uses direct (non-lazy) import — renders without any async loading
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <AuthWrap>
      <LoginPage />
    </AuthWrap>
  ),
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: () => (
    <AuthWrap>
      <Suspense fallback={<PageLoader />}>
        <RegisterPage />
      </Suspense>
    </AuthWrap>
  ),
});

const registerUserRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register/user",
  component: () => (
    <AuthWrap>
      <Suspense fallback={<PageLoader />}>
        <RegisterUserPage />
      </Suspense>
    </AuthWrap>
  ),
});

const registerNGORoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register/ngo",
  component: () => (
    <AuthWrap>
      <Suspense fallback={<PageLoader />}>
        <RegisterNGOPage />
      </Suspense>
    </AuthWrap>
  ),
});

const registerAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register/admin",
  component: () => (
    <AuthWrap>
      <Suspense fallback={<PageLoader />}>
        <RegisterAdminPage />
      </Suspense>
    </AuthWrap>
  ),
});

// Citizen routes
const userDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/user/dashboard",
  component: () => (
    <Wrap requiredRole="citizen">
      <UserDashboard />
    </Wrap>
  ),
});

const userNewRequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/user/new-request",
  component: () => (
    <Wrap requiredRole="citizen">
      <UserNewRequest />
    </Wrap>
  ),
});

const userMapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/user/map",
  component: () => (
    <Wrap requiredRole="citizen">
      <UserMapPage />
    </Wrap>
  ),
});

// NGO routes
const ngoDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ngo/dashboard",
  component: () => (
    <Wrap requiredRole="ngo">
      <NGODashboard />
    </Wrap>
  ),
});

const ngoRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ngo/requests",
  component: () => (
    <Wrap requiredRole="ngo">
      <NGORequests />
    </Wrap>
  ),
});

const ngoInventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ngo/inventory",
  component: () => (
    <Wrap requiredRole="ngo">
      <NGOInventory />
    </Wrap>
  ),
});

const ngoMapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ngo/map",
  component: () => (
    <Wrap requiredRole="ngo">
      <NGOMapPage />
    </Wrap>
  ),
});

// Admin routes
const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: () => (
    <Wrap requiredRole="admin">
      <AdminDashboard />
    </Wrap>
  ),
});

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/users",
  component: () => (
    <Wrap requiredRole="admin">
      <AdminUsers />
    </Wrap>
  ),
});

const adminNGOsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/ngos",
  component: () => (
    <Wrap requiredRole="admin">
      <AdminNGOs />
    </Wrap>
  ),
});

const adminRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/requests",
  component: () => (
    <Wrap requiredRole="admin">
      <AdminRequests />
    </Wrap>
  ),
});

const adminAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/analytics",
  component: () => (
    <Wrap requiredRole="admin">
      <AdminAnalytics />
    </Wrap>
  ),
});

const adminMapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/map",
  component: () => (
    <Wrap requiredRole="admin">
      <AdminMapPage />
    </Wrap>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  registerUserRoute,
  registerNGORoute,
  registerAdminRoute,
  userDashboardRoute,
  userNewRequestRoute,
  userMapRoute,
  ngoDashboardRoute,
  ngoRequestsRoute,
  ngoInventoryRoute,
  ngoMapRoute,
  adminDashboardRoute,
  adminUsersRoute,
  adminNGOsRoute,
  adminRequestsRoute,
  adminAnalyticsRoute,
  adminMapRoute,
]);

const router = createRouter({ routeTree, defaultPreload: "intent" });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
