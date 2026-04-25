import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat8 "mo:core/Nat8";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Types "../types/admins";
import CommonTypes "../types/common";

module {
  public type AdminProfile = Types.AdminProfile;
  public type RegisterAdminArgs = Types.RegisterAdminArgs;
  public type AdminId = CommonTypes.AdminId;

  public let ADMIN_SECRET_KEY : Text = "250627";

  public func register(
    admins : List.List<AdminProfile>,
    nextId : Nat,
    caller : Principal,
  ) : AdminProfile {
    let profile : AdminProfile = {
      id = nextId;
      principal = caller;
      secretKeyVerified = true;
      registeredAt = Time.now();
    };
    admins.add(profile);
    profile;
  };

  public func upsert(
    admins : List.List<AdminProfile>,
    nextId : Nat,
    caller : Principal,
  ) : AdminProfile {
    switch (getByPrincipal(admins, caller)) {
      case (?existing) {
        existing;
      };
      case null {
        register(admins, nextId, caller);
      };
    };
  };

  public func getByPrincipal(admins : List.List<AdminProfile>, principal : Principal) : ?AdminProfile {
    admins.find(func(a) { Principal.equal(a.principal, principal) });
  };

  /// Stores hashed OTP keyed by principal text (kept for generateOTP/verifyOTP flow).
  public func hashText(text : Text) : Text {
    let bytes = text.encodeUtf8();
    var sum : Nat = 0;
    for (b in bytes.vals()) {
      sum := sum + b.toNat();
    };
    (sum * 131071 + 999983).toText();
  };

  public func storeOtp(otpStore : Map.Map<Text, Text>, principal : Principal, hashedOtp : Text) {
    otpStore.add(principal.toText(), hashedOtp);
  };

  public func verifyOtp(otpStore : Map.Map<Text, Text>, principal : Principal, hashedOtp : Text) : Bool {
    let key = principal.toText();
    switch (otpStore.get(key)) {
      case (?stored) {
        if (Text.equal(stored, hashedOtp)) {
          otpStore.remove(key);
          true;
        } else {
          false;
        };
      };
      case null { false };
    };
  };
};
