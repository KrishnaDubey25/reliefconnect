import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/requests";
import CommonTypes "../types/common";

module {
  public type ReliefRequest = Types.ReliefRequest;
  public type CreateRequestArgs = Types.CreateRequestArgs;
  public type UpdateRequestStatusArgs = Types.UpdateRequestStatusArgs;
  public type RequestId = CommonTypes.RequestId;
  public type UserId = CommonTypes.UserId;
  public type NGOId = CommonTypes.NGOId;
  public type RequestStatus = Types.RequestStatus;

  public func create(
    requests : List.List<ReliefRequest>,
    nextId : Nat,
    userId : UserId,
    args : CreateRequestArgs,
  ) : ReliefRequest {
    let req : ReliefRequest = {
      id = nextId;
      userId = userId;
      userLocation = args.userLocation;
      resourceType = args.resourceType;
      quantity = args.quantity;
      urgency = args.urgency;
      description = args.description;
      status = #open;
      claimedBy = null;
      claimedAt = null;
      deliveredAt = null;
      createdAt = Time.now();
    };
    requests.add(req);
    req;
  };

  public func getById(requests : List.List<ReliefRequest>, id : RequestId) : ?ReliefRequest {
    requests.find(func(r) { r.id == id });
  };

  public func getOpen(requests : List.List<ReliefRequest>) : [ReliefRequest] {
    requests.filter(func(r) { r.status == #open }).toArray();
  };

  public func getByUser(requests : List.List<ReliefRequest>, userId : UserId) : [ReliefRequest] {
    requests.filter(func(r) { r.userId == userId }).toArray();
  };

  public func getByNGO(requests : List.List<ReliefRequest>, ngoId : NGOId) : [ReliefRequest] {
    requests.filter(func(r) {
      switch (r.claimedBy) {
        case (?id) { id == ngoId };
        case null { false };
      };
    }).toArray();
  };

  /// Transitions Open → Claimed. Returns false if not found or not open.
  public func claim(requests : List.List<ReliefRequest>, requestId : RequestId, ngoId : NGOId) : Bool {
    var found = false;
    requests.mapInPlace(func(r) {
      if (r.id == requestId and r.status == #open) {
        found := true;
        {
          r with
          status = #claimed;
          claimedBy = ?ngoId;
          claimedAt = ?Time.now();
        };
      } else { r };
    });
    found;
  };

  /// Transitions Claimed → In Transit or In Transit → Delivered.
  /// Returns #ok(wasDeliveredWithQuantity) or #err message.
  public func updateStatus(
    requests : List.List<ReliefRequest>,
    args : UpdateRequestStatusArgs,
    ngoId : NGOId,
  ) : { #ok : ?Nat; #err : Text } {
    var result : { #ok : ?Nat; #err : Text } = #err("Request not found");
    requests.mapInPlace(func(r) {
      if (r.id == args.requestId) {
        // Only the claiming NGO can update
        switch (r.claimedBy) {
          case (?claimerId) {
            if (claimerId != ngoId) {
              result := #err("Only the claiming NGO can update this request");
              r;
            } else {
              // Validate transition
              let valid = switch (r.status, args.status) {
                case (#claimed, #inTransit) { true };
                case (#inTransit, #delivered) { true };
                case _ { false };
              };
              if (valid) {
                let deliveredAt = switch (args.status) {
                  case (#delivered) { ?Time.now() };
                  case _ { r.deliveredAt };
                };
                let deliveredQty : ?Nat = switch (args.status) {
                  case (#delivered) { if (r.quantity > 0) { ?r.quantity } else { null } };
                  case _ { null };
                };
                result := #ok(deliveredQty);
                { r with status = args.status; deliveredAt = deliveredAt };
              } else {
                result := #err("Invalid status transition");
                r;
              };
            };
          };
          case null {
            result := #err("Request has no claiming NGO");
            r;
          };
        };
      } else { r };
    });
    result;
  };

  public func countByStatus(requests : List.List<ReliefRequest>, status : RequestStatus) : Nat {
    requests.filter(func(r) { r.status == status }).size();
  };
};
