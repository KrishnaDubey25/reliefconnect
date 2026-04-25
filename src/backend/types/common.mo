module {
  public type UserId = Nat;
  public type NGOId = Nat;
  public type AdminId = Nat;
  public type RequestId = Nat;
  public type InventoryHistoryId = Nat;
  public type Timestamp = Int;

  public type Location = {
    lat : Float;
    lng : Float;
  };

  public type ResourceType = {
    #food;
    #water;
    #medical;
    #other;
  };
};
