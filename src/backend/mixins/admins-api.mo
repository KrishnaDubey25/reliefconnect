import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import AdminsLib "../lib/admins";
import AdminTypes "../types/admins";

mixin (
  admins : List.List<AdminsLib.AdminProfile>,
  otpStore : Map.Map<Text, Text>,
) {
  /// Register a new admin account using only a secret key.
  public shared ({ caller }) func registerAdmin(args : AdminTypes.RegisterAdminArgs) : async { #ok : AdminTypes.AdminProfile; #err : Text } {
    if (not Text.equal(args.secretKey, AdminsLib.ADMIN_SECRET_KEY)) {
      return #err("Invalid secret key");
    };
    let profile = AdminsLib.upsert(admins, admins.size(), caller);
    #ok(profile);
  };

  /// Generates a 6-digit OTP, stores its hash, and returns the raw OTP.
  /// Caller must be a registered admin.
  public shared ({ caller }) func generateOTP(_email : Text) : async Text {
    switch (AdminsLib.getByPrincipal(admins, caller)) {
      case null { Runtime.trap("Not a registered admin") };
      case (?_) {};
    };
    let now = Int.abs(Time.now());
    let seed = Nat.rem(now + caller.toText().size() * 131071 + 100003, 1000000);
    let otpText = seed.toText();
    let padded = leftPad(otpText, 6, "0");
    let hashed = AdminsLib.hashText(padded);
    AdminsLib.storeOtp(otpStore, caller, hashed);
    padded;
  };

  /// Verifies the OTP provided by the caller.
  public shared ({ caller }) func verifyOTP(otp : Text) : async Bool {
    switch (AdminsLib.getByPrincipal(admins, caller)) {
      case null { Runtime.trap("Not a registered admin") };
      case (?_) {};
    };
    let hashed = AdminsLib.hashText(otp);
    AdminsLib.verifyOtp(otpStore, caller, hashed);
  };

  /// Returns the calling admin's profile.
  public shared query ({ caller }) func getMyAdminProfile() : async ?AdminTypes.AdminProfile {
    AdminsLib.getByPrincipal(admins, caller);
  };

  /// Login: validate secret key then look up the admin by caller's principal.
  public shared query ({ caller }) func loginAdmin(secretKey : Text) : async { #ok : AdminTypes.AdminProfile; #err : Text } {
    if (not Text.equal(secretKey, AdminsLib.ADMIN_SECRET_KEY)) {
      return #err("Invalid secret key");
    };
    switch (AdminsLib.getByPrincipal(admins, caller)) {
      case (?profile) { #ok(profile) };
      case null { #err("Admin not registered") };
    };
  };

  // --- Private helpers ---

  func leftPad(s : Text, width : Nat, pad : Text) : Text {
    var result = s;
    var i = s.size();
    while (i < width) {
      result := pad # result;
      i += 1;
    };
    result;
  };
};
