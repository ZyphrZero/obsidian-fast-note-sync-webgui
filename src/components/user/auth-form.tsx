import { createLoginSchema, createRegisterSchema, type LoginFormData, type RegisterFormData } from "@/lib/validations/user-schema";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useAuth } from "@/components/api-handle/use-auth";
import { toast } from "@/components/common/Toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { User, Lock, Mail, KeyRound } from "lucide-react";
import { useState } from "react";

interface AuthFormProps {
  onSuccess: () => void
  registerIsEnable?: boolean
}

const SPRING_CONFIG = { type: "spring", stiffness: 300, damping: 30 } as const;

export function AuthForm({ onSuccess, registerIsEnable = true }: AuthFormProps) {
  const { t, i18n } = useTranslation()
  const { isLoading, login, registerUser } = useAuth()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')

  const loginSchema = createLoginSchema(t)
  const registerSchema = createRegisterSchema(t)

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSoft = () => {
    window.open("https://github.com/haierkeys/fast-note-sync-service", "_blank", "noopener,noreferrer")
  }

  const handleLoginSubmit = async (data: LoginFormData) => {
    const result = await login(data)
    if (result.success) {
      onSuccess()
    } else {
      toast.error(result.error!)
    }
  }

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    const result = await registerUser(data)
    if (result.success) {
      onSuccess()
    } else {
      toast.error(result.error!)
    }
  }

  const handleTabChange = (tab: 'login' | 'register') => {
    if (tab === 'register' && !registerIsEnable) {
      toast.info(t("registerClosed"))
      return
    }
    setActiveTab(tab)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen w-full flex items-center justify-center px-6 text-foreground"
    >
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <header className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">OS</span>
          </div>
          <h1 className="text-2xl font-bold">Obsidian Fast Note Sync</h1>
        </header>

        {/* Tab 切换 - 带滑动高亮 */}
        <div className="relative flex p-1 bg-muted rounded-2xl">
          {/* 滑动高亮背景 */}
          <motion.div
            className="absolute top-1 bottom-1 bg-background rounded-xl shadow-sm"
            initial={false}
            animate={{
              left: activeTab === 'login' ? '4px' : '50%',
              width: 'calc(50% - 4px)',
            }}
            transition={SPRING_CONFIG}
          />
          <button
            type="button"
            onClick={() => handleTabChange('login')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'login' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="w-4 h-4" />
            {t("login")}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('register')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'register' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            {t("register")}
          </button>
        </div>

        {/* 表单区域 */}
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === 'login' ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.2 }}
              onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
              className="space-y-6"
            >
                <div className="space-y-2">
                  <Label htmlFor="credentials" className="text-foreground/80 text-sm font-medium">
                    {t("credentials")}
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="credentials" 
                      placeholder={t("credentialsPlaceholder")} 
                      {...loginForm.register("credentials")}
                      className="h-12 pl-10 bg-muted/40 border border-border/50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all placeholder:text-muted-foreground/40"
                    />
                  </div>
                  <AnimatePresence mode="wait">
                    {loginForm.formState.errors.credentials && (
                      <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm text-destructive pl-1"
                      >
                        {loginForm.formState.errors.credentials.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground/80 text-sm font-medium">
                    {t("password")}
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder={t("passwordPlaceholder")} 
                      {...loginForm.register("password")}
                      className="h-12 pl-10 bg-muted/40 border border-border/50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all placeholder:text-muted-foreground/40"
                    />
                  </div>
                  <AnimatePresence mode="wait">
                    {loginForm.formState.errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm text-destructive pl-1"
                      >
                        {loginForm.formState.errors.password.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl font-medium" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                  ) : t("login")}
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.2 }}
                onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}
                className="space-y-5"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="reg-username" className="text-foreground/80 text-sm font-medium">{t("username")}</Label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="reg-username" 
                      placeholder={t("usernamePlaceholder")} 
                      {...registerForm.register("username")}
                      className="h-11 pl-10 bg-muted/40 border border-border/50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all placeholder:text-muted-foreground/40"
                    />
                  </div>
                  <AnimatePresence mode="wait">
                    {registerForm.formState.errors.username && (
                      <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm text-destructive pl-1"
                      >
                        {registerForm.formState.errors.username.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-email" className="text-foreground/80 text-sm font-medium">{t("email")}</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="reg-email" 
                      type="email" 
                      placeholder={t("emailPlaceholder")} 
                      {...registerForm.register("email")}
                      className="h-11 pl-10 bg-muted/40 border border-border/50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all placeholder:text-muted-foreground/40"
                    />
                  </div>
                  <AnimatePresence mode="wait">
                    {registerForm.formState.errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm text-destructive pl-1"
                      >
                        {registerForm.formState.errors.email.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-password" className="text-foreground/80 text-sm font-medium">{t("password")}</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="reg-password" 
                      type="password" 
                      placeholder={t("passwordPlaceholder")} 
                      {...registerForm.register("password")}
                      className="h-11 pl-10 bg-muted/40 border border-border/50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all placeholder:text-muted-foreground/40"
                    />
                  </div>
                  <AnimatePresence mode="wait">
                    {registerForm.formState.errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm text-destructive pl-1"
                      >
                        {registerForm.formState.errors.password.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-confirmPassword" className="text-foreground/80 text-sm font-medium">{t("confirmPassword")}</Label>
                  <div className="relative group">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="reg-confirmPassword" 
                      type="password" 
                      placeholder={t("confirmPasswordPlaceholder")} 
                      {...registerForm.register("confirmPassword")}
                      className="h-11 pl-10 bg-muted/40 border border-border/50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all placeholder:text-muted-foreground/40"
                    />
                  </div>
                  <AnimatePresence mode="wait">
                    {registerForm.formState.errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm text-destructive pl-1"
                      >
                        {registerForm.formState.errors.confirmPassword.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 rounded-xl font-medium" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                  ) : t("registerButton")}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

        {/* 底部 */}
        <footer className="flex flex-col items-center gap-3 pt-2">
          <p className="text-muted-foreground text-xs leading-relaxed text-center">
            {t("subtitlePrefix")}{" "}
            <a
              href="https://github.com/haierkeys/obsidian-fast-note-sync"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
            >
              {t("subtitlePluginName")}
            </a>
            {i18n.language === "zh-CN" && ` ${t("subtitleSuffix")}`}
          </p>
          <div className="flex items-center gap-3">
            <LanguageSwitcher 
              showText={true} 
              className="text-sm text-muted-foreground hover:text-foreground p-0 h-auto font-normal" 
            />
            <span className="text-border">|</span>
            <Button 
              variant="link" 
              onClick={onSoft} 
              type="button" 
              className="text-muted-foreground/60 hover:text-muted-foreground p-0 h-auto text-sm font-normal transition-colors"
            >
              GitHub
            </Button>
          </div>
        </footer>
      </div>
    </motion.div>
  )
}
