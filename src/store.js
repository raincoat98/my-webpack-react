import create from 'zustand';

export const useStore = create((set) => ({
  count: 0,
  message: 'Hello from Zustand!',

  incrementCount: () => set((state) => ({ count: state.count + 1 })),
  decrementCount: () => set((state) => ({ count: state.count - 1 })),
  setMessage: (msg) => set({ message: msg }),
  resetCount: () => set({ count: 0 }),
}));
