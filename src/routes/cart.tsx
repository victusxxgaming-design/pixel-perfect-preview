import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Shell, ProductArt, Pill } from "@/components/site";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { getProduct, money, platformLabel } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/cart")({
  head: () => seo("Your Cart", "Review the addons in your Vantix cart before checkout."),
  component: Cart,
});

export const FEE_RATE = 0.05;

function Cart() {
  const { items, remove, subtotal } = useCart();
  const fee = subtotal * FEE_RATE;
  return (
    <Shell>
      <div className="container-x py-12">
        <h1 className="text-3xl md:text-4xl font-semibold">Cart</h1>
        {items.length === 0 ? (
          <div className="surface mt-8 grid place-items-center py-24 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold">Your cart is empty</h2>
            <p className="mt-1 text-sm text-muted-foreground">Find something great in the store.</p>
            <Button variant="hero" className="mt-6" asChild><Link to="/store">Browse store</Link></Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            <ul className="surface divide-y">
              {items.map((s) => { const p = getProduct(s)!; return (
                <li key={s} className="flex items-center gap-4 p-5">
                  <ProductArt p={p} className="h-20 w-24 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <Link to="/product/$slug" params={{ slug: s }} className="font-medium hover:underline truncate block">{p.name}</Link>
                    <div className="mt-1 flex gap-2"><Pill>{platformLabel(p.platform)}</Pill><Pill tone="primary">v{p.version}</Pill></div>
                  </div>
                  <span className="font-display font-semibold">{money(p.price)}</span>
                  <Button variant="ghost" size="icon" aria-label="Remove" onClick={() => remove(s)}><Trash2 /></Button>
                </li>
              ); })}
            </ul>
            <Summary subtotal={subtotal} fee={fee}>
              <Button variant="hero" size="lg" className="w-full" asChild><Link to="/checkout">Checkout <ArrowRight /></Link></Button>
            </Summary>
          </div>
        )}
      </div>
    </Shell>
  );
}

export function Summary({ subtotal, fee, discount = 0, children }: { subtotal: number; fee: number; discount?: number; children?: React.ReactNode }) {
  return (
    <aside className="surface p-6 h-fit space-y-4 lg:sticky lg:top-24">
      <h2 className="font-semibold">Order summary</h2>
      <dl className="space-y-2 text-sm">
        <Row k="Subtotal" v={money(subtotal)} />
        {discount > 0 && <Row k="Discount" v={`−${money(discount)}`} accent />}
        <Row k="Taxes & fees (5%)" v={money(fee)} />
        <div className="border-t pt-3 flex justify-between font-display text-lg font-semibold"><dt>Total</dt><dd>{money(Math.max(0, subtotal - discount + fee))}</dd></div>
      </dl>
      {children}
    </aside>
  );
}
function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return <div className="flex justify-between"><dt className="text-muted-foreground">{k}</dt><dd className={accent ? "text-success" : ""}>{v}</dd></div>;
}
