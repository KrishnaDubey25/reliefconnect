import Text "mo:core/Text";

mixin () {
  /// Rule-based AI assistant for ReliefConnect. Answers common questions via keyword matching.
  /// No external HTTP calls — fully self-contained.
  public shared func askAI(userMessage : Text) : async Text {
    let msg = userMessage.toLower();

    // --- Greetings ---
    if (containsAny(msg, ["hello", "hi ", "hi,", "namaste", "hey", "greetings"])) {
      return "Namaste! 🙏 Welcome to ReliefConnect, your emergency relief coordination platform. I can help you with registering, logging in, submitting or managing relief requests, using the map, switching languages, and more. What would you like to know?";
    };

    // --- Registration / Signup ---
    if (containsAny(msg, ["register", "signup", "sign up", "create account", "new account", "how to join", "how do i join", "how to sign"])) {
      if (containsAny(msg, ["admin"])) {
        return "To register as an Admin:\n1. Go to the Registration page and select 'Admin'.\n2. Enter the secret key provided by your administrator (contact your administrator for the secret key).\n3. Submit to gain admin access.\n\nAdmins can verify NGOs and citizens, view analytics, and manage all requests.";
      };
      if (containsAny(msg, ["ngo", "organisation", "organization", "org"])) {
        return "To register as an NGO:\n1. Go to the Registration page and select 'NGO'.\n2. Enter your organisation name, username, and password.\n3. Submit — your account is created immediately.\n\nNGOs can view open relief requests, claim them, update fulfilment status, and manage inventory.";
      };
      // Default to Citizen
      return "To register as a Citizen:\n1. Go to the Registration page and select 'Citizen'.\n2. Enter your name, phone number, and location.\n3. Submit — you can start requesting relief right away.\n\nAs a Citizen you can submit relief requests, track their status, and see NGOs on the map.";
    };

    // --- Login ---
    if (containsAny(msg, ["login", "log in", "sign in", "signin", "how to log", "can't log", "cannot log", "trouble log"])) {
      if (containsAny(msg, ["admin"])) {
        return "To log in as an Admin:\n1. Open the app and select 'Admin' on the Login page.\n2. Enter your secret key.\n3. Tap 'Login' — you'll be taken straight to the Admin dashboard.";
      };
      if (containsAny(msg, ["ngo", "organisation", "organization", "org"])) {
        return "To log in as an NGO:\n1. Open the app and select 'NGO' on the Login page.\n2. Enter your username and password.\n3. Tap 'Login' — you'll go directly to the NGO dashboard.";
      };
      return "To log in as a Citizen:\n1. Open the app and select 'Citizen' on the Login page.\n2. Enter your phone number.\n3. Tap 'Login' — you'll be taken straight to your Citizen dashboard.";
    };

    // --- Submitting / Creating a Request ---
    if (containsAny(msg, ["submit request", "new request", "request relief", "how to request", "need food", "need water", "need medicine", "need help", "ask for help", "relief request", "create request", "make request"])) {
      return "To submit a relief request as a Citizen:\n1. Log in and open your Citizen dashboard.\n2. Tap the red-orange 'Request Relief Now' button (with a ⚡ lightning bolt icon) below the stats section.\n3. Complete the 4-step form:\n   • Step 1: Choose resource type (food, water, medicine, or other).\n   • Step 2: Set urgency level.\n   • Step 3: Enter quantity and description.\n   • Step 4: Confirm your location (auto-filled via GPS).\n4. Submit — NGOs will respond within minutes!";
    };

    // --- NGO Workflow ---
    if (containsAny(msg, ["ngo", "claim", "fulfil", "fulfill", "update status", "in transit", "delivered", "ngo dashboard", "manage request"])) {
      return "NGO workflow in ReliefConnect:\n1. Log in as an NGO to access your dashboard.\n2. View all open citizen relief requests (sorted by proximity).\n3. Tap a request to see details, then tap 'Claim' to take it on.\n4. Update the request status as you progress:\n   • Claimed → In Transit → Delivered\n5. Enter the material quantity you are providing in the update panel.\n6. Manage your relief supplies inventory from the Inventory section.\n\nAll requests are also visible on the interactive map.";
    };

    // --- Admin Workflow ---
    if (containsAny(msg, ["admin dashboard", "verify", "analytics", "admin workflow", "admin can", "admin role"])) {
      return "Admin workflow in ReliefConnect:\n1. Log in as an Admin using your secret key.\n2. Access the comprehensive Admin dashboard showing:\n   • All active relief requests and their statuses.\n   • NGO inventory levels.\n   • Verification counts for citizens and NGOs.\n   • Analytics and coordination insights.\n3. Verify NGO and citizen registrations to approve them.\n4. Monitor resource distribution to prevent over- or under-supply.";
    };

    // --- Language Switching ---
    if (containsAny(msg, ["language", "hindi", "bengali", "tamil", "telugu", "marathi", "gujarati", "kannada", "malayalam", "punjabi", "odia", "assamese", "urdu", "change language", "switch language", "indian language"])) {
      return "ReliefConnect supports 20+ official Indian languages including Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu, Maithili, Sanskrit, Konkani, Nepali, Sindhi, Dogri, Kashmiri, and Bodo.\n\nTo switch language:\n1. Look for the language selector in the navigation bar at the top of any page.\n2. On the first page, it is also available below the phone number in the header.\n3. Tap it and choose your preferred language.\n4. Your choice is saved automatically and stays across visits.";
    };

    // --- Map ---
    if (containsAny(msg, ["map", "location", "gps", "where", "nearby", "distance", "proximity"])) {
      return "ReliefConnect includes an interactive map available to all roles:\n• Citizens: See nearby open requests and NGO positions.\n• NGOs: See all open requests on the map, with distance badges to plan routes.\n• Admins: Overview of all request locations and NGO coverage areas.\n\nThe app auto-detects your location once per session (with your permission) and centers the map on you. If you deny location access, the app falls back to your registered address silently.";
    };

    // --- Emergency Contact / Hotline ---
    if (containsAny(msg, ["emergency", "contact", "helpline", "hotline", "phone number", "call", "1800", "help number"])) {
      return "For immediate emergency assistance, call the ReliefConnect helpline:\n📞 1800-180-1253 (toll-free)\n\nThis number is always displayed at the top of the app. NGOs typically respond to submitted requests within minutes.";
    };

    // --- Request Status / Tracking ---
    if (containsAny(msg, ["status", "track", "tracking", "where is my", "progress", "open", "claimed", "transit", "delivered"])) {
      return "Relief request statuses in ReliefConnect:\n• Open — request submitted, waiting for an NGO to claim it.\n• Claimed — an NGO has taken on your request.\n• In Transit — the NGO is on the way with your supplies.\n• Delivered — supplies have been delivered to you.\n\nYou can track your request status in real time on your Citizen dashboard.";
    };

    // --- Inventory ---
    if (containsAny(msg, ["inventory", "stock", "supplies", "supply"])) {
      return "NGOs manage their relief supply inventory directly in ReliefConnect:\n1. Log in as an NGO and go to the Inventory section.\n2. View current stock levels for food, water, medicine, and other supplies.\n3. Update quantities as supplies are dispatched or restocked.\n\nAdmins can see all NGO inventory levels on the Admin dashboard for coordination.";
    };

    // --- Navigation ---
    if (containsAny(msg, ["navigate", "navigation", "back", "forward", "arrow", "go back", "previous page", "next page"])) {
      return "ReliefConnect has back (←) and forward (→) navigation arrows on every page:\n• On desktop: arrows appear in the sidebar.\n• On mobile: arrows appear in the top bar.\n\nThese work just like browser back/forward buttons so you can move between pages easily.";
    };

    // --- Default / Unrecognized ---
    "I'm the ReliefConnect AI assistant! I can help you with:\n\n• Registering as a Citizen, NGO, or Admin\n• Logging in to your account\n• Submitting a relief request (Citizens)\n• Claiming and updating requests (NGOs)\n• Verifying users and viewing analytics (Admins)\n• Switching between 20+ Indian languages\n• Using the interactive map\n• Understanding request statuses\n• Managing NGO inventory\n• Emergency contact: 1800-180-1253\n\nJust type your question and I'll do my best to help! 🙏";
  };

  /// Returns true if `haystack` contains any of the given `needles`.
  private func containsAny(haystack : Text, needles : [Text]) : Bool {
    for (needle in needles.vals()) {
      if (haystack.contains(#text needle)) {
        return true;
      };
    };
    false;
  };
};
