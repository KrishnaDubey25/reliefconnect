import CommonTypes "common";

module {
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;
  public type Location = CommonTypes.Location;

  public type UserRole = {
    #user;
    #ngo;
    #admin;
  };

  public type UserProfile = {
    id : UserId;
    principal : Principal;
    name : Text;
    phone : Text;
    location : Location;
    aadhaarDeclared : Bool;
    panDeclared : Bool;
    registeredAt : Timestamp;
  };

  public type RegisterUserArgs = {
    name : Text;
    phone : Text;
    location : Location;
    aadhaarDeclared : Bool;
    panDeclared : Bool;
  };
};
