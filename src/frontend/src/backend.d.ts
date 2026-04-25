import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Location {
    lat: number;
    lng: number;
}
export type Timestamp = bigint;
export interface VerificationCounts {
    aadhaarDeclared: bigint;
    bothDeclared: bigint;
    panDeclared: bigint;
    totalUsers: bigint;
}
export interface UpdateRequestStatusArgs {
    status: RequestStatus;
    requestId: RequestId;
}
export interface UpdateInventoryArgs {
    resourceType: ResourceType;
    delta: bigint;
    reason: string;
}
export interface ReliefRequest {
    id: RequestId;
    status: RequestStatus;
    deliveredAt?: Timestamp;
    urgency: UrgencyLevel;
    userId: UserId;
    createdAt: Timestamp;
    description?: string;
    claimedAt?: Timestamp;
    claimedBy?: NGOId;
    userLocation: Location;
    resourceType: ResourceType;
    quantity: bigint;
}
export interface RegisterUserArgs {
    name: string;
    aadhaarDeclared: boolean;
    panDeclared: boolean;
    phone: string;
    location: Location;
}
export interface RegisterAdminArgs {
    secretKey: string;
}
export interface NGOProfile {
    id: NGOId;
    principal: Principal;
    orgName: string;
    serviceRadius: number;
    registeredAt: Timestamp;
    location: Location;
    contactPhone: string;
}
export type NGOId = bigint;
export interface Inventory {
    lastUpdated: Timestamp;
    resourceType: ResourceType;
    ngoId: NGOId;
    quantity: bigint;
}
export interface AnalyticsSummary {
    totalNGOs: bigint;
    inTransitRequests: bigint;
    totalUsers: bigint;
    deliveredRequests: bigint;
    claimedRequests: bigint;
    totalRequests: bigint;
    openRequests: bigint;
}
export interface CreateRequestArgs {
    urgency: UrgencyLevel;
    description?: string;
    userLocation: Location;
    resourceType: ResourceType;
    quantity: bigint;
}
export type UserId = bigint;
export interface RegisterNGOArgs {
    orgName: string;
    serviceRadius: number;
    location: Location;
    contactPhone: string;
}
export interface AdminProfile {
    id: AdminId;
    principal: Principal;
    secretKeyVerified: boolean;
    registeredAt: Timestamp;
}
export type RequestId = bigint;
export interface UserProfile {
    id: UserId;
    principal: Principal;
    name: string;
    aadhaarDeclared: boolean;
    panDeclared: boolean;
    phone: string;
    registeredAt: Timestamp;
    location: Location;
}
export type AdminId = bigint;
export enum RequestStatus {
    open = "open",
    claimed = "claimed",
    inTransit = "inTransit",
    delivered = "delivered"
}
export enum ResourceType {
    other = "other",
    food = "food",
    water = "water",
    medical = "medical"
}
export enum UrgencyLevel {
    low = "low",
    high = "high",
    medium = "medium"
}
export interface backendInterface {
    askAI(userMessage: string): Promise<string>;
    claimRequest(requestId: RequestId): Promise<boolean>;
    createRequest(args: CreateRequestArgs): Promise<ReliefRequest>;
    generateOTP(_email: string): Promise<string>;
    getAllNGOs(): Promise<Array<NGOProfile>>;
    getAllRequestsForAdmin(): Promise<Array<ReliefRequest>>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getAnalyticsSummary(): Promise<AnalyticsSummary>;
    getMyAdminProfile(): Promise<AdminProfile | null>;
    getMyNGOProfile(): Promise<NGOProfile | null>;
    getMyUserProfile(): Promise<UserProfile | null>;
    getNGOInventory(ngoId: NGOId): Promise<Array<Inventory>>;
    getNGOProfile(id: NGOId): Promise<NGOProfile | null>;
    getNearbyNGOs(location: Location, radiusKm: number): Promise<Array<NGOProfile>>;
    getOpenRequests(): Promise<Array<ReliefRequest>>;
    getRequestsByNGO(ngoId: NGOId): Promise<Array<ReliefRequest>>;
    getRequestsByUser(userId: UserId): Promise<Array<ReliefRequest>>;
    getStatus(): Promise<{
        alive: boolean;
        version: string;
        timestamp: bigint;
    }>;
    getUserProfile(id: UserId): Promise<UserProfile | null>;
    getVerificationCounts(): Promise<VerificationCounts>;
    loginAdmin(secretKey: string): Promise<{
        __kind__: "ok";
        ok: AdminProfile;
    } | {
        __kind__: "err";
        err: string;
    }>;
    loginNGO(orgName: string, contactPhone: string): Promise<{
        __kind__: "ok";
        ok: NGOProfile;
    } | {
        __kind__: "err";
        err: string;
    }>;
    loginUser(phone: string): Promise<{
        __kind__: "ok";
        ok: UserProfile;
    } | {
        __kind__: "err";
        err: string;
    }>;
    registerAdmin(args: RegisterAdminArgs): Promise<{
        __kind__: "ok";
        ok: AdminProfile;
    } | {
        __kind__: "err";
        err: string;
    }>;
    registerNGO(args: RegisterNGOArgs): Promise<{
        __kind__: "ok";
        ok: NGOProfile;
    } | {
        __kind__: "err";
        err: string;
    }>;
    registerUser(args: RegisterUserArgs): Promise<{
        __kind__: "ok";
        ok: UserProfile;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateInventory(args: UpdateInventoryArgs): Promise<Inventory>;
    updateRequestStatus(args: UpdateRequestStatusArgs): Promise<boolean>;
    verifyOTP(otp: string): Promise<boolean>;
}
