import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { STORAGE_KEY } from "../../i18n";

interface LanguageOption {
  code: string;
  nativeName: string;
  englishName: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "en", nativeName: "English", englishName: "English" },
  { code: "hi", nativeName: "हिन्दी", englishName: "Hindi" },
  { code: "bn", nativeName: "বাংলা", englishName: "Bengali" },
  { code: "te", nativeName: "తెలుగు", englishName: "Telugu" },
  { code: "mr", nativeName: "मराठी", englishName: "Marathi" },
  { code: "ta", nativeName: "தமிழ்", englishName: "Tamil" },
  { code: "ur", nativeName: "اردو", englishName: "Urdu" },
  { code: "gu", nativeName: "ગુજરાતી", englishName: "Gujarati" },
  { code: "kn", nativeName: "ಕನ್ನಡ", englishName: "Kannada" },
  { code: "ml", nativeName: "മലയാളം", englishName: "Malayalam" },
  { code: "or", nativeName: "ଓଡ଼ିଆ", englishName: "Odia" },
  { code: "pa", nativeName: "ਪੰਜਾਬੀ", englishName: "Punjabi" },
  { code: "as", nativeName: "অসমীয়া", englishName: "Assamese" },
  { code: "mai", nativeName: "मैथिली", englishName: "Maithili" },
  { code: "sa", nativeName: "संस्कृतम्", englishName: "Sanskrit" },
  { code: "kok", nativeName: "कोंकणी", englishName: "Konkani" },
  { code: "ne", nativeName: "नेपाली", englishName: "Nepali" },
  { code: "sd", nativeName: "سنڌي", englishName: "Sindhi" },
  { code: "doi", nativeName: "डोगरी", englishName: "Dogri" },
  { code: "ks", nativeName: "کٲشُر", englishName: "Kashmiri" },
  { code: "brx", nativeName: "बर'", englishName: "Bodo" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n } = useTranslation();
  const currentLang =
    LANGUAGES.find((l) => l.code === i18n.language) ||
    LANGUAGES.find((l) => l.code === "en")!;

  function handleChange(code: string) {
    i18n.changeLanguage(code);
    localStorage.setItem(STORAGE_KEY, code);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`gap-1.5 h-7 px-2 text-xs text-muted-foreground hover:text-foreground ${className ?? ""}`}
          aria-label="Select language"
          data-ocid="lang.switcher_button"
        >
          <Globe size={13} />
          <span className="max-w-[60px] truncate font-normal">
            {currentLang.nativeName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-72 overflow-y-auto w-52"
        data-ocid="lang.dropdown_menu"
      >
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={`flex items-center justify-between gap-2 text-xs cursor-pointer ${
              i18n.language === lang.code
                ? "bg-primary/10 text-primary font-medium"
                : ""
            }`}
            data-ocid={`lang.option.${lang.code}`}
          >
            <span className="font-medium">{lang.nativeName}</span>
            <span className="text-muted-foreground text-[10px] shrink-0">
              {lang.englishName}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
