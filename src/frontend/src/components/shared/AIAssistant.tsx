import {
  ChevronDown,
  ChevronUp,
  Loader2,
  SendHorizontal,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  time: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function makeAIMsg(text: string): ChatMessage {
  return {
    id: `a-${Date.now()}-${Math.random()}`,
    role: "ai",
    text,
    time: nowHHMM(),
  };
}

// ── Rule-based knowledge base ─────────────────────────────────────────────────
// Fully frontend — no API key, no backend call, 100% reliable.
interface KBEntry {
  keywords: string[];
  answer: string;
}

const KNOWLEDGE_BASE: KBEntry[] = [
  {
    keywords: [
      "register",
      "sign up",
      "signup",
      "create account",
      "new account",
      "citizen",
    ],
    answer:
      "To register as a Citizen:\n1. Open the app and tap 'Citizen' on the role selection screen.\n2. Enter your name, phone number, and location/address.\n3. Tap 'Register'. You're in!\n\nYou can then log in anytime using the Citizen login page with your phone number.",
  },
  {
    keywords: [
      "ngo",
      "organisation",
      "organization",
      "ngo register",
      "ngo login",
    ],
    answer:
      "To register or log in as an NGO:\n1. Tap 'NGO' on the role selection screen.\n2. Enter your NGO username and password.\n3. Tap 'Register' to create a new account, or 'Login' if you already have one.\n\nNGO dashboards show all open citizen requests — you can claim and update them.",
  },
  {
    keywords: ["admin", "administrator", "secret key", "250627"],
    answer:
      "To register or log in as an Admin:\n1. Tap 'Admin' on the role selection screen.\n2. Enter the admin secret key (provided by your coordinator).\n3. Tap 'Login'.\n\nAdmin dashboards show all requests, NGO inventory, verification counts, and analytics.",
  },
  {
    keywords: ["login", "log in", "sign in", "signin", "forgot", "password"],
    answer:
      "Logging in is easy:\n• Citizens: tap 'Citizen' → enter your registered phone number → tap Login.\n• NGOs: tap 'NGO' → enter your username and password → tap Login.\n• Admins: tap 'Admin' → enter the secret key → tap Login.\n\nIf you see 'already registered', go to the Login tab instead of Register.",
  },
  {
    keywords: [
      "request",
      "submit",
      "new request",
      "relief request",
      "need",
      "help",
      "resource",
    ],
    answer:
      "To submit a relief request as a Citizen:\n1. Log in as a Citizen.\n2. On your dashboard, tap the big red-orange 'Request Relief Now' button.\n3. Follow the 4-step form: choose resource type → urgency → quantity/description → confirm location.\n4. Submit — NGOs in your area will see your request and respond within minutes.",
  },
  {
    keywords: [
      "claim",
      "ngo claim",
      "fulfill",
      "fulfil",
      "update request",
      "status",
      "in transit",
      "delivered",
    ],
    answer:
      "NGOs can claim and fulfill requests:\n1. Log in as an NGO.\n2. Your dashboard shows all open citizen requests.\n3. Tap a request to view details, then tap 'Claim' to take it on.\n4. After claiming, use the update panel to set status: Claimed → In Transit → Delivered.\n5. You can also update the quantity of material being delivered.",
  },
  {
    keywords: [
      "map",
      "location",
      "gps",
      "where",
      "find",
      "nearby",
      "distance",
      "km",
    ],
    answer:
      "ReliefConnect uses your device's GPS to show your location on the map automatically. You'll see:\n• Your position and nearby relief requests (with distance badges like '2.3 km away').\n• NGO positions and coverage areas.\n• Request hotspots for admins.\n\nIf you deny location permission, the app uses your registered address instead — no error is shown.",
  },
  {
    keywords: [
      "language",
      "hindi",
      "bengali",
      "tamil",
      "marathi",
      "language switch",
      "change language",
      "translate",
    ],
    answer:
      "ReliefConnect supports all 20+ official Indian languages:\n1. Look for the language switcher in the navigation bar at the top of every page.\n2. Tap it and choose your language — Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, and more.\n3. Your selection is saved automatically and persists across sessions.\n\nThe language switcher is also available on the very first screen before you log in.",
  },
  {
    keywords: ["navigation", "back", "forward", "arrow", "navigate", "go back"],
    answer:
      "Navigation arrows (← and →) are available on all pages:\n• On desktop: look in the sidebar.\n• On mobile: look in the top bar.\n\nThese work like browser back/forward buttons so you can easily move between pages.",
  },
  {
    keywords: [
      "inventory",
      "stock",
      "supplies",
      "ngo inventory",
      "food",
      "water",
      "medicine",
    ],
    answer:
      "NGOs can manage their inventory from the NGO dashboard:\n• View current stock levels for food, water, medicine, and other supplies.\n• Update quantities as resources are dispatched.\n• Admins can see all NGO inventory levels in their analytics dashboard.",
  },
  {
    keywords: ["dashboard", "home", "main screen", "overview"],
    answer:
      "Each role has its own dashboard:\n• Citizens: see your submitted requests, their status, nearby open requests, and a prominent 'Request Relief Now' button.\n• NGOs: see all open requests you can claim, your inventory, and a map of active areas.\n• Admins: see live request feeds, NGO inventory, verification counts, and analytics charts.",
  },
  {
    keywords: ["verification", "aadhaar", "pan", "kyc", "verify", "verified"],
    answer:
      "Verification on ReliefConnect:\n• Citizens and NGOs can self-declare Aadhaar and PAN details during registration.\n• Admins can review verification status from their dashboard.\n• Verification is non-blocking — you can use the app while verification is pending.",
  },
  {
    keywords: [
      "connection",
      "error",
      "not working",
      "failed",
      "unable to reach",
      "server",
      "retry",
    ],
    answer:
      "If you see a 'connection not ready' or 'unable to reach server' error:\n1. Tap the 'Retry' button that appears on the screen — this resets the connection and tries again.\n2. Check your internet connection.\n3. Wait a few seconds and reload the page — the platform may take a moment to inject your connection details.\n\nThe app retries automatically up to 30 seconds on load before showing an error.",
  },
  {
    keywords: ["emergency", "sos", "urgent", "critical", "disaster"],
    answer:
      "For urgent relief:\n• Citizens: submit a request with 'Critical' urgency — NGOs are notified and prioritize these.\n• Call the helpline: 1800-180-1253 (toll-free).\n• Use the app's map to find the nearest active NGO in your area.",
  },
  {
    keywords: ["logout", "log out", "sign out", "exit", "leave"],
    answer:
      "To log out: look for the logout button on your dashboard (usually in the top-right corner or the sidebar menu). Tapping it will sign you out and return you to the login screen.",
  },
  {
    keywords: ["contact", "phone", "helpline", "support", "help"],
    answer:
      "ReliefConnect support:\n• Helpline: 1800-180-1253 (toll-free, available 24/7 during emergencies).\n• For technical issues, describe the problem in this chat and I'll guide you through it.",
  },
  {
    keywords: [
      "what is",
      "about",
      "reliefconnect",
      "platform",
      "how does it work",
      "purpose",
    ],
    answer:
      "ReliefConnect is an emergency relief coordination platform connecting:\n• Citizens in need of food, water, medicine, or other essentials.\n• NGOs that distribute resources and can claim and fulfill requests.\n• Admins who oversee the full operation, verify NGOs, and manage analytics.\n\nIt supports all 20+ Indian languages and works on both mobile and web.",
  },
];

const FALLBACK_ANSWERS = [
  "I am not sure about that specific question, but here are some things I can help with:\n• How to register as Citizen, NGO, or Admin\n• How to submit or claim relief requests\n• How to switch languages\n• How to navigate the app\n• What to do if you see a connection error\n\nAsk me any of these!",
  "I didn't quite catch that. Try asking about registering, submitting a request, switching languages, or using the map — I know all of those!",
  "That one is outside my knowledge. I can answer questions about using ReliefConnect — registering, requests, maps, language switching, and more. What would you like to know?",
];

let fallbackIndex = 0;

function getRuleBasedAnswer(userText: string): string {
  const lower = userText.toLowerCase();

  // Find best matching entry (count keyword hits)
  let bestScore = 0;
  let bestAnswer = "";

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = entry.answer;
    }
  }

  if (bestScore > 0) return bestAnswer;

  // Rotate fallback responses
  const answer = FALLBACK_ANSWERS[fallbackIndex % FALLBACK_ANSWERS.length];
  fallbackIndex++;
  return answer;
}

