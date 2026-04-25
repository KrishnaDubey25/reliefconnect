// Re-export backend types for consistent use across the app
export type {
  UserProfile,
  NGOProfile,
  AdminProfile,
  ReliefRequest,
  Inventory,
  AnalyticsSummary,
  VerificationCounts,
  Location,
  Timestamp,
  UserId,
  NGOId,
  AdminId,
  RequestId,
  CreateRequestArgs,
  RegisterUserArgs,
  RegisterNGOArgs,
  RegisterAdminArgs,
  UpdateInventoryArgs,
  UpdateRequestStatusArgs,
} from "./backend";

export { RequestStatus, ResourceType, UrgencyLevel } from "./backend";

export type UserRole = "citizen" | "ngo" | "admin" | null;

export interface AuthState {
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  userProfile: import("./backend").UserProfile | null;
  ngoProfile: import("./backend").NGOProfile | null;
  adminProfile: import("./backend").AdminProfile | null;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}
