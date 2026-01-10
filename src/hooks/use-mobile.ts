import { useState, useEffect } from 'react';

/** Tailwind md 断点 (768px) */
const MD_BREAKPOINT = 768;

/**
 * 移动端检测 Hook
 * 
 * 检测视口宽度是否小于 md 断点 (768px)
 * 监听 resize 事件实时更新
 * 
 * @param breakpoint - 自定义断点，默认 768px (Tailwind md)
 * @returns 是否为移动端视口
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isMobile = useMobile();
 *   return isMobile ? <MobileNav /> : <DesktopNav />;
 * }
 * ```
 */
export function useMobile(breakpoint: number = MD_BREAKPOINT): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // SSR 安全检查
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // 初始检查
    checkMobile();

    // 监听 resize 事件
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [breakpoint]);

  return isMobile;
}

// 默认导出
export default useMobile;
