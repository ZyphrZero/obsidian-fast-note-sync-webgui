import React from "react"
import ReactDOM from "react-dom/client"

import { AuthProvider } from "./components/context/auth-context"
import { ConfirmDialogProvider } from "@/components/context/confirm-dialog-context"
import { ThemeProvider } from "@/components/context/theme-context"
import { Toaster } from "@/components/ui/sonner"
import App from "./App"
import "@/lib/i18n/translations"
import "@/app/globals.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <ConfirmDialogProvider>
          <App />
          <Toaster />
        </ConfirmDialogProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
