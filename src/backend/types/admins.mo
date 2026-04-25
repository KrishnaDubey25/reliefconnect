import CommonTypes "common";

module {
  public type AdminId = CommonTypes.AdminId;
  public type Timestamp = CommonTypes.Timestamp;

  public type AdminProfile = {
    id : AdminId;
    principal : Principal;
    secretKeyVerified : Bool;
    registeredAt : Timestamp;
  };

  public type RegisterAdminArgs = {
    secretKey : Text;
  };
};
