module {
  public type AnalyticsSummary = {
    totalUsers : Nat;
    totalNGOs : Nat;
    totalRequests : Nat;
    openRequests : Nat;
    claimedRequests : Nat;
    inTransitRequests : Nat;
    deliveredRequests : Nat;
  };

  public type VerificationCounts = {
    totalUsers : Nat;
    aadhaarDeclared : Nat;
    panDeclared : Nat;
    bothDeclared : Nat;
  };
};
