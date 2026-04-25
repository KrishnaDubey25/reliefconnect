import List "mo:core/List";
import NGOsLib "../lib/ngos";
import NGOTypes "../types/ngos";
import CommonTypes "../types/common";

mixin (
  ngos : List.List<NGOsLib.NGOProfile>,
) {
  public shared ({ caller }) func registerNGO(args : NGOTypes.RegisterNGOArgs) : async { #ok : NGOTypes.NGOProfile; #err : Text } {
    let profile = NGOsLib.upsert(ngos, ngos.size(), caller, args);
    #ok(profile);
  };

  public shared query ({ caller }) func getMyNGOProfile() : async ?NGOTypes.NGOProfile {
    NGOsLib.getByPrincipal(ngos, caller);
  };

  public query func getNGOProfile(id : CommonTypes.NGOId) : async ?NGOTypes.NGOProfile {
    NGOsLib.getById(ngos, id);
  };

  public query func getAllNGOs() : async [NGOTypes.NGOProfile] {
    NGOsLib.getAll(ngos);
  };

  public query func getNearbyNGOs(location : CommonTypes.Location, radiusKm : Float) : async [NGOTypes.NGOProfile] {
    NGOsLib.getNearby(ngos, location, radiusKm);
  };

  /// Login: look up an NGO by orgName and contactPhone. No principal check — anyone can call.
  public query func loginNGO(orgName : Text, contactPhone : Text) : async { #ok : NGOTypes.NGOProfile; #err : Text } {
    switch (NGOsLib.getByOrgNameAndPhone(ngos, orgName, contactPhone)) {
      case (?profile) { #ok(profile) };
      case null { #err("NGO not found") };
    };
  };
};
