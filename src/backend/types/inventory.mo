import CommonTypes "common";

module {
  public type NGOId = CommonTypes.NGOId;
  public type Timestamp = CommonTypes.Timestamp;
  public type ResourceType = CommonTypes.ResourceType;
  public type InventoryHistoryId = CommonTypes.InventoryHistoryId;

  public type Inventory = {
    ngoId : NGOId;
    resourceType : ResourceType;
    quantity : Nat;
    lastUpdated : Timestamp;
  };

  public type InventoryHistory = {
    id : InventoryHistoryId;
    ngoId : NGOId;
    resourceType : ResourceType;
    delta : Int;
    reason : Text;
    timestamp : Timestamp;
  };

  public type UpdateInventoryArgs = {
    resourceType : ResourceType;
    delta : Int;
    reason : Text;
  };
};
