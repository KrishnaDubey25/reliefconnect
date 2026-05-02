import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";

import UserTypes "types/users";
import NGOTypes "types/ngos";
import AdminTypes "types/admins";
import RequestTypes "types/requests";
import InventoryTypes "types/inventory";

import UsersApi "mixins/users-api";
import NGOsApi "mixins/ngos-api";
import AdminsApi "mixins/admins-api";
import RequestsApi "mixins/requests-api";
import InventoryApi "mixins/inventory-api";
import AnalyticsApi "mixins/analytics-api";
import AIChatApi "mixins/ai-chat-api";



actor {
  // --- State collections (var so List.add() / List.mapInPlace() mutations are kept) ---
  var users = List.empty<UserTypes.UserProfile>();
  var ngos = List.empty<NGOTypes.NGOProfile>();
  var admins = List.empty<AdminTypes.AdminProfile>();
  let requests = List.empty<RequestTypes.ReliefRequest>();
  let inventoryMap = Map.empty<Text, InventoryTypes.Inventory>();
  let inventoryHistory = List.empty<InventoryTypes.InventoryHistory>();
  let otpStore = Map.empty<Text, Text>();

  // --- Heartbeat: keeps canister warm and never idle ---
  var lastHeartbeat : Int = 0;
  var heartbeatCount : Nat = 0;
  // Runs every ~2 seconds (each ICP heartbeat tick). We only update state
  // every ~60 seconds to stay lightweight.
  let heartbeatIntervalNs : Int = 60_000_000_000; // 60 seconds in nanoseconds

  system func heartbeat() : async () {
    let now = Time.now();
    if (now - lastHeartbeat >= heartbeatIntervalNs) {
      lastHeartbeat := now;
      heartbeatCount += 1;
    };
  };

  // --- Status endpoint: lets the frontend confirm the canister is alive ---
  public query func getStatus() : async { alive : Bool; timestamp : Int; version : Text } {
    { alive = true; timestamp = Time.now(); version = "1.0.0" };
  };

  // --- Mixins ---
  include UsersApi(users);
  include NGOsApi(ngos);
  include AdminsApi(admins, otpStore);
  include RequestsApi(requests, users, ngos, inventoryMap, inventoryHistory);
  include InventoryApi(inventoryMap, inventoryHistory, ngos);
  include AnalyticsApi(admins, users, ngos, requests);
  include AIChatApi();
};
