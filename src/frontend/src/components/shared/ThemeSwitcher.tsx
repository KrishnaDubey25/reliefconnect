import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  function toggle() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label={
        resolvedTheme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      className={`h-7 w-7 p-0 text-muted-foreground hover:text-foreground transition-colors duration-200 ${className ?? ""}`}
      data-ocid="theme.toggle_button"
    >
      {resolvedTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
    </Button>
  );
}
