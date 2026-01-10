import { useTranslation } from "react-i18next"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/context/theme-context"
import { LanguageSwitcher } from "./language-switcher"

interface ActionGroupProps {
  /** 额外的 CSS 类名 */
  className?: string
}

/**
 * ActionGroup - 操作按钮组
 * 
 * 包含常用操作按钮：
 * - 主题切换 (sun/moon icon)
 * - 语言切换 (languages icon)
 * - 使用 ghost variant 按钮
 * - 统一的 gap-1 间距
 */
export function ActionGroup({ className }: ActionGroupProps) {
  const { t } = useTranslation()
  const { resolvedTheme, setTheme } = useTheme()

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="size-9"
        onClick={handleThemeToggle}
        aria-label={t("toggleTheme")}
      >
        {resolvedTheme === "dark" ? (
          <Sun className="size-5" />
        ) : (
          <Moon className="size-5" />
        )}
      </Button>

      {/* Language Switcher */}
      <LanguageSwitcher className="size-9" />
    </div>
  )
}
