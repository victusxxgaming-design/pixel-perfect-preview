import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutGrid, Package, Receipt, KeyRound, Download, UserCog, LifeBuoy, Copy, ArrowRight, MessageCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Shell, ProductArt, Status, Field, inputCls } from "@/components/site";
import { Button } from "@/components/ui/button";
import { ORDERS, getProduct, fakeKey, money } from "@/lib/data";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  head: () => seo("My account", "Your Vantix dashboard: purchases, orders, keys and downloads."),
  component: Account,
});

const TABS = [
  ["overview", "Overview", LayoutGrid], ["products", "Purchased products", Package], ["orders", "Order history", Receipt],
  ["keys", "Activation keys", KeyRound], ["downloads", "Downloads", Download], ["profile", "Profile", UserCog], ["support", "Support", LifeBuoy],
] as const;
type Tab = (typeof TABS)[number][0];

function Account() {
  const [tab, setTab] = useState<Tab>("overview");
  const [empty, setEmpty] = useState(false);
  const orders = empty ? [] : ORDERS;
  const owned = orders.filter((o) => o.payment === "paid").flatMap((o) => o.items.map((s) => ({ p: getProduct(s)!, o })));

  return (
    <Shell>
      <div className="container-x py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="eyebrow">Dashboard</p><h1 className="mt-2 text-3xl font-semibold">Hey, Alex</h1></div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" checked={empty} onChange={(e) => setEmpty(e.target.checked)} className="accent-primary" />Preview new-customer state</label>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {TABS.map(([id, label, Icon]) => (
              <button key={id} onClick={() => setTab(id)} className={cn("flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition", tab === id ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-surface")}>
                <Icon className="h-4 w-4" />{label}
              </button>
            ))}
          </nav>
          <div className="min-w-0">
            {orders.length === 0 && ["overview", "products", "orders", "keys", "downloads"].includes(tab) ? <Empty /> : (
              <>
                {tab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                      {[["Products owned", owned.length], ["Active keys", orders.filter((o) => o.key === "active").length], ["Total spent", money(orders.filter((o) => o.payment === "paid").reduce((s, o) => s + o.total, 0))]].map(([k, v]) => (
                        <div key={k} className="surface p-5"><p className="text-sm text-muted-foreground">{k}</p><p className="mt-2 font-display text-3xl font-semibold">{v}</p></div>
                      ))}
                    </div>
                    <OrdersTable orders={orders.slice(0, 3)} />
                  </div>
                )}
                {tab === "products" && <div className="grid gap-4 sm:grid-cols-2">{owned.map(({ p, o }) => (
                  <div key={p.slug + o.id} className="surface flex items-center gap-4 p-4"><ProductArt p={p} className="h-16 w-20 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1"><p className="font-medium truncate">{p.name}</p><p className="text-xs text-muted-foreground">v{p.version} · {o.date}</p></div><Status s={o.key} /></div>
                ))}</div>}
                {tab === "orders" && <OrdersTable orders={orders} />}
                {tab === "keys" && <Keys orders={orders} />}
                {tab === "downloads" && <div className="surface divide-y">{owned.map(({ p, o }) => (
                  <div key={p.slug + o.id} className="flex items-center gap-4 p-4"><div className="min-w-0 flex-1"><p className="font-medium">{p.name}</p><p className="text-xs text-muted-foreground font-mono">v{p.version} · latest</p></div>
                    <Button size="sm" variant={o.key === "active" ? "hero" : "outline"} disabled={o.key !== "active"} onClick={() => toast("Download started (demo)")}><Download />{o.key === "active" ? "Download" : "Expired"}</Button></div>
                ))}</div>}
              </>
            )}
            {tab === "profile" && (
              <div className="surface p-6 max-w-xl space-y-4">
                <h2 className="font-semibold">Account information</h2>
                <Field label="Display name"><input className={inputCls} defaultValue="Alex Rivera" /></Field>
                <Field label="Email"><input className={inputCls} defaultValue="alex@example.com" /></Field>
                <Field label="Discord"><input className={inputCls} defaultValue="alexr" /></Field>
                <Field label="New password"><input type="password" className={inputCls} placeholder="Leave blank to keep current" /></Field>
                <Button variant="hero" onClick={() => toast.success("Profile saved")}>Save changes</Button>
              </div>
            )}
            {tab === "support" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="surface p-6"><LifeBuoy className="h-6 w-6 text-primary-glow" /><h3 className="mt-4 font-semibold">Open a ticket</h3><p className="mt-1 text-sm text-muted-foreground">Average first reply: 2 hours.</p><Button className="mt-5" variant="outline" asChild><Link to="/contact">New ticket</Link></Button></div>
                <div className="surface p-6"><MessageCircle className="h-6 w-6 text-primary-glow" /><h3 className="mt-4 font-semibold">Discord support</h3><p className="mt-1 text-sm text-muted-foreground">Live help in #support, 7 days a week.</p><Button className="mt-5" variant="hero">Join Discord</Button></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Empty() {
  return (
    <div className="surface grid place-items-center py-20 text-center">
      <Package className="h-10 w-10 text-muted-foreground" />
      <h2 className="mt-4 text-lg font-semibold">No purchases yet</h2>
      <p className="mt-1 text-sm text-muted-foreground">Your products, keys and downloads will live here.</p>
      <Button variant="hero" className="mt-6" asChild><Link to="/store">Explore the store</Link></Button>
    </div>
  );
}

function OrdersTable({ orders }: { orders: readonly (typeof ORDERS)[number][] }) {
  return (
    <div className="surface overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-xs text-muted-foreground"><tr className="border-b">{["Order", "Date", "Items", "Total", "Payment", "Key", ""].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
        <tbody className="divide-y">{orders.map((o) => (
          <tr key={o.id} className="hover:bg-surface-2">
            <td className="px-4 py-3 font-mono">{o.id}</td><td className="px-4 py-3 text-muted-foreground">{o.date}</td>
            <td className="px-4 py-3 max-w-48 truncate">{o.items.map((s) => getProduct(s)!.name).join(", ")}</td><td className="px-4 py-3">{money(o.total)}</td>
            <td className="px-4 py-3"><Status s={o.payment} /></td><td className="px-4 py-3"><Status s={o.key} /></td>
            <td className="px-4 py-3"><Link to="/order/$id" params={{ id: o.id }} search={{ state: o.key === "active" ? "success" : o.payment === "failed" ? "failed" : (o.key as "pending" | "expired") }} className="text-primary-glow"><ArrowRight className="h-4 w-4" /></Link></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

function Keys({ orders }: { orders: readonly (typeof ORDERS)[number][] }) {
  const [shown, setShown] = useState<string | null>(null);
  return (
    <div className="space-y-3">{orders.map((o) => { const k = fakeKey(o.id); const ok = o.key === "active"; return (
      <div key={o.id} className="surface flex flex-wrap items-center gap-4 p-4">
        <div className="min-w-0 flex-1"><p className="font-medium">{getProduct(o.items[0])!.name}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{ok ? (shown === o.id ? k : k.replace(/[A-Z0-9]/g, "•").replace(/^•{4}/, "DEMO")) : "—"}</p></div>
        <Status s={o.key} />
        {ok && <><Button size="icon" variant="ghost" aria-label="Reveal" onClick={() => setShown(shown === o.id ? null : o.id)}>{shown === o.id ? <EyeOff /> : <Eye />}</Button>
          <Button size="sm" variant="outline" onClick={() => { navigator.clipboard?.writeText(k).catch(() => {}); toast.success("Key copied"); }}><Copy />Copy</Button></>}
      </div>
    ); })}</div>
  );
}
