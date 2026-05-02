import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/shared/LanguageSwitcher";
import { APP_NAME } from "../constants";

interface RoleCard {
  id: "user" | "ngo" | "admin";
  icon: string;
  titleKey: string;
  badgeKey: string;
  badgeVariant: "default" | "secondary" | "outline";
  descKey: string;
  featureKeys: string[];
  registerButtonKey: string;
  path: "/register/user" | "/register/ngo" | "/register/admin";
  borderHover: string;
}

const ROLES: RoleCard[] = [
  {
    id: "user",
    icon: "🧑‍💼",
    titleKey: "register.citizen.title",
    badgeKey: "register.citizen.badge",
    badgeVariant: "default",
    descKey: "register.citizen.desc",
    featureKeys: [
      "register.citizen.features.0",
      "register.citizen.features.1",
      "register.citizen.features.2",
      "register.citizen.features.3",
    ],
    registerButtonKey: "register.citizen.registerButton",
    path: "/register/user",
    borderHover: "hover:border-primary/50",
  },
  {
    id: "ngo",
    icon: "🏢",
    titleKey: "register.ngo.title",
    badgeKey: "register.ngo.badge",
    badgeVariant: "secondary",
    descKey: "register.ngo.desc",
    featureKeys: [
      "register.ngo.features.0",
      "register.ngo.features.1",
      "register.ngo.features.2",
      "register.ngo.features.3",
    ],
    registerButtonKey: "register.ngo.registerButton",
    path: "/register/ngo",
    borderHover: "hover:border-secondary/50",
  },
  {
    id: "admin",
    icon: "🛡️",
    titleKey: "register.admin.title",
    badgeKey: "register.admin.badge",
    badgeVariant: "outline",
    descKey: "register.admin.desc",
    featureKeys: [
      "register.admin.features.0",
      "register.admin.features.1",
      "register.admin.features.2",
      "register.admin.features.3",
    ],
    registerButtonKey: "register.admin.registerButton",
    path: "/register/admin",
    borderHover: "hover:border-accent/50",
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-48 lg:w-[600px] lg:h-72 rounded-full opacity-[0.06] blur-3xl"
          style={{ background: "oklch(0.55 0.22 25)" }}
        />
        <div
          className="absolute bottom-10 right-10 w-48 h-48 lg:w-72 lg:h-72 rounded-full opacity-[0.04] blur-3xl hidden lg:block"
          style={{ background: "oklch(0.58 0.17 145)" }}
        />
      </div>

      <div className="relative flex flex-col flex-1 items-center px-4 py-8 lg:py-12">
        {/* Top bar */}
        <div className="w-full max-w-3xl lg:max-w-5xl mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate({ to: "/login" })}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="register.back_button"
          >
            <ArrowLeft size={16} />
            {t("register.backToLogin")}
          </button>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <div className="text-sm text-muted-foreground hidden sm:block">
              {t("register.alreadyRegistered")}{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
                data-ocid="register.login_link"
              >
                {t("register.signIn")}
              </Link>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
            {t("register.title", { appName: APP_NAME })}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-md lg:max-w-lg lg:text-base">
            {t("register.subtitle")}
          </p>
        </div>

        {/* Role cards */}
        <div className="w-full max-w-3xl lg:max-w-5xl grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-5 lg:gap-8">
          {ROLES.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => navigate({ to: card.path })}
              className={`group bg-card border border-border rounded-2xl p-6 lg:p-8 text-left flex flex-col gap-4 lg:gap-5 ${card.borderHover} hover:shadow-lg lg:hover:shadow-xl transition-smooth cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              data-ocid={`register.role_card.${card.id}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl lg:text-5xl">{card.icon}</span>
                <Badge variant={card.badgeVariant} className="text-xs">
                  {t(card.badgeKey)}
                </Badge>
              </div>

              <div>
                <h3 className="text-lg lg:text-xl font-display font-semibold text-foreground">
                  {t(card.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {t(card.descKey)}
                </p>
              </div>

              <ul className="flex flex-col gap-1.5 lg:gap-2 flex-1">
                {card.featureKeys.map((fk) => (
                  <li
                    key={fk}
                    className="flex items-start gap-2 text-xs lg:text-sm text-muted-foreground"
                  >
                    <CheckCircle2
                      size={13}
                      className="mt-0.5 shrink-0 text-secondary lg:w-4 lg:h-4"
                    />
                    <span>{t(fk)}</span>
                  </li>
                ))}
              </ul>

              <div className="w-full mt-auto flex items-center justify-center gap-1.5 rounded-md border border-border bg-transparent px-4 py-2 lg:py-2.5 text-sm font-medium group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-smooth pointer-events-none">
                {t(card.registerButtonKey)}
                <ArrowRight size={15} />
              </div>
            </button>
          ))}
        </div>

        {/* Mobile sign-in link */}
        <p className="mt-6 text-sm text-muted-foreground sm:hidden">
          {t("register.alreadyRegistered")}{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            {t("register.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
