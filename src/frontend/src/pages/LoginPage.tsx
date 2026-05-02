import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Globe,
  KeyRound,
  Loader2,
  Phone,
  Shield,
  User,
  UserCircle,
  WifiOff,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AIAssistant } from "../components/shared/AIAssistant";
import { LanguageSwitcher } from "../components/shared/LanguageSwitcher";
import { ThemeSwitcher } from "../components/shared/ThemeSwitcher";
import { APP_NAME, EMERGENCY_HOTLINE, ROLE_REDIRECTS } from "../constants";
import { saveSession } from "../hooks/use-auth";
import { useBackend } from "../hooks/use-backend";

// ── Connection guard ─────────────────────────────────────────────────────────
function ConnectionGuard({ children }: { children: React.ReactNode }) {
  const { actor, isFetching, retry } = useBackend();
  const { t } = useTranslation();
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    retry();
  };

  if (!isFetching && retrying) setRetrying(false);

  if (!actor && (isFetching || retrying)) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4 py-20">
        <Loader2 size={32} className="animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{t("app.connecting")}</p>
      </div>
    );
  }

  if (!actor && !isFetching) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4 py-20 px-6">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
          <WifiOff size={26} className="text-accent" />
        </div>
        <div className="text-center max-w-xs">
          <p className="font-semibold text-foreground mb-1">
            {t("app.connectionNotReady")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("app.connectionError")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleRetry}
            data-ocid="connection.retry_button"
          >
            {t("app.retry", "Retry Connection")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            data-ocid="connection.reload_button"
          >
            {t("app.refreshPage")}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

type LoginStep = "select" | "citizen" | "ngo" | "admin";

// ── Role card definitions ────────────────────────────────────────────────────
const ROLE_CARD_IDS = [
  {
    id: "citizen" as const,
    icon: UserCircle,
    labelKey: "login.citizen.label" as const,
    descKey: "login.citizen.desc" as const,
    featureKeys: [
      "login.citizen.features.0",
      "login.citizen.features.1",
      "login.citizen.features.2",
    ] as const,
    colorClass: "text-primary",
    borderClass: "border-primary/40",
    bgClass: "bg-primary/10",
    dotClass: "bg-primary",
    hoverBorder: "hover:border-primary/70",
  },
  {
    id: "ngo" as const,
    icon: Building2,
    labelKey: "login.ngo.label" as const,
    descKey: "login.ngo.desc" as const,
    featureKeys: [
      "login.ngo.features.0",
      "login.ngo.features.1",
      "login.ngo.features.2",
    ] as const,
    colorClass: "text-[oklch(0.65_0.18_151)]",
    borderClass: "border-[oklch(0.65_0.18_151)]/40",
    bgClass: "bg-[oklch(0.65_0.18_151)]/10",
    dotClass: "bg-[oklch(0.65_0.18_151)]",
    hoverBorder: "hover:border-[oklch(0.65_0.18_151)]/70",
  },
  {
    id: "admin" as const,
    icon: Shield,
    labelKey: "login.admin.label" as const,
    descKey: "login.admin.desc" as const,
    featureKeys: [
      "login.admin.features.0",
      "login.admin.features.1",
      "login.admin.features.2",
    ] as const,
    colorClass: "text-[oklch(0.62_0.22_30)]",
    borderClass: "border-[oklch(0.62_0.22_30)]/40",
    bgClass: "bg-[oklch(0.62_0.22_30)]/10",
    dotClass: "bg-[oklch(0.62_0.22_30)]",
    hoverBorder: "hover:border-[oklch(0.62_0.22_30)]/70",
  },
] as const;

// ── Shared decorative blobs ──────────────────────────────────────────────────
function Blobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-20 -right-16 w-64 h-64 lg:w-96 lg:h-96 rounded-full opacity-[0.07] blur-3xl"
        style={{ background: "oklch(0.55 0.22 25)" }}
      />
      <div
        className="absolute bottom-0 -left-16 w-52 h-52 lg:w-72 lg:h-72 rounded-full opacity-[0.05] blur-3xl"
        style={{ background: "oklch(0.58 0.17 145)" }}
      />
    </div>
  );
}

