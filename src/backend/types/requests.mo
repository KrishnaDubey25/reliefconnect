import CommonTypes "common";

module {
  public type RequestId = CommonTypes.RequestId;
  public type UserId = CommonTypes.UserId;
  public type NGOId = CommonTypes.NGOId;
  public type Timestamp = CommonTypes.Timestamp;
  public type Location = CommonTypes.Location;
  public type ResourceType = CommonTypes.ResourceType;

  public type UrgencyLevel = {
    #low;
    #medium;
    #high;
  };

  public type RequestStatus = {
    #open;
    #claimed;
    #inTransit;
    #delivered;
  };

  public type ReliefRequest = {
    id : RequestId;
    userId : UserId;
    userLocation : Location;
    resourceType : ResourceType;
    quantity : Nat;
    urgency : UrgencyLevel;
    description : ?Text;
    status : RequestStatus;
    claimedBy : ?NGOId;
    claimedAt : ?Timestamp;
    deliveredAt : ?Timestamp;
    createdAt : Timestamp;
  };

  public type CreateRequestArgs = {
    userLocation : Location;
    resourceType : ResourceType;
    quantity : Nat;
    urgency : UrgencyLevel;
    description : ?Text;
  };

  public type UpdateRequestStatusArgs = {
    requestId : RequestId;
    status : RequestStatus;
  };
};
