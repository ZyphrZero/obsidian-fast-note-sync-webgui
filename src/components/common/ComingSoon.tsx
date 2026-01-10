import { useTranslation } from "react-i18next"
import { Construction } from "lucide-react"

interface ComingSoonProps {
  title: string
  description?: string
}

/**
 * ComingSoon - 功能开发中占位页面
 */
export function ComingSoon({ title, description }: ComingSoonProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="rounded-full bg-muted p-6 mb-6">
        <Construction className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground text-center max-w-md">
        {description || t("comingSoonDescription") || "此功能正在开发中，敬请期待..."}
      </p>
    </div>
  )
}
