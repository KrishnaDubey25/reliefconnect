import List "mo:core/List";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Types "../types/ngos";
import CommonTypes "../types/common";

module {
  public type NGOProfile = Types.NGOProfile;
  public type RegisterNGOArgs = Types.RegisterNGOArgs;
  public type NGOId = CommonTypes.NGOId;
  public type Location = CommonTypes.Location;

  // Haversine formula — returns distance in km between two lat/lng points
  func haversineKm(a : Location, b : Location) : Float {
    let r : Float = 6371.0; // Earth radius in km
    let dLat = (b.lat - a.lat) * Float.pi / 180.0;
    let dLng = (b.lng - a.lng) * Float.pi / 180.0;
    let sinDLat = Float.sin(dLat / 2.0);
    let sinDLng = Float.sin(dLng / 2.0);
    let aLat = Float.cos(a.lat * Float.pi / 180.0);
    let bLat = Float.cos(b.lat * Float.pi / 180.0);
    let h = sinDLat * sinDLat + aLat * bLat * sinDLng * sinDLng;
    2.0 * r * Float.arcsin(Float.sqrt(h));
  };

  public func register(
    ngos : List.List<NGOProfile>,
    nextId : Nat,
    caller : Principal,
    args : RegisterNGOArgs,
  ) : NGOProfile {
    let profile : NGOProfile = {
      id = nextId;
      principal = caller;
      orgName = args.orgName;
      contactPhone = args.contactPhone;
      serviceRadius = args.serviceRadius;
      location = args.location;
      registeredAt = Time.now();
    };
    ngos.add(profile);
    profile;
  };

  public func getById(ngos : List.List<NGOProfile>, id : NGOId) : ?NGOProfile {
    ngos.find(func(n) { n.id == id });
  };

  public func getByPrincipal(ngos : List.List<NGOProfile>, principal : Principal) : ?NGOProfile {
    ngos.find(func(n) { n.principal == principal });
  };

  public func getByOrgNameAndPhone(ngos : List.List<NGOProfile>, orgName : Text, contactPhone : Text) : ?NGOProfile {
    ngos.find(func(n) { n.orgName == orgName and n.contactPhone == contactPhone });
  };

  public func upsert(
    ngos : List.List<NGOProfile>,
    nextId : Nat,
    caller : Principal,
    args : RegisterNGOArgs,
  ) : NGOProfile {
    switch (getByPrincipal(ngos, caller)) {
      case (?existing) {
        let updated : NGOProfile = {
          existing with
          orgName = args.orgName;
          contactPhone = args.contactPhone;
          serviceRadius = args.serviceRadius;
          location = args.location;
        };
        ngos.mapInPlace(func(n) {
          if (n.principal == caller) updated else n
        });
        updated;
      };
      case null {
        register(ngos, nextId, caller, args);
      };
    };
  };

  public func getAll(ngos : List.List<NGOProfile>) : [NGOProfile] {
    ngos.toArray();
  };

  public func getNearby(ngos : List.List<NGOProfile>, location : Location, radiusKm : Float) : [NGOProfile] {
    ngos.filter(func(n) { haversineKm(location, n.location) <= radiusKm }).toArray();
  };
};
