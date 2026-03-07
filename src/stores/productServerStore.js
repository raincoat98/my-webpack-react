import { create } from 'zustand';

export const useProductServerStore = create((set) => ({
  refreshKey: 0,
  refresh: () => set({ refreshKey: Date.now() }),
}));
