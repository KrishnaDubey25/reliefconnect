import { useAuth } from "../../hooks/use-auth";
import { EmergencyBanner } from "../shared/EmergencyBanner";
import { Navigation } from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export function Layout({ children, showNav = true }: LayoutProps) {
  const { isAuthenticated } = useAuth();
  // Show nav whenever the user is authenticated — Navigation handles null role gracefully.
  // Do NOT gate on `role` here: role resolves asynchronously after auth, and hiding the
  // nav layout while role is null causes the dashboard content to render without structure.
  const displayNav = showNav && isAuthenticated;

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <EmergencyBanner />

      {displayNav ? (
        <>
          <div className="flex flex-1 min-h-0 overflow-x-hidden">
            {/* Desktop sidebar */}
            <Navigation />

            {/* Main content */}
            <main
              className="flex-1 flex flex-col min-w-0 overflow-x-hidden"
              data-ocid="layout.main"
            >
              {/* Mobile top bar is inside Navigation */}
              <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 max-w-full">
                {children}
              </div>
            </main>
          </div>
        </>
      ) : (
        <main
          className="flex-1 flex flex-col overflow-x-hidden"
          data-ocid="layout.auth_main"
        >
          {children}
        </main>
      )}
    </div>
  );
}
