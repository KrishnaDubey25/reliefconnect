import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Types "../types/inventory";
import CommonTypes "../types/common";

module {
  public type Inventory = Types.Inventory;
  public type InventoryHistory = Types.InventoryHistory;
  public type UpdateInventoryArgs = Types.UpdateInventoryArgs;
  public type NGOId = CommonTypes.NGOId;
  public type ResourceType = CommonTypes.ResourceType;

  /// Composite key: "ngoId:resourceTypeText"
  public func makeKey(ngoId : NGOId, resourceType : ResourceType) : Text {
    let rt = switch (resourceType) {
      case (#food) { "food" };
      case (#water) { "water" };
      case (#medical) { "medical" };
      case (#other) { "other" };
    };
    ngoId.toText() # ":" # rt;
  };

  /// Returns all inventory entries for a given NGO.
  public func getForNGO(
    inventoryMap : Map.Map<Text, Inventory>,
    ngoId : NGOId,
  ) : [Inventory] {
    let prefix = ngoId.toText() # ":";
    inventoryMap.entries()
      .filter(func((k, _v)) { k.startsWith(#text prefix) })
      .map<(Text, Inventory), Inventory>(func((_k, v)) { v })
      .toArray();
  };

  /// Adjusts inventory by delta. Traps if result would go below zero.
  /// Returns updated Inventory entry. Appends to inventoryHistory.
  public func update(
    inventoryMap : Map.Map<Text, Inventory>,
    inventoryHistory : List.List<InventoryHistory>,
    nextHistoryId : Nat,
    ngoId : NGOId,
    args : UpdateInventoryArgs,
  ) : Inventory {
    let key = makeKey(ngoId, args.resourceType);
    let current : Inventory = switch (inventoryMap.get(key)) {
      case (?inv) { inv };
      case null {
        {
          ngoId = ngoId;
          resourceType = args.resourceType;
          quantity = 0;
          lastUpdated = Time.now();
        };
      };
    };

    let newQtyInt : Int = current.quantity.toInt() + args.delta;
    if (newQtyInt < 0) {
      Runtime.trap("Inventory cannot go below zero");
    };
    let newQty : Nat = newQtyInt.toNat();

    let updated : Inventory = {
      current with
      quantity = newQty;
      lastUpdated = Time.now();
    };
    inventoryMap.add(key, updated);

    let entry : InventoryHistory = {
      id = nextHistoryId;
      ngoId = ngoId;
      resourceType = args.resourceType;
      delta = args.delta;
      reason = args.reason;
      timestamp = Time.now();
    };
    inventoryHistory.add(entry);

    updated;
  };

  /// Deducts quantity for a delivered request. No-ops if quantity == 0.
  /// Returns true if deduction succeeded, false if insufficient stock.
  public func deductForDelivery(
    inventoryMap : Map.Map<Text, Inventory>,
    inventoryHistory : List.List<InventoryHistory>,
    nextHistoryId : Nat,
    ngoId : NGOId,
    resourceType : ResourceType,
    quantity : Nat,
  ) : Bool {
    if (quantity == 0) { return true };
    let key = makeKey(ngoId, resourceType);
    let current : Inventory = switch (inventoryMap.get(key)) {
      case (?inv) { inv };
      case null {
        { ngoId = ngoId; resourceType = resourceType; quantity = 0; lastUpdated = Time.now() };
      };
    };
    if (current.quantity < quantity) { return false };
    let updated : Inventory = {
      current with
      quantity = current.quantity - quantity;
      lastUpdated = Time.now();
    };
    inventoryMap.add(key, updated);
    let entry : InventoryHistory = {
      id = nextHistoryId;
      ngoId = ngoId;
      resourceType = resourceType;
      delta = -(quantity.toInt());
      reason = "Delivered request deduction";
      timestamp = Time.now();
    };
    inventoryHistory.add(entry);
    true;
  };
};
