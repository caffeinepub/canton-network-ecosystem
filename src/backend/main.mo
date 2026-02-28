import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Char "mo:core/Char";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  // Types
  public type ReferralLink = {
    id : Nat;
    kode : Text;
    urlTujuan : Text;
    deskripsi : ?Text;
    jumlahKlik : Nat;
    tanggalDibuat : Time.Time;
    pemilik : Principal;
  };

  public type UserProfile = {
    name : Text;
  };

  public type Transaction = {
    id : Nat;
    from : Principal;
    to : Principal;
    amount : Nat;
    timestamp : Time.Time;
    note : ?Text;
  };

  var nextId = 1;
  let links = Map.empty<Text, ReferralLink>();
  let linksByOwner = Map.empty<Principal, [Text]>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let balances = Map.empty<Principal, Nat>();
  let transactions = Map.empty<Nat, Transaction>();
  var nextTransactionId = 1;
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module ReferralLink {
    public func compare(referralLink1 : ReferralLink, referralLink2 : ReferralLink) : Order.Order {
      if (referralLink1.tanggalDibuat < referralLink2.tanggalDibuat) {
        #less;
      } else if (referralLink1.tanggalDibuat == referralLink2.tanggalDibuat) {
        #equal;
      } else {
        #greater;
      };
    };
  };

  // Helper Functions
  func isValidReferralCode(code : Text) : Bool {
    if (code.size() > 30) {
      return false;
    };
    code.chars().all(
      func(c) {
        (c.isDigit() or
        (c >= 'a' and c <= 'z') or
        (c >= 'A' and c <= 'Z') or
        c == '-')
      }
    );
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user: Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Referral Link Functions
  public shared ({ caller }) func buatLink(kode : Text, urlTujuan : Text, deskripsi : ?Text) : async ReferralLink {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    if (not isValidReferralCode(kode)) {
      Runtime.trap("Invalid referral code");
    };

    switch (links.get(kode)) {
      case (?_) { Runtime.trap("Referral code already exists") };
      case (null) {};
    };

    let referralLink : ReferralLink = {
      id = nextId;
      kode;
      urlTujuan;
      deskripsi;
      jumlahKlik = 0;
      tanggalDibuat = Time.now();
      pemilik = caller;
    };

    links.add(kode, referralLink);

    let existingLinks = linksByOwner.get(caller);
    switch (existingLinks) {
      case (?codes) {
        let newCodes = codes.concat([kode]);
        linksByOwner.add(caller, newCodes);
      };
      case (null) {
        linksByOwner.add(caller, [kode]);
      };
    };

    nextId += 1;
    referralLink;
  };

  public query func getKodeLink(kode : Text) : async ReferralLink {
    switch (links.get(kode)) {
      case (?link) { link };
      case (null) { Runtime.trap("Link not found") };
    };
  };

  public query ({ caller }) func getLinkByOwner(owner : Principal) : async [ReferralLink] {
    if (caller != owner and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own links");
    };

    switch (linksByOwner.get(owner)) {
      case (?linkCodes) {
        linkCodes.map(
          func(kode) {
            switch (links.get(kode)) {
              case (?link) { link };
              case (null) { Runtime.trap("Link not found") };
            };
          }
        );
      };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getLinksByCurrentUser() : async [ReferralLink] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    switch (linksByOwner.get(caller)) {
      case (?linkCodes) {
        linkCodes.map(
          func(kode) {
            switch (links.get(kode)) {
              case (?link) { link };
              case (null) { Runtime.trap("Link not found") };
            };
          }
        );
      };
      case (null) { [] };
    };
  };

  public query func redirectLinkAndCount(kode : Text) : async Text {
    switch (links.get(kode)) {
      case (?link) {
        link.urlTujuan;
      };
      case (null) { Runtime.trap("Link not found") };
    };
  };

  public shared func incrementClickCount(kode : Text) : async () {
    switch (links.get(kode)) {
      case (?link) {
        let updatedLink = {
          link with
          jumlahKlik = link.jumlahKlik + 1;
        };
        links.add(kode, updatedLink);
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func hapusLink(kode : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    switch (links.get(kode)) {
      case (?link) {
        if (link.pemilik != caller) {
          Runtime.trap("You are not the owner of this link");
        };
        links.remove(kode);

        switch (linksByOwner.get(caller)) {
          case (?linkCodes) {
            let filteredCodes = linkCodes.filter(
              func(existingKode) {
                existingKode != kode;
              }
            );
            linksByOwner.add(caller, filteredCodes);
          };
          case (null) {};
        };
      };
      case (null) { Runtime.trap("Link not found") };
    };
  };

  public shared ({ caller }) func updateLinkData(
    kode : Text,
    newUrlTujuan : ?Text,
    newDeskripsi : ?Text
  ) : async ReferralLink {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    switch (links.get(kode)) {
      case (?link) {
        if (link.pemilik != caller) {
          Runtime.trap("You are not the owner of this link");
        };

        let updatedLink = {
          link with
          urlTujuan = switch (newUrlTujuan) { case (null) { link.urlTujuan }; case (?url) { url } };
          deskripsi = switch (newDeskripsi) { case (null) { link.deskripsi }; case (?desc) { ?desc } };
        };
        links.add(kode, updatedLink);
        updatedLink;
      };
      case (null) { Runtime.trap("Link not found") };
    };
  };

  // Wallet and Transaction Functions
  public shared ({ caller }) func sendCC(to : Principal, amount : Nat, note : ?Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    if (to == caller) {
      Runtime.trap("Cannot send CC to yourself");
    };

    let fromBalance = switch (balances.get(caller)) {
      case (?balance) { balance };
      case (null) { 0 };
    };

    if (fromBalance < amount) {
      Runtime.trap("Insufficient balance");
    };

    if (amount < 1) {
      Runtime.trap("Minimum transfer is 1 CC");
    };

    // Update balances
    balances.add(caller, fromBalance - amount);

    let toBalance = switch (balances.get(to)) {
      case (?balance) { balance };
      case (null) { 0 };
    };

    balances.add(to, toBalance + amount);

    // Record transaction
    let transaction : Transaction = {
      id = nextTransactionId;
      from = caller;
      to;
      amount;
      timestamp = Time.now();
      note;
    };
    transactions.add(nextTransactionId, transaction);
    nextTransactionId += 1;
  };

  public query ({ caller }) func getCCBalance() : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    switch (balances.get(caller)) {
      case (?balance) { balance };
      case (null) { 0 };
    };
  };

  public query ({ caller }) func getCCTransactionHistory(_principal : ?Principal) : async [Transaction] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    let principal = switch (_principal) {
      case (null) { caller };
      case (?p) { p };
    };

    // Authorization check: can only view own transactions unless admin
    if (caller != principal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own transaction history");
    };

    // Filter transactions where the principal is sender or receiver
    let filtered = transactions.values().toArray().filter(
      func(tx) {
        tx.from == principal or tx.to == principal;
      }
    );
    filtered;
  };

  public shared ({ caller }) func adminMintCC(to : Principal, amount : Nat, note : ?Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can mint CC tokens");
    };

    let currentBalance = switch (balances.get(to)) {
      case (?balance) { balance };
      case (null) { 0 };
    };

    balances.add(to, currentBalance + amount);

    let transaction : Transaction = {
      id = nextTransactionId;
      from = caller;
      to;
      amount;
      timestamp = Time.now();
      note;
    };
    transactions.add(nextTransactionId, transaction);
    nextTransactionId += 1;
  };
};
