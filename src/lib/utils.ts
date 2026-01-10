import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 计算递减延迟时间，用于 PageWrapper 动画
 * 使用对数函数确保延迟收敛，避免大量元素时动画时间过长
 * 
 * @param index - 子元素的索引（从 0 开始）
 * @returns 延迟时间（秒），最大不超过 0.4 秒
 * 
 * @example
 * getDiminishingDelay(0) // 0
 * getDiminishingDelay(1) // 0.08
 * getDiminishingDelay(3) // 0.16
 * getDiminishingDelay(7) // 0.24
 */
export function getDiminishingDelay(index: number): number {
  if (index <= 0) return 0
  return Math.min(0.08 * Math.log2(index + 1), 0.4)
}
