import type { CSSProperties } from "react"
import {
    CircleCheckIcon,
    CircleXIcon,
    InfoIcon,
    LoaderCircleIcon,
    TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            icons={{
                success: <CircleCheckIcon className="size-4" />,
                info: <InfoIcon className="size-4" />,
                warning: <TriangleAlertIcon className="size-4" />,
                error: <CircleXIcon className="size-4" />,
                loading: <LoaderCircleIcon className="size-4 animate-spin" />,
            }}
            style={
                {
                    "--normal-bg": "hsl(var(--popover))",
                    "--normal-text": "hsl(var(--popover-foreground))",
                    "--normal-border": "hsl(var(--border))",
                    "--border-radius": "var(--radius)",
                } as CSSProperties
            }
            {...props}
        />
    )
}

export { Toaster }
