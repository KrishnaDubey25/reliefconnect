import type { backendInterface } from "../backend";
import {
  RequestStatus,
  ResourceType,
  UrgencyLevel,
} from "../backend";
import type {
  ReliefRequest,
  UserProfile,
  NGOProfile,
  AdminProfile,
  Inventory,
  AnalyticsSummary,
  VerificationCounts,
} from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);

const sampleUser: UserProfile = {
  id: BigInt(1),
  principal: { toText: () => "2vxsx-fae" } as any,
  name: "Sarah Johnson",
  phone: "+234-801-234-5678",
  aadhaarDeclared: true,
  panDeclared: false,
  registeredAt: now - BigInt(86400000000000),
  location: { lat: 6.5244, lng: 3.3792 },
};

const sampleNGO: NGOProfile = {
  id: BigInt(1),
  principal: { toText: () => "aaaaa-aa" } as any,
  orgName: "Red Cross Nigeria",
  serviceRadius: 15,
  registeredAt: now - BigInt(30 * 86400000000000),
  location: { lat: 6.5244, lng: 3.3792 },
  contactPhone: "+234-701-000-0001",
};

const sampleNGO2: NGOProfile = {
  id: BigInt(2),
  principal: { toText: () => "bbbbb-bb" } as any,
  orgName: "UNOCHA Nigeria",
  serviceRadius: 30,
  registeredAt: now - BigInt(60 * 86400000000000),
  location: { lat: 6.4550, lng: 3.4206 },
  contactPhone: "+234-701-000-0002",
};

const sampleRequests: ReliefRequest[] = [
  {
    id: BigInt(1),
    status: RequestStatus.open,
    urgency: UrgencyLevel.high,
    userId: BigInt(1),
    createdAt: now - BigInt(25 * 60 * 1_000_000_000),
    userLocation: { lat: 6.5355, lng: 3.3087 },
    resourceType: ResourceType.food,
    quantity: BigInt(5),
    description: "Family of 5 urgently needs food aid",
  },
  {
    id: BigInt(2),
    status: RequestStatus.inTransit,
    urgency: UrgencyLevel.medium,
    userId: BigInt(2),
    createdAt: now - BigInt(60 * 60 * 1_000_000_000),
    claimedAt: now - BigInt(30 * 60 * 1_000_000_000),
    claimedBy: BigInt(1),
    userLocation: { lat: 6.4698, lng: 3.5852 },
    resourceType: ResourceType.water,
    quantity: BigInt(10),
    description: "Clean water - Bariga district",
  },
  {
    id: BigInt(3),
    status: RequestStatus.delivered,
    urgency: UrgencyLevel.low,
    userId: BigInt(3),
    createdAt: now - BigInt(3 * 60 * 60 * 1_000_000_000),
    claimedAt: now - BigInt(2 * 60 * 60 * 1_000_000_000),
    claimedBy: BigInt(2),
    deliveredAt: now - BigInt(30 * 60 * 1_000_000_000),
    userLocation: { lat: 6.6018, lng: 3.3515 },
    resourceType: ResourceType.medical,
    quantity: BigInt(2),
    description: "Medicine delivery completed",
  },
  {
    id: BigInt(4),
    status: RequestStatus.claimed,
    urgency: UrgencyLevel.high,
    userId: BigInt(4),
    createdAt: now - BigInt(45 * 60 * 1_000_000_000),
    claimedAt: now - BigInt(15 * 60 * 1_000_000_000),
    claimedBy: BigInt(1),
    userLocation: { lat: 6.5149, lng: 3.3899 },
    resourceType: ResourceType.food,
    quantity: BigInt(8),
    description: "Food aid for 8 people",
  },
];

const sampleAdmin: AdminProfile = {
  id: BigInt(1),
  principal: { toText: () => "admin-principal" } as any,
  secretKeyVerified: true,
  registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
};

const sampleInventory: Inventory[] = [
  {
    ngoId: BigInt(1),
    resourceType: ResourceType.food,
    quantity: BigInt(180),
    lastUpdated: now,
  },
  {
    ngoId: BigInt(1),
    resourceType: ResourceType.water,
    quantity: BigInt(300),
    lastUpdated: now,
  },
  {
    ngoId: BigInt(1),
    resourceType: ResourceType.medical,
    quantity: BigInt(75),
    lastUpdated: now,
  },
];

