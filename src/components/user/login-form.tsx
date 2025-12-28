import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { createLoginSchema, type LoginFormData } from "@/lib/validations/user-schema";
import { useConfirmDialog } from "@/components/context/confirm-dialog-context";
import { useAuth } from "@/components/api-handle/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { changeLang } from "@/lib/i18n/utils";
import { useForm } from "react-hook-form";
import { Languages } from "lucide-react";


interface LoginFormProps {
  onSuccess: () => void
  onRegister: () => void
}

export function LoginForm({ onSuccess, onRegister }: LoginFormProps) {
  const { t, i18n } = useTranslation()

  //登录相关
  const { isLoading, login } = useAuth()

  //消息提示
  const { openConfirmDialog } = useConfirmDialog()

  //表单验证
  const loginSchema = createLoginSchema(t)

  // prettier-ignore
  const { handleSubmit, register, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSoft = () => {
    window.open("https://github.com/haierkeys/fast-note-sync-service", "_blank", "noopener,noreferrer")
  }

  //登录处理
  const handleLoginSubmit = async (data: LoginFormData) => {
    const result = await login(data)
    if (result.success) {
      onSuccess()
    } else {
      openConfirmDialog(result.error!)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-5 space-y-4 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-sm font-medium hover:bg-slate-100 transition-colors">
              <Languages className="mr-2 h-4 w-4" />
              {t("switchLanguage")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto">
            <DropdownMenuItem onClick={() => changeLang("en")}>
              🇺🇸 English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("zh")}>
              🇨🇳 简体中文
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("zh-TW")}>
              🇹🇼 繁體中文
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("ja")}>
              🇯🇵 日本語
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("ko")}>
              🇰🇷 한국어
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("fr")}>
              🇫🇷 Français
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("de")}>
              🇩🇪 Deutsch
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("es")}>
              🇪🇸 Español
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("it")}>
              🇮🇹 Italiano
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("pt")}>
              🇵🇹 Português
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("pt-BR")}>
              🇧🇷 Português (Brasil)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("ru")}>
              🇷🇺 Русский
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("uk")}>
              🇺🇦 Українська
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("be")}>
              🇧🇾 Беларуская
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("nl")}>
              🇳🇱 Nederlands
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("pl")}>
              🇵🇱 Polski
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("da")}>
              🇩🇰 Dansk
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("no")}>
              🇳🇴 Norsk
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("tr")}>
              🇹🇷 Türkçe
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("vi")}>
              🇻🇳 Tiếng Việt
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("th")}>
              🇹🇭 ไทย
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("hi")}>
              🇮🇳 हिन्दी
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("id")}>
              🇮🇩 Indonesia
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("ms")}>
              🇲🇾 Bahasa Melayu
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("ro")}>
              🇷🇴 Română
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("ca")}>
              🇦🇩 Català
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("hu")}>
              🇭🇺 Magyar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("ar")}>
              🇸🇦 العربية
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("he")}>
              🇮🇱 עברית
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("ne")}>
              🇳🇵 नेपाली
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLang("sq")}>
              🇦🇱 Shqip
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        <div className="text-gray-500">
          <Button variant="link" onClick={onSoft} type="button" className="text-gray-500 p-0 pr-2">
            Obsidian Fast Note Sync Service
          </Button>
          <p className="text-gray-400 text-xs italic ">
            {t("subtitlePrefix")}{" "}
            <a
              href="https://github.com/haierkeys/obsidian-fast-note-sync"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              {t("subtitlePluginName")}
            </a>
            {i18n.language === "zh" && ` ${t("subtitleSuffix")}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleLoginSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="credentials">{t("credentials")}</Label>
          <Input id="credentials" placeholder={t("credentialsPlaceholder")} {...register("credentials")} />
          {errors.credentials && <p className="text-sm text-red-500">{errors.credentials.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>
          <Input id="password" type="password" placeholder={t("passwordPlaceholder")} {...register("password")} />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("loading") : t("login")}
        </Button>

        <div className="text-center mt-4">
          <Button variant="link" onClick={onRegister} type="button">
            {t("noAccount")} {t("register")}
          </Button>
        </div>
      </form>

      <div className="absolute bottom-4 "></div>
    </div>
  )
}
