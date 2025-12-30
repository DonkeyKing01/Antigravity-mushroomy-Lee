import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./button";

export function ThemeSwitcher() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="w-9 h-9 opacity-50 cursor-not-allowed">
                <Sun className="h-4 w-4" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="w-9 h-9 rounded-full border border-border bg-background/50 backdrop-blur-sm hover:bg-foreground/10 transition-colors"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
            {theme === "light" ? (
                <Sun className="h-4 w-4 text-[hsl(var(--aurora-gold))]" />
            ) : (
                <Moon className="h-4 w-4 text-[hsl(var(--aurora-cyan))]" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
