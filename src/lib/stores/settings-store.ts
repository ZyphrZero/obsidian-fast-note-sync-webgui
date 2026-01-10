import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ToastPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

interface SettingsState {
  toastPosition: ToastPosition;
  setToastPosition: (position: ToastPosition) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      toastPosition: 'top-center',
      setToastPosition: (position) => set({ toastPosition: position }),
    }),
    {
      name: 'app-settings',
    }
  )
);