// Simulate a tiny async delay so it feels like thinking
async function getAnswer(text: string): Promise<string> {
  await new Promise((resolve) =>
    setTimeout(resolve, 400 + Math.random() * 600),
  );
  return getRuleBasedAnswer(text);
}

// ── Welcome message ────────────────────────────────────────────────────────────
const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "ai",
  text: "Hi! I am your ReliefConnect assistant 🤝\n\nAsk me anything about the app — how to register, submit relief requests, claim resources, switch languages, or what to do if something isn't working.",
  time: nowHHMM(),
};

// ── Message bubble ────────────────────────────────────────────────────────────
function Bubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`flex flex-col gap-0.5 ${isUser ? "items-end" : "items-start"}`}
      data-ocid={`ai.message.${isUser ? "user" : "ai"}`}
    >
      <div
        className={[
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words whitespace-pre-line",
          isUser
            ? "rounded-tr-sm text-white"
            : "rounded-tl-sm bg-muted text-foreground border border-border",
        ].join(" ")}
        style={isUser ? { background: "oklch(0.55 0.22 25)" } : undefined}
      >
        {msg.text}
      </div>
      <span className="text-[10px] text-muted-foreground px-1">{msg.time}</span>
    </div>
  );
}

// ── Typing indicator ───────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-start gap-1.5" data-ocid="ai.loading_state">
      <div className="bg-muted border border-border rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex items-center gap-1.5">
        <Loader2 size={13} className="animate-spin text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Thinking…</span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever messages change or panel opens
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      time: nowHHMM(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const reply = await getAnswer(text);
    setMessages((prev) => [...prev, makeAIMsg(reply)]);
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  return (
    <div
      className="w-full mx-auto"
      style={{ maxWidth: "420px" }}
      data-ocid="ai.panel"
    >
      {/* Toggle button / collapsed banner */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="ai-chat-body"
        className={[
          "w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl",
          "border text-sm font-semibold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          open
            ? "rounded-b-none border-b-0"
            : "hover:shadow-sm hover:scale-[1.01]",
        ].join(" ")}
        style={{
          background: open
            ? "oklch(0.18 0.04 25)"
            : "linear-gradient(135deg, oklch(0.55 0.22 25 / 0.15), oklch(0.55 0.22 25 / 0.07))",
          borderColor: "oklch(0.55 0.22 25 / 0.4)",
          color: "oklch(0.75 0.14 25)",
        }}
        data-ocid="ai.toggle_button"
      >
        <span className="flex items-center gap-2">
          <Sparkles size={15} style={{ color: "oklch(0.75 0.14 25)" }} />
          Ask AI Helper
        </span>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {/* Expandable chat body */}
      {open && (
        <div
          id="ai-chat-body"
          className="border rounded-xl rounded-t-none flex flex-col overflow-hidden"
          style={{
            background: "oklch(0.14 0.03 25)",
            borderColor: "oklch(0.55 0.22 25 / 0.4)",
          }}
          data-ocid="ai.chat_panel"
        >
          {/* Messages list */}
          <div
            className="flex flex-col gap-3 overflow-y-auto p-4"
            style={{ maxHeight: "48vh" }}
            role="log"
            aria-live="polite"
            aria-label="AI assistant conversation"
          >
            {messages.map((msg) => (
              <Bubble key={msg.id} msg={msg} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Divider */}
          <div
            className="h-px mx-4"
            style={{ background: "oklch(0.55 0.22 25 / 0.2)" }}
          />

          {/* Input area */}
          <div className="flex items-center gap-2 p-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="How do I register? How to switch language?…"
              className={[
                "flex-1 min-w-0 rounded-lg px-3 py-2 text-sm bg-muted/30 border border-border",
                "text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-colors duration-150",
              ].join(" ")}
              style={{ background: "oklch(0.20 0.04 25)" }}
              aria-label="Message input"
              data-ocid="ai.input"
            />
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className={[
                "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center",
                "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                loading || !input.trim()
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:scale-110 active:scale-95",
              ].join(" ")}
              style={{ background: "oklch(0.55 0.22 25)" }}
              data-ocid="ai.send_button"
            >
              <SendHorizontal size={16} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
