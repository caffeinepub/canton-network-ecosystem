import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Char "mo:core/Char";
import Text "mo:core/Text";

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

  var nextId = 1;
  let links = Map.empty<Text, ReferralLink>();
  let linksByOwner = Map.empty<Principal, List.List<Text>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
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

  // Public Functions
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
      case (?list) {
        list.add(kode);
      };
      case (null) {
        let newList = List.fromArray([kode]);
        linksByOwner.add(caller, newList);
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
      case (?linkList) {
        linkList.toArray().map(
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
      case (?linkList) {
        linkList.toArray().map(
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
          case (?linkList) {
            let filteredList = linkList.filter(
              func(existingKode) {
                existingKode != kode;
              }
            );
            linksByOwner.add(caller, filteredList);
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
};
