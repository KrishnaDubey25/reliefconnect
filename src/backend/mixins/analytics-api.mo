import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AdminsLib "../lib/admins";
import UserTypes "../types/users";
import NGOTypes "../types/ngos";
import RequestTypes "../types/requests";
import AnalyticsTypes "../types/analytics";

mixin (
  admins : List.List<AdminsLib.AdminProfile>,
  users : List.List<UserTypes.UserProfile>,
  ngos : List.List<NGOTypes.NGOProfile>,
  requests : List.List<RequestTypes.ReliefRequest>,
) {
  /// Returns aggregated analytics across all data. Admin-only.
  public shared query ({ caller }) func getAnalyticsSummary() : async AnalyticsTypes.AnalyticsSummary {
    switch (AdminsLib.getByPrincipal(admins, caller)) {
      case null { Runtime.trap("Admin access required") };
      case (?_) {};
    };
    let totalRequests = requests.size();
    let openRequests = requests.filter(func(r) { r.status == #open }).size();
    let claimedRequests = requests.filter(func(r) { r.status == #claimed }).size();
    let inTransitRequests = requests.filter(func(r) { r.status == #inTransit }).size();
    let deliveredRequests = requests.filter(func(r) { r.status == #delivered }).size();
    {
      totalUsers = users.size();
      totalNGOs = ngos.size();
      totalRequests;
      openRequests;
      claimedRequests;
      inTransitRequests;
      deliveredRequests;
    };
  };

  /// Returns Aadhaar/PAN declaration counts. Admin-only.
  public shared query ({ caller }) func getVerificationCounts() : async AnalyticsTypes.VerificationCounts {
    switch (AdminsLib.getByPrincipal(admins, caller)) {
      case null { Runtime.trap("Admin access required") };
      case (?_) {};
    };
    let totalUsers = users.size();
    let aadhaarDeclared = users.filter(func(u) { u.aadhaarDeclared }).size();
    let panDeclared = users.filter(func(u) { u.panDeclared }).size();
    let bothDeclared = users.filter(func(u) { u.aadhaarDeclared and u.panDeclared }).size();
    { totalUsers; aadhaarDeclared; panDeclared; bothDeclared };
  };

  /// Returns all relief requests unfiltered (admin dashboard feed). Admin-only.
  public shared query ({ caller }) func getAllRequestsForAdmin() : async [RequestTypes.ReliefRequest] {
    switch (AdminsLib.getByPrincipal(admins, caller)) {
      case null { Runtime.trap("Admin access required") };
      case (?_) {};
    };
    requests.toArray();
  };
};
