import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import InventoryLib "../lib/inventory";
import InventoryTypes "../types/inventory";
import NGOTypes "../types/ngos";
import CommonTypes "../types/common";

mixin (
  inventoryMap : Map.Map<Text, InventoryLib.Inventory>,
  inventoryHistory : List.List<InventoryLib.InventoryHistory>,
  ngos : List.List<NGOTypes.NGOProfile>,
) {
  public query func getNGOInventory(ngoId : CommonTypes.NGOId) : async [InventoryTypes.Inventory] {
    InventoryLib.getForNGO(inventoryMap, ngoId);
  };

  /// Adjusts caller NGO's inventory by delta with a reason. Returns the updated entry.
  /// Traps if delta would push quantity below zero.
  public shared ({ caller }) func updateInventory(args : InventoryTypes.UpdateInventoryArgs) : async InventoryTypes.Inventory {
    let ngoOpt = ngos.find(func(n) { Principal.equal(n.principal, caller) });
    let ngo = switch (ngoOpt) {
      case (?n) { n };
      case null { Runtime.trap("Caller is not a registered NGO") };
    };
    InventoryLib.update(inventoryMap, inventoryHistory, inventoryHistory.size(), ngo.id, args);
  };
};
