import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

import { useVaultHandle } from "@/components/api-handle/vault-handle"
import { useUserHandle } from "@/components/api-handle/user-handle"
import { useAuth } from "@/components/context/auth-context"
import { useAppStore } from "@/stores/app-store"

import { AppLayout } from "@/components/layout/AppLayout"
import { SystemSettings } from "@/components/layout/system-settings"
import { NoteManager } from "@/components/note/note-manager"
import { VaultList } from "@/components/vault/vault-list"
import { AuthForm } from "@/components/user/auth-form"
import { ComingSoon } from "@/components/common/ComingSoon"
import { toast } from "@/components/common/Toast"
import { ContextMenuProvider } from "@/components/ui/context-menu"

import env from "@/env.ts"

/**
 * App - 应用主组件
 * 
 * 使用新的 AppLayout 布局组件，保持原有功能：
 * - 认证逻辑
 * - 模块渲染
 * - 管理员权限检查
 * - Zen 模式支持
 * 
 * Requirements: 1.5, 10.1, 10.2, 10.3, 10.4, 10.5, 10.7
 */
function App() {
  const { t } = useTranslation()
  const { isLoggedIn, login, logout } = useAuth()
  const { handleVaultList } = useVaultHandle()
  const { handleUserInfo } = useUserHandle()
  
  // 使用 Zustand store 管理应用状态
  const { currentModule, setModule, zenMode, setZenMode, resetState } = useAppStore()

  // 本地状态
  const [activeVault, setActiveVault] = useState<string | null>(null)
  const [vaultsLoaded, setVaultsLoaded] = useState(false)
  const [registerIsEnable, setRegisterIsEnable] = useState(true)
  const [adminUid, setAdminUid] = useState<number | null>(null)

  // 计算当前用户是否为管理员
  const currentUid = localStorage.getItem("uid") ? parseInt(localStorage.getItem("uid")!) : null
  const isAdmin = adminUid !== null && currentUid !== null && (adminUid === 0 || adminUid === currentUid)

  // 验证用户登录状态
  useEffect(() => {
    if (isLoggedIn) {
      handleUserInfo(logout)
    }
  }, [isLoggedIn, handleUserInfo, logout])

  // 当切换到笔记页面时，从 API 获取仓库列表并验证当前仓库是否有效
  useEffect(() => {
    if ((currentModule === "notes" || currentModule === "trash") && isLoggedIn) {
      setVaultsLoaded(false)
      handleVaultList((vaults) => {
        if (vaults.length > 0) {
          // 检查当前 activeVault 是否存在于仓库列表中
          const vaultExists = activeVault && vaults.some(v => v.vault === activeVault)

          // 如果不存在或未设置，则设置为第一个仓库
          if (!vaultExists) {
            setActiveVault(vaults[0].vault)
          }
        }
        setVaultsLoaded(true)
      })
    }
  }, [currentModule, isLoggedIn, handleVaultList, activeVault])

  // 动态加载字体和配置
  useEffect(() => {
    let isMounted = true
    let currentFontUrl = ""

    const updateFonts = (fontUrl: string) => {
      if (currentFontUrl === fontUrl) return
      currentFontUrl = fontUrl

      // 移除旧的字体样式
      const oldLink = document.getElementById("dynamic-font-link")
      if (oldLink) oldLink.remove()

      // 支持远程 CSS 或服务端字体文件路径
      if (fontUrl && fontUrl.endsWith(".css")) {
        const link = document.createElement("link")
        link.id = "dynamic-font-link"
        link.rel = "stylesheet"
        // 服务端路径需要拼接 API_URL
        link.href = fontUrl.startsWith("/") ? `${env.API_URL.replace(/\/$/, "")}${fontUrl}` : fontUrl
        link.crossOrigin = "anonymous"
        document.head.appendChild(link)
      }
    }

    const fetchConfig = async () => {
      try {
        const apiUrl = env.API_URL.endsWith("/") ? env.API_URL.slice(0, -1) : env.API_URL
        const response = await fetch(`${apiUrl}/api/webgui/config`)
        if (response.ok && isMounted) {
          const res = await response.json()
          if (res.code > 0 && res.data) {
            updateFonts(res.data.fontSet || res.data.FontSet || "")
            if (res.data.registerIsEnable !== undefined) {
              setRegisterIsEnable(res.data.registerIsEnable)
            }
            if (res.data.adminUid !== undefined) {
              setAdminUid(res.data.adminUid)
            }
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch webgui config:", error)
        }
      }
    }

    fetchConfig()

    return () => {
      isMounted = false
    }
  }, [])

  // 处理认证成功
  const handleAuthSuccess = () => {
    login()
  }

  // 处理登出
  const handleLogout = () => {
    // 清除认证状态
    logout()
    // 重置应用状态
    resetState()
  }

  // 处理 Zen 模式切换
  const handleToggleZenMode = () => {
    setZenMode(!zenMode)
  }

  // 未登录时显示登录/注册页面
  if (!isLoggedIn) {
    return (
      <ContextMenuProvider>
        <div className="w-full min-h-screen">
          <AuthForm onSuccess={handleAuthSuccess} registerIsEnable={registerIsEnable} />
        </div>
      </ContextMenuProvider>
    )
  }

  // 渲染当前模块内容
  const renderModuleContent = () => {
    switch (currentModule) {
      case "notes":
        // 等待 vault 加载完成
        if (!vaultsLoaded || !activeVault) {
          return (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )
        }
        return (
          <NoteManager
            key="notes"
            vault={activeVault}
            onVaultChange={setActiveVault}
            onNavigateToVaults={() => setModule("vaults")}
            isMaximized={zenMode}
            onToggleMaximize={handleToggleZenMode}
          />
        )
      
      case "trash":
        // 等待 vault 加载完成
        if (!vaultsLoaded || !activeVault) {
          return (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )
        }
        return (
          <NoteManager
            key="trash"
            vault={activeVault}
            onVaultChange={setActiveVault}
            onNavigateToVaults={() => setModule("vaults")}
            isMaximized={zenMode}
            onToggleMaximize={handleToggleZenMode}
            isRecycle={true}
          />
        )
      
      case "settings":
        // 非管理员访问设置页面时显示提示并跳转
        if (!isAdmin) {
          toast.warning(t("onlyAdminAccess"))
          setModule("vaults")
          return null
        }
        return (
          <SystemSettings onBack={() => setModule("vaults")} />
        )
      
      case "sync":
        return (
          <ComingSoon 
            title={t("menuSync") || "远端备份"} 
            description={t("syncComingSoon") || "远端备份功能正在开发中，将支持 S3、OSS、WebDAV 等多种存储后端。"}
          />
        )
      
      case "git":
        return (
          <ComingSoon 
            title={t("menuGit") || "Git 自动化"} 
            description={t("gitComingSoon") || "Git 自动化功能正在开发中，将支持自动提交、推送和版本管理。"}
          />
        )
      
      case "vaults":
      default:
        return (
          <VaultList
            onNavigateToNotes={(vaultName) => {
              setActiveVault(vaultName)
              setModule("notes")
            }}
          />
        )
    }
  }

  return (
    <ContextMenuProvider>
      <AppLayout isAdmin={isAdmin} onLogout={handleLogout}>
        {renderModuleContent()}
      </AppLayout>
    </ContextMenuProvider>
  )
}

export default App
