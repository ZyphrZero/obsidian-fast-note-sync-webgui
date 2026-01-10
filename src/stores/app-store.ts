import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 模块 ID 类型
 * - vaults: 仓库管理
 * - notes: 笔记管理
 * - trash: 回收站
 * - settings: 设置（仅管理员）
 * - sync: 远端备份（计划中）
 * - git: Git 自动化（计划中）
 */
export type ModuleId = 'vaults' | 'notes' | 'trash' | 'settings' | 'sync' | 'git';

/**
 * 应用状态接口
 */
interface AppState {
  /** 当前激活的模块 */
  currentModule: ModuleId;
  /** Zen 模式（专注模式，隐藏导航栏） */
  zenMode: boolean;
  /** 用户菜单是否打开 */
  userMenuOpen: boolean;

  // Actions
  /** 设置当前模块 */
  setModule: (module: ModuleId) => void;
  /** 切换 Zen 模式 */
  toggleZenMode: () => void;
  /** 设置 Zen 模式 */
  setZenMode: (enabled: boolean) => void;
  /** 切换用户菜单 */
  toggleUserMenu: () => void;
  /** 设置用户菜单状态 */
  setUserMenuOpen: (open: boolean) => void;
  /** 重置应用状态（用于登出） */
  resetState: () => void;
}

/** 默认状态 */
const defaultState = {
  currentModule: 'vaults' as ModuleId,
  zenMode: false,
  userMenuOpen: false,
};

/**
 * 应用状态 Store
 * 
 * 使用 Zustand + persist 中间件管理应用状态
 * - currentModule 持久化到 localStorage
 * - zenMode 和 userMenuOpen 不持久化（每次刷新重置）
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...defaultState,

      setModule: (module) => set({ currentModule: module }),

      toggleZenMode: () => set((state) => ({ zenMode: !state.zenMode })),

      setZenMode: (enabled) => set({ zenMode: enabled }),

      toggleUserMenu: () => set((state) => ({ userMenuOpen: !state.userMenuOpen })),

      setUserMenuOpen: (open) => set({ userMenuOpen: open }),

      resetState: () => {
        // 重置内存状态
        set(defaultState);
        // 清除 localStorage 中的持久化数据
        localStorage.removeItem('app-storage');
      },
    }),
    {
      name: 'app-storage',
      // 只持久化 currentModule，其他状态每次刷新重置
      partialize: (state) => ({ currentModule: state.currentModule }),
    }
  )
);

// 导出类型供外部使用
export type { AppState };
