import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setUser: (user, token) => set({ user, token, isAuthenticated: !!token }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
  updateUser: (user) => set({ user }),
}));

export const usePortfolioStore = create((set) => ({
  balance: 0,
  transactions: [],

  setBalance: (balance) => set({ balance }),
  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions],
  })),
}));

export const useProductStore = create((set) => ({
  products: [],
  categories: [],
  selectedProduct: null,

  setProducts: (products) => set({ products }),
  setCategories: (categories) => set({ categories }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
}));
