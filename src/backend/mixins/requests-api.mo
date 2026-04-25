import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import RequestsLib "../lib/requests";
import InventoryLib "../lib/inventory";
import RequestTypes "../types/requests";
import InventoryTypes "../types/inventory";
import UserTypes "../types/users";
import NGOTypes "../types/ngos";
import CommonTypes "../types/common";

mixin (
  requests : List.List<RequestsLib.ReliefRequest>,
  users : List.List<UserTypes.UserProfile>,
  ngos : List.List<NGOTypes.NGOProfile>,
  inventoryMap : Map.Map<Text, InventoryLib.Inventory>,
  inventoryHistory : List.List<InventoryLib.InventoryHistory>,
) {
  /// Creates a new Open request. Caller must be a registered user.
  public shared ({ caller }) func createRequest(args : RequestTypes.CreateRequestArgs) : async RequestTypes.ReliefRequest {
    let userOpt = users.find(func(u) { Principal.equal(u.principal, caller) });
    let user = switch (userOpt) {
      case (?u) { u };
      case null { Runtime.trap("Caller is not a registered user") };
    };
    RequestsLib.create(requests, requests.size(), user.id, args);
  };

  public query func getOpenRequests() : async [RequestTypes.ReliefRequest] {
    RequestsLib.getOpen(requests);
  };

  public query func getRequestsByUser(userId : CommonTypes.UserId) : async [RequestTypes.ReliefRequest] {
    RequestsLib.getByUser(requests, userId);
  };

  public query func getRequestsByNGO(ngoId : CommonTypes.NGOId) : async [RequestTypes.ReliefRequest] {
    RequestsLib.getByNGO(requests, ngoId);
  };

  /// Transitions an Open request to Claimed. Caller must be a registered NGO.
  public shared ({ caller }) func claimRequest(requestId : CommonTypes.RequestId) : async Bool {
    let ngoOpt = ngos.find(func(n) { Principal.equal(n.principal, caller) });
    let ngo = switch (ngoOpt) {
      case (?n) { n };
      case null { Runtime.trap("Caller is not a registered NGO") };
    };
    RequestsLib.claim(requests, requestId, ngo.id);
  };

  /// Updates request status (Claimed → In Transit or In Transit → Delivered).
  /// Caller must be the NGO that claimed the request.
  /// On Delivered with quantity > 0, deducts from inventory (returns false if insufficient stock).
  public shared ({ caller }) func updateRequestStatus(args : RequestTypes.UpdateRequestStatusArgs) : async Bool {
    let ngoOpt = ngos.find(func(n) { Principal.equal(n.principal, caller) });
    let ngo = switch (ngoOpt) {
      case (?n) { n };
      case null { Runtime.trap("Caller is not a registered NGO") };
    };
    // Get the request before updating to know resourceType/quantity
    let reqOpt = RequestsLib.getById(requests, args.requestId);
    let req = switch (reqOpt) {
      case (?r) { r };
      case null { Runtime.trap("Request not found") };
    };
    switch (RequestsLib.updateStatus(requests, args, ngo.id)) {
      case (#ok(?qty)) {
        // Delivered with quantity — deduct from inventory
        let deducted = InventoryLib.deductForDelivery(
          inventoryMap,
          inventoryHistory,
          inventoryHistory.size(),
          ngo.id,
          req.resourceType,
          qty,
        );
        deducted;
      };
      case (#ok(null)) { true };
      case (#err(msg)) { Runtime.trap(msg) };
    };
  };
};
