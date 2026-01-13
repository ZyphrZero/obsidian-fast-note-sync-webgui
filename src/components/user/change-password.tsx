import { toast } from "@/components/common/Toast"
import { addCacheBuster } from "@/lib/utils/cache-buster"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import env from "@/env.ts"

export function ChangePassword({ close }: { close: () => void }) {
  const { t } = useTranslation()
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error(t("passwordMismatch"))
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("oldPassword", oldPassword)
      formData.append("password", newPassword)
      formData.append("confirmPassword", confirmPassword)

      const response = await fetch(addCacheBuster(env.API_URL + "/api/user/change_password"), {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (data.status === true) {
        toast.success(data.message || t("passwordChangedSuccess"))
        close()
      } else {
        toast.error(data.details || data.message || t("passwordChangeFailed"))
      }
    } catch {
      toast.error(t("passwordChangeFailed"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="oldPassword">{t("currentPassword")}</Label>
        <Input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">{t("newPassword")}</Label>
        <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t("confirmNewPassword")}</Label>
        <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={close}>
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("submitting") : t("changePassword")}
        </Button>
      </div>
    </form>
  )
}
