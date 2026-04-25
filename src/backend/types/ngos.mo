import CommonTypes "common";

module {
  public type NGOId = CommonTypes.NGOId;
  public type Timestamp = CommonTypes.Timestamp;
  public type Location = CommonTypes.Location;

  public type NGOProfile = {
    id : NGOId;
    principal : Principal;
    orgName : Text;
    contactPhone : Text;
    serviceRadius : Float;
    location : Location;
    registeredAt : Timestamp;
  };

  public type RegisterNGOArgs = {
    orgName : Text;
    contactPhone : Text;
    serviceRadius : Float;
    location : Location;
  };
};
