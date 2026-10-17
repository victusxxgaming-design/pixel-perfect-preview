import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getProduct } from "./data";

type CartCtx = {
  items: string[];
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  subtotal: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => {
    try { const s = localStorage.getItem("vx-cart"); if (s) setItems(JSON.parse(s)); } catch { /* ignore */ }
  }, []);
  useEffect(() => { localStorage.setItem("vx-cart", JSON.stringify(items)); }, [items]);
  const subtotal = items.reduce((s, x) => s + (getProduct(x)?.price ?? 0), 0);
  return (
    <Ctx.Provider value={{
      items,
      add: (slug) => setItems((i) => (i.includes(slug) ? i : [...i, slug])),
      remove: (slug) => setItems((i) => i.filter((x) => x !== slug)),
      clear: () => setItems([]),
      subtotal,
    }}>{children}</Ctx.Provider>
  );
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside provider");
  return c;
};