const sampleAnalytics: AnalyticsSummary = {
  totalRequests: BigInt(1250),
  openRequests: BigInt(450),
  claimedRequests: BigInt(120),
  inTransitRequests: BigInt(200),
  deliveredRequests: BigInt(480),
  totalUsers: BigInt(3200),
  totalNGOs: BigInt(65),
};

const sampleVerificationCounts: VerificationCounts = {
  totalUsers: BigInt(3200),
  aadhaarDeclared: BigInt(2100),
  panDeclared: BigInt(1800),
  bothDeclared: BigInt(1400),
};

export const mockBackend: backendInterface = {
  claimRequest: async (_requestId) => true,
  createRequest: async (args) => ({
    id: BigInt(99),
    status: RequestStatus.open,
    urgency: args.urgency,
    userId: BigInt(1),
    createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    userLocation: args.userLocation,
    resourceType: args.resourceType,
    quantity: args.quantity,
    description: args.description,
  }),
  generateOTP: async (_email) => "123456",
  getAllNGOs: async () => [sampleNGO, sampleNGO2],
  getAllRequestsForAdmin: async () => sampleRequests,
  getAllUsers: async () => [sampleUser],
  getAnalyticsSummary: async () => sampleAnalytics,
  getMyAdminProfile: async () => sampleAdmin,
  getMyNGOProfile: async () => sampleNGO,
  getMyUserProfile: async () => sampleUser,
  getNGOInventory: async (_ngoId) => sampleInventory,
  getNGOProfile: async (_id) => sampleNGO,
  getNearbyNGOs: async (_location, _radius) => [sampleNGO, sampleNGO2],
  getOpenRequests: async () => sampleRequests.filter((r) => r.status === RequestStatus.open),
  getRequestsByNGO: async (_ngoId) => sampleRequests,
  getRequestsByUser: async (_userId) => sampleRequests,
  getUserProfile: async (_id) => sampleUser,
  getStatus: async () => ({ alive: true, timestamp: BigInt(Date.now()), version: "1.0.0" }),
  getVerificationCounts: async () => sampleVerificationCounts,
  registerAdmin: async (_args) => ({
    __kind__: "ok",
    ok: {
      id: BigInt(1),
      principal: { toText: () => "new-admin" } as any,
      secretKeyVerified: true,
      registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
    },
  }),
  registerNGO: async (args) => ({
    __kind__: "ok",
    ok: {
      id: BigInt(99),
      principal: { toText: () => "new-ngo" } as any,
      orgName: args.orgName,
      serviceRadius: args.serviceRadius,
      location: args.location,
      contactPhone: args.contactPhone,
      registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
    },
  }),
  registerUser: async (args) => ({
    __kind__: "ok",
    ok: {
      id: BigInt(99),
      principal: { toText: () => "new-user" } as any,
      name: args.name,
      phone: args.phone,
      aadhaarDeclared: args.aadhaarDeclared,
      panDeclared: args.panDeclared,
      location: args.location,
      registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
    },
  }),
  loginAdmin: async (_secretKey) => ({
    __kind__: "ok",
    ok: {
      id: BigInt(1),
      principal: { toText: () => "admin-principal" } as any,
      secretKeyVerified: true,
      registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
    },
  }),
  loginNGO: async (_orgName, _contactPhone) => ({
    __kind__: "ok",
    ok: sampleNGO,
  }),
  loginUser: async (_phone) => ({
    __kind__: "ok",
    ok: sampleUser,
  }),
  updateInventory: async (args) => ({
    ngoId: BigInt(1),
    resourceType: args.resourceType,
    quantity: BigInt(180) + args.delta,
    lastUpdated: BigInt(Date.now()) * BigInt(1_000_000),
  }),
  updateRequestStatus: async (_args) => true,
  verifyOTP: async (_otp) => true,
  askAI: async (_message: string) => 'Hi! I am the ReliefConnect AI assistant. How can I help you today?',
};
