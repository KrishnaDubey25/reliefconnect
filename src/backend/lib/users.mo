import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/users";
import CommonTypes "../types/common";

module {
  public type UserProfile = Types.UserProfile;
  public type RegisterUserArgs = Types.RegisterUserArgs;
  public type UserId = CommonTypes.UserId;

  public func register(
    users : List.List<UserProfile>,
    nextId : Nat,
    caller : Principal,
    args : RegisterUserArgs,
  ) : UserProfile {
    let profile : UserProfile = {
      id = nextId;
      principal = caller;
      name = args.name;
      phone = args.phone;
      location = args.location;
      aadhaarDeclared = args.aadhaarDeclared;
      panDeclared = args.panDeclared;
      registeredAt = Time.now();
    };
    users.add(profile);
    profile;
  };

  public func getById(users : List.List<UserProfile>, id : UserId) : ?UserProfile {
    users.find(func(u) { u.id == id });
  };

  public func getByPrincipal(users : List.List<UserProfile>, principal : Principal) : ?UserProfile {
    users.find(func(u) { u.principal == principal });
  };

  public func getByPhone(users : List.List<UserProfile>, phone : Text) : ?UserProfile {
    users.find(func(u) { u.phone == phone });
  };

  public func upsert(
    users : List.List<UserProfile>,
    nextId : Nat,
    caller : Principal,
    args : RegisterUserArgs,
  ) : UserProfile {
    switch (getByPrincipal(users, caller)) {
      case (?existing) {
        let updated : UserProfile = {
          existing with
          name = args.name;
          phone = args.phone;
          location = args.location;
          aadhaarDeclared = args.aadhaarDeclared;
          panDeclared = args.panDeclared;
        };
        users.mapInPlace(func(u) {
          if (u.principal == caller) updated else u
        });
        updated;
      };
      case null {
        register(users, nextId, caller, args);
      };
    };
  };

  public func getAll(users : List.List<UserProfile>) : [UserProfile] {
    users.toArray();
  };

  public func aadhaarDeclaredCount(users : List.List<UserProfile>) : Nat {
    users.foldLeft<Nat, UserProfile>(0, func(acc, u) {
      if (u.aadhaarDeclared) acc + 1 else acc;
    });
  };

  public func panDeclaredCount(users : List.List<UserProfile>) : Nat {
    users.foldLeft<Nat, UserProfile>(0, func(acc, u) {
      if (u.panDeclared) acc + 1 else acc;
    });
  };

  public func bothDeclaredCount(users : List.List<UserProfile>) : Nat {
    users.foldLeft<Nat, UserProfile>(0, func(acc, u) {
      if (u.aadhaarDeclared and u.panDeclared) acc + 1 else acc;
    });
  };
};
