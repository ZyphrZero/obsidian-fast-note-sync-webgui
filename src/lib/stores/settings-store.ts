import { persist } from 'zustand/middleware';
import { create } from 'zustand';


export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type ColorScheme =
  | 'green'      // 默认绿色
  | 'blue'       // 蓝色 #2563EB
  | 'sky-blue'   // 天蓝色 #9fc2e2
  | 'purple'     // 紫色
  | 'orange'     // 橙色
  | 'rose'       // 玫瑰色
  | 'teal';      // 青色

export const COLOR_SCHEMES: { value: ColorScheme; label: string; color: string }[] = [
  { value: 'green', label: 'colorScheme.green', color: '#4ade80' },
  { value: 'blue', label: 'colorScheme.blue', color: '#2563EB' },
  { value: 'sky-blue', label: 'colorScheme.skyBlue', color: '#9fc2e2' },
  { value: 'purple', label: 'colorScheme.purple', color: '#a78bfa' },
  { value: 'orange', label: 'colorScheme.orange', color: '#fb923c' },
  { value: 'rose', label: 'colorScheme.rose', color: '#fb7185' },
  { value: 'teal', label: 'colorScheme.teal', color: '#2dd4bf' },
];

interface SettingsState {
  toastPosition: ToastPosition;
  setToastPosition: (position: ToastPosition) => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      toastPosition: 'top-center',
      setToastPosition: (position) => set({ toastPosition: position }),
      colorScheme: 'green',
      setColorScheme: (scheme) => {
        // 更新 HTML 的 data-color-scheme 属性
        document.documentElement.setAttribute('data-color-scheme', scheme);
        set({ colorScheme: scheme });
      },
    }),
    {
      name: 'app-settings',
      onRehydrateStorage: () => (state) => {
        // 恢复时应用配色方案
        if (state?.colorScheme) {
          document.documentElement.setAttribute('data-color-scheme', state.colorScheme);
        }
      },
    }
  )
);
