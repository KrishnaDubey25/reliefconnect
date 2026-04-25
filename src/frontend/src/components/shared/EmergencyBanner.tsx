import { Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_NAME, EMERGENCY_HOTLINE } from "../../constants";

export function EmergencyBanner() {
  const { t } = useTranslation();
  return (
    <div
      className="w-full bg-accent/10 border-b border-accent/20 px-4 py-1.5 flex items-center justify-between gap-3 text-xs"
      data-ocid="emergency_banner"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="h-2 w-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
        <span className="font-semibold text-accent truncate font-display">
          {APP_NAME}
        </span>
        <span className="text-muted-foreground hidden sm:inline">
          {t("app.tagline")}
        </span>
      </div>
      <a
        href={`tel:${EMERGENCY_HOTLINE}`}
        className="flex items-center gap-1.5 text-accent font-semibold whitespace-nowrap hover:text-accent/80 transition-colors"
        data-ocid="emergency_banner.hotline_link"
        aria-label={`${t("shared.emergency.banner")} ${EMERGENCY_HOTLINE}`}
      >
        <Phone size={12} />
        <span className="hidden xs:inline">{t("shared.emergency.banner")}</span>
        {EMERGENCY_HOTLINE}
      </a>
    </div>
  );
}
