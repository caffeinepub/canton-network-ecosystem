import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
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

  public type MarketCategory = {
    #Crypto;
    #Sports;
    #Politics;
    #Technology;
    #Entertainment;
  };

  public type MarketStatus = {
    #active;
    #resolved;
    #cancelled;
  };

  public type Market = {
    id : Nat;
    title : Text;
    description : Text;
    category : MarketCategory;
    imageUrl : Text;
    createdAt : Time.Time;
    deadline : Time.Time;
    totalYesPool : Nat;
    totalNoPool : Nat;
    status : MarketStatus;
    resolvedOutcome : ?Bool;
    creator : Principal;
  };

  public type BetPosition = {
    #yes;
    #no;
  };

  public type Bet = {
    id : Nat;
    marketId : Nat;
    bettor : Principal;
    position : BetPosition;
    amount : Nat;
    timestamp : Time.Time;
    claimed : Bool;
  };

  public type LeaderboardEntry = {
    user : Principal;
    totalWon : Nat;
    totalLost : Nat;
    profit : Int;
    betsCount : Nat;
  };

  var nextId = 1;
  let links = Map.empty<Text, ReferralLink>();
  let linksByOwner = Map.empty<Principal, [Text]>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let balances = Map.empty<Principal, Nat>();
  let transactions = Map.empty<Nat, Transaction>();
  var nextTransactionId = 1;

  let markets = Map.empty<Nat, Market>();
  let bets = Map.empty<Nat, Bet>();
  var nextMarketId = 1;
  var nextBetId = 1;

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
    let chars = code.toArray();
    let checkResult = chars.foldLeft(true, func(acc, c) {
      acc and
      (c >= '\u{0030}' and c <= '\u{0039}' or c >= '\u{0041}' and c <= '\u{005A}' or c >= '\u{0061}' and c <= '\u{007A}' or c >= '\u{0020}' and c <= '\u{007E}');
    });
    checkResult;
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

  public shared ({ caller }) func incrementClickCount(kode : Text) : async () {
    // Allow any authenticated user (including guests) to increment click count
    // This is intentionally permissive as it's meant to track public link clicks
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
        if (link.pemilik != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You are not the owner of this link");
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
        if (link.pemilik != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You are not the owner of this link");
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

  // Prediction Markets Functions
  public shared ({ caller }) func createMarket(
    title : Text,
    description : Text,
    category : MarketCategory,
    imageUrl : Text,
    deadline : Time.Time
  ) : async Market {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create markets");
    };

    if (title.isEmpty()) {
      Runtime.trap("Market title cannot be empty");
    };
    if (deadline <= Time.now()) {
      Runtime.trap("Deadline must be in the future");
    };

    let market : Market = {
      id = nextMarketId;
      title;
      description;
      category;
      imageUrl;
      createdAt = Time.now();
      deadline;
      totalYesPool = 0;
      totalNoPool = 0;
      status = #active;
      resolvedOutcome = null;
      creator = caller;
    };

    markets.add(nextMarketId, market);
    nextMarketId += 1;
    market;
  };

  public shared ({ caller }) func placeBet(marketId : Nat, position : BetPosition, amount : Nat) : async Bet {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can place bets");
    };

    let market = switch (markets.get(marketId)) {
      case (?m) { m };
      case (null) { Runtime.trap("Market not found") };
    };

    if (market.status != #active) {
      Runtime.trap("Market is not active");
    };
    if (amount < 10) {
      Runtime.trap("Minimum bet amount is 10 CC");
    };

    let balance = switch (balances.get(caller)) {
      case (?b) { b };
      case (null) { 0 };
    };
    if (balance < amount) {
      Runtime.trap("Insufficient balance");
    };

    // Deduct balance
    balances.add(caller, balance - amount);

    // Update market pools
    let updatedMarket = {
      market with
      totalYesPool = if (position == #yes) { market.totalYesPool + amount } else {
        market.totalYesPool;
      };
      totalNoPool = if (position == #no) { market.totalNoPool + amount } else {
        market.totalNoPool;
      };
    };
    markets.add(marketId, updatedMarket);

    // Create bet
    let bet : Bet = {
      id = nextBetId;
      marketId;
      bettor = caller;
      position;
      amount;
      timestamp = Time.now();
      claimed = false;
    };
    bets.add(nextBetId, bet);
    nextBetId += 1;
    bet;
  };

  public shared ({ caller }) func resolveMarket(marketId : Nat, outcome : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can resolve markets");
    };

    let market = switch (markets.get(marketId)) {
      case (?m) { m };
      case (null) { Runtime.trap("Market not found") };
    };

    if (market.status != #active) {
      Runtime.trap("Market is not active");
    };

    let updatedMarket = {
      market with
      status = #resolved;
      resolvedOutcome = ?outcome;
    };

    markets.add(marketId, updatedMarket);
  };

  public shared ({ caller }) func claimReward(betId : Nat) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can claim rewards");
    };

    let bet = switch (bets.get(betId)) {
      case (?b) { b };
      case (null) { Runtime.trap("Bet not found") };
    };
    if (bet.bettor != caller) {
      Runtime.trap("Unauthorized: You are not the owner of this bet");
    };
    if (bet.claimed) {
      Runtime.trap("Reward already claimed for this bet");
    };

    let market = switch (markets.get(bet.marketId)) {
      case (?m) { m };
      case (null) { Runtime.trap("Market not found") };
    };

    if (market.status != #resolved) {
      Runtime.trap("Market is not resolved yet");
    };

    // Check if bet is winning
    let isWinningBet = switch (market.resolvedOutcome, bet.position) {
      case (?true, #yes) { true };
      case (?false, #no) { true };
      case (_) { false };
    };
    if (not isWinningBet) {
      Runtime.trap("This bet did not win");
    };

    // Calculate reward
    let totalWinningPool = if (bet.position == #yes) {
      market.totalYesPool;
    } else {
      market.totalNoPool;
    };
    let totalLosingPool = if (bet.position == #yes) {
      market.totalNoPool;
    } else {
      market.totalYesPool;
    };

    let reward = if (totalWinningPool == 0) {
      0; // Avoid division by zero
    } else {
      bet.amount + (bet.amount * totalLosingPool) / totalWinningPool;
    };

    // Mark bet as claimed
    let updatedBet = { bet with claimed = true };
    bets.add(betId, updatedBet);

    // Credit the reward to the claimant's balance
    let currentBalance = switch (balances.get(caller)) {
      case (?b) { b };
      case (null) { 0 };
    };
    balances.add(caller, currentBalance + reward);

    reward;
  };

  public query func getMarkets() : async [Market] {
    markets.values().toArray();
  };

  public query func getMarketsByCategory(category : MarketCategory) : async [Market] {
    markets.values().toArray().filter(
      func(market) {
        market.category == category;
      }
    );
  };

  public query func getMarket(id : Nat) : async ?Market {
    markets.get(id);
  };

  public query func getMarketBets(marketId : Nat) : async [Bet] {
    bets.values().toArray().filter(
      func(bet) {
        bet.marketId == marketId;
      }
    );
  };

  public query ({ caller }) func getUserBets() : async [Bet] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their bets");
    };
    bets.values().toArray().filter(
      func(bet) {
        bet.bettor == caller;
      }
    );
  };

  public query func getLeaderboard() : async [LeaderboardEntry] {
    let betValues = bets.values().toArray();
    let userWinnings = Map.empty<Principal, (Nat, Nat, Int, Nat)>();

    for (bet in betValues.values()) {
      if (bet.claimed) {
        switch (userWinnings.get(bet.bettor)) {
          case (?entry) {
            let (totalWon, totalLost, profit, betsCount) = entry;
            userWinnings.add(
              bet.bettor,
              (
                totalWon + bet.amount,
                totalLost,
                profit + bet.amount,
                betsCount + 1,
              ),
            );
          };
          case (null) {
            userWinnings.add(bet.bettor, (bet.amount, 0, bet.amount, 1));
          };
        };
      } else {
        switch (userWinnings.get(bet.bettor)) {
          case (?entry) {
            let (totalWon, totalLost, profit, betsCount) = entry;
            userWinnings.add(
              bet.bettor,
              (
                totalWon,
                totalLost + bet.amount,
                profit - bet.amount,
                betsCount + 1,
              ),
            );
          };
          case (null) {
            userWinnings.add(bet.bettor, (0, bet.amount, -bet.amount, 1));
          };
        };
      };
    };

    let list = List.empty<LeaderboardEntry>();

    for ((user, entry) in userWinnings.entries()) {
      let (totalWon, totalLost, profit, betsCount) = entry;
      let leaderboardEntry : LeaderboardEntry = {
        user;
        totalWon;
        totalLost;
        profit;
        betsCount;
      };
      list.add(leaderboardEntry);
    };

    list.toArray();
  };

  public shared ({ caller }) func getOrCreateBalance() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can use wallet");
    };

    let balance = switch (balances.get(caller)) {
      case (?b) { b };
      case (null) {
        let initialBalance = 1000;
        balances.add(caller, initialBalance);
        initialBalance;
      };
    };
    balance;
  };
};
