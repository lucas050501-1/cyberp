import { create } from 'zustand';
import { Cart } from '../types';

interface CartState {
  cart: Cart | null;
  setCart: (cart: Cart | null) => void;
  getItemCount: () => number;
  getItemQuantity: (productId: string) => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  setCart: (cart) => set({ cart }),
  getItemCount: () => {
    const { cart } = get();
    return cart?.items.reduce((count, item) => count + item.quantity, 0) ?? 0;
  },
  getItemQuantity: (productId: string) => {
    const { cart } = get();
    const item = cart?.items.find(item => item.productId === productId);
    return item?.quantity ?? 0;
  },
}));

export const useCart = () => useCartStore();