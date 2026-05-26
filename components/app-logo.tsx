import Image from "next/image"
import { cn } from "@/lib/utils"

interface AppLogoProps {
  subtitle?: string
  showSubtitle?: boolean
  className?: string
  priority?: boolean
}

export function AppLogo({
  subtitle,
  showSubtitle = true,
  className,
  priority = false,
}: AppLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/logo.png"
        alt="LongLife Logo"
        width={200}
        height={48}
        className="h-10 w-auto object-contain"
        priority={priority}
      />
      {showSubtitle && subtitle && (
        <div className="hidden sm:block">
          <p className="text-sm text-muted-foreground leading-tight">{subtitle}</p>
        </div>
      )}
    </div>
  )
}
