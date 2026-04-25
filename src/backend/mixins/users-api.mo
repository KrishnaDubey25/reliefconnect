import List "mo:core/List";
import UsersLib "../lib/users";
import UserTypes "../types/users";
import CommonTypes "../types/common";

mixin (
  users : List.List<UsersLib.UserProfile>,
) {
  public shared ({ caller }) func registerUser(args : UserTypes.RegisterUserArgs) : async { #ok : UserTypes.UserProfile; #err : Text } {
    let profile = UsersLib.upsert(users, users.size(), caller, args);
    #ok(profile);
  };

  public shared query ({ caller }) func getMyUserProfile() : async ?UserTypes.UserProfile {
    UsersLib.getByPrincipal(users, caller);
  };

  public query func getUserProfile(id : CommonTypes.UserId) : async ?UserTypes.UserProfile {
    UsersLib.getById(users, id);
  };

  public query func getAllUsers() : async [UserTypes.UserProfile] {
    UsersLib.getAll(users);
  };

  /// Login: look up a citizen by phone number. No principal check — anyone can call.
  public query func loginUser(phone : Text) : async { #ok : UserTypes.UserProfile; #err : Text } {
    switch (UsersLib.getByPhone(users, phone)) {
      case (?profile) { #ok(profile) };
      case null { #err("User not found") };
    };
  };
};
