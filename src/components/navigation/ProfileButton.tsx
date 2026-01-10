import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Clipboard, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/common/Toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import env from "@/env.ts"

interface ProfileButtonProps {
  /** 登出回调 */
  onLogout: () => void
  /** 额外的 CSS 类名 */
  className?: string
}

/**
 * ProfileButton - 用户资料按钮组件
 * 
 * 圆形头像按钮，点击展开下拉菜单：
 * - 显示用户 ID
 * - 复制配置
 * - 登出
 */
export function ProfileButton({ onLogout, className }: ProfileButtonProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  
  const currentUid = localStorage.getItem("uid")
  const username = localStorage.getItem("username")

  // 复制配置到剪贴板
  const handleCopyConfig = () => {
    const config = {
      api: env.API_URL,
      apiToken: localStorage.getItem("token") || "",
      vault: "defaultVault",
    }

    const configText = JSON.stringify(config, null, 2)

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(configText)
        .then(() => {
          toast.success(t("copyConfigSuccess"))
        })
        .catch((err) => {
          toast.error(t("error") + err)
        })
    } else {
      toast.error(t("error") + t("copyConfigError"))
    }
    setOpen(false)
  }

  // 处理登出
  const handleLogout = () => {
    setOpen(false)
    onLogout()
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "size-9 rounded-full bg-muted flex items-center justify-center",
            "transition-all duration-200",
            "ring-2 ring-ring/30",
            "hover:ring-ring/50",
            "focus-visible:outline-none focus-visible:ring-ring",
            open && "ring-ring",
            className
          )}
          aria-label={t("userUid", { uid: currentUid })}
        >
          <span className="text-sm font-medium text-muted-foreground">
            {username?.charAt(0)?.toUpperCase() || currentUid?.charAt(0)?.toUpperCase() || "U"}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 rounded-xl shadow-lg"
        sideOffset={8}
      >
        {/* 用户 ID 显示 */}
        <div className="px-3 py-2 text-xs text-muted-foreground border-b">
          {t("userUid", { uid: currentUid })}
        </div>
        
        {/* 复制配置 */}
        <DropdownMenuItem onClick={handleCopyConfig}>
          <Clipboard className="mr-2 size-4" />
          {t("copyConfig")}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* 登出 */}
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 size-4" />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