// ── Left panel (branding + AI) — desktop only ────────────────────────────────
function LeftPanel() {
  const { t } = useTranslation();
  return (
    <div className="hidden lg:flex flex-col justify-center px-10 xl:px-14 py-10 border-r border-border bg-card/50 min-h-full">
      {/* Branding */}
      <div className="flex flex-col items-start gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-primary">
          <Shield size={32} className="text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground tracking-tight leading-tight">
            {APP_NAME}
          </h1>
          <p className="text-base text-muted-foreground mt-1">
            {t("login.subtitle")}
          </p>
        </div>

        <a
          href={`tel:${EMERGENCY_HOTLINE}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
          style={{ background: "oklch(0.58 0.22 30)" }}
          data-ocid="login.emergency_hotline"
        >
          <Phone size={15} />
          {EMERGENCY_HOTLINE}
        </a>

        <div
          className="flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-background shadow-sm"
          data-ocid="login.language_switcher_inline"
        >
          <Globe size={14} className="text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground font-medium">
            {t("login.selectLanguage", "Select Language")}
          </span>
          <LanguageSwitcher className="h-6 px-1 text-xs" />
          <div className="w-px h-4 bg-border shrink-0" />
          <ThemeSwitcher />
        </div>
      </div>

      {/* AI Assistant */}
      <div className="w-full">
        <AIAssistant />
      </div>

      {/* Decorative info block */}
      <div className="mt-8 rounded-xl border border-border bg-muted/30 p-4">
        <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
          {t("login.helpTitle", "Quick Help")}
        </p>
        <ul className="space-y-1.5">
          {[
            t("login.help.0", "Citizens: register with name & phone"),
            t("login.help.1", "NGOs: use your org name & phone"),
            t("login.help.2", "Admins: enter your secret key"),
          ].map((tip) => (
            <li
              key={tip}
              className="flex items-start gap-2 text-xs text-muted-foreground"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Role selection screen ────────────────────────────────────────────────────
function RoleSelectScreen({
  onSelect,
}: { onSelect: (role: "citizen" | "ngo" | "admin") => void }) {
  const { t } = useTranslation();
  return (
    <div className="relative flex flex-col flex-1 items-center justify-center px-4 py-8 min-h-0 lg:items-start lg:justify-center lg:px-10 xl:px-14">
      <Blobs />

      {/* Mobile-only header (hidden on desktop — desktop shows LeftPanel) */}
      <div className="relative flex flex-col items-center gap-2.5 mb-6 w-full max-w-sm lg:hidden">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-primary">
          <Shield size={32} className="text-primary-foreground" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
            {APP_NAME}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("login.subtitle")}
          </p>
        </div>

        <a
          href={`tel:${EMERGENCY_HOTLINE}`}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
          style={{ background: "oklch(0.58 0.22 30)" }}
        >
          <Phone size={14} />
          {EMERGENCY_HOTLINE}
        </a>

        <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-card shadow-sm">
          <Globe size={14} className="text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground font-medium">
            {t("login.selectLanguage", "Select Language")}
          </span>
          <LanguageSwitcher className="h-6 px-1 text-xs" />
          <div className="w-px h-4 bg-border shrink-0" />
          <ThemeSwitcher />
        </div>

        <div className="w-full px-1">
          <AIAssistant />
        </div>
      </div>

      {/* Role selector section */}
      <div className="relative w-full max-w-sm lg:max-w-none">
        <p className="text-sm text-muted-foreground mb-4 font-medium text-center lg:text-left">
          {t("login.selectRole")}
        </p>

        <div
          className="grid grid-cols-3 gap-3 lg:gap-6"
          data-ocid="login.role_cards"
        >
          {ROLE_CARD_IDS.map(
            ({
              id,
              icon: Icon,
              labelKey,
              descKey,
              featureKeys,
              colorClass,
              borderClass,
              bgClass,
              dotClass,
              hoverBorder,
            }) => (
              <button
                key={id}
                type="button"
                onClick={() => onSelect(id)}
                className={[
                  "rounded-xl p-3 lg:p-6 border flex flex-col gap-2 lg:gap-3 text-left transition-all cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  bgClass,
                  borderClass,
                  hoverBorder,
                  "hover:shadow-md hover:scale-[1.02]",
                ].join(" ")}
                data-ocid={`login.role_card.${id}`}
              >
                <div className="flex items-center gap-1.5 lg:gap-2">
                  <Icon size={16} className={`${colorClass} lg:w-6 lg:h-6`} />
                  <p className="text-xs lg:text-sm font-bold text-foreground leading-none">
                    {t(labelKey)}
                  </p>
                </div>
                <p className="text-[10px] lg:text-xs text-muted-foreground leading-tight">
                  {t(descKey)}
                </p>
                <ul className="flex flex-col gap-1 lg:gap-1.5 mt-0.5">
                  {featureKeys.map((fk) => (
                    <li key={fk} className="flex items-center gap-1.5">
                      <span
                        className={[
                          "w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full shrink-0",
                          dotClass,
                        ].join(" ")}
                      />
                      <span className="text-[10px] lg:text-xs text-muted-foreground leading-tight">
                        {t(fk)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div
                  className={[
                    "mt-1 flex items-center gap-1 text-[10px] lg:text-xs font-semibold",
                    colorClass,
                  ].join(" ")}
                >
                  {t("login.signIn")}{" "}
                  <ArrowRight size={10} className="lg:w-3 lg:h-3" />
                </div>
              </button>
            ),
          )}
        </div>

        <div className="mt-6 text-center lg:text-left text-sm text-muted-foreground">
          {t("login.newUser", { appName: APP_NAME })}{" "}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline"
            data-ocid="login.register_link"
          >
            {t("login.createAccount")}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Citizen login form ───────────────────────────────────────────────────────
function CitizenLoginForm({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const { actor } = useBackend();
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) {
      setError(t("login.citizen.phoneRequired"));
      return;
    }
    if (!actor) {
      setError(t("login.citizen.errorConnectionNotReady"));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await actor.loginUser(phone.trim());
      if (result.__kind__ === "err") {
        setError(t("login.citizen.errorNotFound"));
        setLoading(false);
        return;
      }
      saveSession({
        role: "citizen",
        userProfile: result.ok,
        ngoProfile: null,
        adminProfile: null,
      });
      navigate({ to: ROLE_REDIRECTS.citizen });
    } catch (err) {
      console.error("[CitizenLogin]", err);
      setError(t("login.citizen.errorGeneral"));
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col flex-1 items-center justify-center px-4 py-12 lg:px-10 xl:px-14">
      <Blobs />
      <div className="relative w-full max-w-sm lg:max-w-md">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          data-ocid="login.back_button"
        >
          <ArrowLeft size={15} /> {t("login.backToRole")}
        </button>

        <div className="bg-card border border-primary/30 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-border flex items-center gap-3 bg-primary/5">
            <UserCircle size={26} className="text-primary shrink-0" />
            <div>
              <h2 className="text-lg font-display font-bold text-foreground">
                {t("login.citizen.title")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("login.citizen.subtitle")}
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="citizen-phone">
                {t("login.citizen.phoneLabel")}
              </Label>
              <div className="relative">
                <Phone
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="citizen-phone"
                  type="tel"
                  placeholder={t("login.citizen.phonePlaceholder")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9"
                  data-ocid="login.citizen.phone_input"
                />
              </div>
            </div>
            {error && (
              <div
                className="flex items-start gap-2 text-sm text-accent bg-accent/10 border border-accent/20 rounded-lg px-3 py-2"
                data-ocid="login.citizen.error_state"
              >
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {error?.includes("register") && (
              <p className="text-xs text-muted-foreground text-center">
                <Link
                  to="/register/user"
                  className="text-primary font-medium hover:underline"
                >
                  {t("login.citizen.registerHere")} →
                </Link>
              </p>
            )}
            <Button
              type="submit"
              className="w-full h-11 font-semibold"
              disabled={loading}
              data-ocid="login.citizen.submit_button"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  {t("login.citizen.signingIn")}
                </>
              ) : (
                t("login.citizen.submitButton")
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              {t("login.citizen.noAccount")}{" "}
              <Link
                to="/register/user"
                className="text-primary font-medium hover:underline"
                data-ocid="login.citizen.register_link"
              >
                {t("login.citizen.registerHere")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── NGO login form ───────────────────────────────────────────────────────────
function NGOLoginForm({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const { actor } = useBackend();
  const { t } = useTranslation();
  const [orgName, setOrgName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orgName.trim() || !phone.trim()) {
      setError(t("login.ngo.fieldsRequired"));
      return;
    }
    if (!actor) {
      setError(t("login.ngo.errorConnectionNotReady"));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await actor.loginNGO(orgName.trim(), phone.trim());
      if (result.__kind__ === "err") {
        setError(t("login.ngo.errorNotFound"));
        setLoading(false);
        return;
      }
      saveSession({
        role: "ngo",
        userProfile: null,
        ngoProfile: result.ok,
        adminProfile: null,
      });
      navigate({ to: ROLE_REDIRECTS.ngo });
    } catch (err) {
      console.error("[NGOLogin]", err);
      setError(t("login.ngo.errorGeneral"));
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col flex-1 items-center justify-center px-4 py-12 lg:px-10 xl:px-14">
      <Blobs />
      <div className="relative w-full max-w-sm lg:max-w-md">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          data-ocid="login.back_button"
        >
          <ArrowLeft size={15} /> {t("login.backToRole")}
        </button>

        <div className="bg-card border border-secondary/30 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-border flex items-center gap-3 bg-secondary/5">
            <Building2 size={26} className="text-secondary shrink-0" />
            <div>
              <h2 className="text-lg font-display font-bold text-foreground">
                {t("login.ngo.title")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("login.ngo.subtitle")}
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ngo-orgname">{t("login.ngo.orgNameLabel")}</Label>
              <div className="relative">
                <Building2
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="ngo-orgname"
                  placeholder={t("login.ngo.orgNamePlaceholder")}
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="pl-9"
                  data-ocid="login.ngo.orgname_input"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ngo-phone">{t("login.ngo.phoneLabel")}</Label>
              <div className="relative">
                <Phone
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="ngo-phone"
                  type="tel"
                  placeholder={t("login.ngo.phonePlaceholder")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9"
                  data-ocid="login.ngo.phone_input"
                />
              </div>
            </div>
            {error && (
              <div
                className="flex items-start gap-2 text-sm text-accent bg-accent/10 border border-accent/20 rounded-lg px-3 py-2"
                data-ocid="login.ngo.error_state"
              >
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-11 font-semibold"
              disabled={loading}
              data-ocid="login.ngo.submit_button"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  {t("login.ngo.signingIn")}
                </>
              ) : (
                t("login.ngo.submitButton")
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              {t("login.ngo.noAccount")}{" "}
              <Link
                to="/register/ngo"
                className="text-primary font-medium hover:underline"
                data-ocid="login.ngo.register_link"
              >
                {t("login.ngo.registerLink")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Admin login form ─────────────────────────────────────────────────────────
function AdminLoginForm({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const { actor } = useBackend();
  const { t } = useTranslation();
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!secretKey.trim()) {
      setError(t("login.admin.secretKeyRequired"));
      return;
    }
    if (!actor) {
      setError(t("login.admin.errorConnectionNotReady"));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await actor.loginAdmin(secretKey.trim());
      if (result.__kind__ === "err") {
        setError(result.err);
        setLoading(false);
        return;
      }
      saveSession({
        role: "admin",
        userProfile: null,
        ngoProfile: null,
        adminProfile: result.ok,
      });
      navigate({ to: ROLE_REDIRECTS.admin });
    } catch (err) {
      console.error("[AdminLogin]", err);
      setError(t("login.admin.errorGeneral"));
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col flex-1 items-center justify-center px-4 py-12 lg:px-10 xl:px-14">
      <Blobs />
      <div className="relative w-full max-w-sm lg:max-w-md">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          data-ocid="login.back_button"
        >
          <ArrowLeft size={15} /> {t("login.backToRole")}
        </button>

        <div className="bg-card border border-accent/30 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-border flex items-center gap-3 bg-accent/5">
            <Shield size={26} className="text-accent shrink-0" />
            <div>
              <h2 className="text-lg font-display font-bold text-foreground">
                {t("login.admin.title")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("login.admin.subtitle")}
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-muted/40 border border-border rounded-xl p-3 flex items-start gap-2.5">
              <KeyRound size={14} className="text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                {t("login.admin.restricted")}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admin-key">
                {t("login.admin.secretKeyLabel")}
              </Label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="admin-key"
                  type="password"
                  placeholder={t("login.admin.secretKeyPlaceholder")}
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="pl-9"
                  data-ocid="login.admin.secret_key_input"
                />
              </div>
            </div>
            {error && (
              <div
                className="flex items-start gap-2 text-sm text-accent bg-accent/10 border border-accent/20 rounded-lg px-3 py-2"
                data-ocid="login.admin.error_state"
              >
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-11 font-semibold"
              disabled={loading}
              data-ocid="login.admin.submit_button"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  {t("login.admin.verifying")}
                </>
              ) : (
                t("login.admin.submitButton")
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Main login page ──────────────────────────────────────────────────────────
export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>("select");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Desktop two-column wrapper */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-screen max-w-5xl xl:max-w-6xl mx-auto w-full lg:shadow-xl lg:rounded-none">
        {/* Left column — branding + AI assistant (desktop only) */}
        <div className="lg:w-2/5 xl:w-[38%] lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <LeftPanel />
        </div>

        {/* Right column — role selection / login forms */}
        <div className="flex-1 flex flex-col">
          {step === "select" && <RoleSelectScreen onSelect={setStep} />}
          {step === "citizen" && (
            <ConnectionGuard>
              <CitizenLoginForm onBack={() => setStep("select")} />
            </ConnectionGuard>
          )}
          {step === "ngo" && (
            <ConnectionGuard>
              <NGOLoginForm onBack={() => setStep("select")} />
            </ConnectionGuard>
          )}
          {step === "admin" && (
            <ConnectionGuard>
              <AdminLoginForm onBack={() => setStep("select")} />
            </ConnectionGuard>
          )}
        </div>
      </div>
    </div>
  );
}
