import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LayoutDashboard, Package, Layers, Tags, Receipt, ShieldCheck, KeyRound, Users, TicketPercent, BarChart3, Settings, Search, Plus, Upload, Pencil, ArrowUpRight, Ban, ExternalLink, Menu } from "lucide-react";
import { toast } from "sonner";
import { Logo, Status, Pill, Field, inputCls, platformIcon } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PRODUCTS, PLATFORMS, platformLabel, money, fakeKey, type Product } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Vantix" }, { name: "description", content: "Vantix store administration prototype." }, { property: "og:title", content: "Admin — Vantix" }, { property: "og:description", content: "Store administration prototype." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

const NAV = [
  ["overview", "Overview", LayoutDashboard], ["products", "Products", Package], ["versions", "Versions", Layers], ["categories", "Platforms", Tags],
  ["orders", "Orders", Receipt], ["payments", "Payments", ShieldCheck], ["keys", "Key inventory", KeyRound], ["customers", "Customers", Users],
  ["coupons", "Coupons", TicketPercent], ["analytics", "Analytics", BarChart3], ["settings", "Settings", Settings],
] as const;
type Sec = (typeof NAV)[number][0];

const ORDERS = Array.from({ length: 10 }).map((_, i) => {
  const p = PRODUCTS[i % PRODUCTS.length];
  const pay = (["paid", "paid", "pending", "paid", "failed", "paid", "refunded", "paid", "pending", "paid"] as const)[i];
  return { id: `VX-${20520 - i * 13}`, customer: ["alex@example.com", "mira@mail.io", "kenji@web.jp", "sofia@mail.br", "dev@ops.in"][i % 5], product: p, total: p.price, pay, method: ["Card", "UPI", "PayPal", "Crypto"][i % 4], date: `Oct ${17 - i}, 2026` };
});
const KEYS = Array.from({ length: 10 }).map((_, i) => ({ key: fakeKey("k" + i), product: PRODUCTS[i % 4], status: (["active", "unassigned", "active", "expired", "unassigned", "revoked", "active", "unassigned", "active", "expired"] as const)[i], order: i % 3 === 1 ? "—" : `VX-${20500 - i * 7}`, expires: `Oct ${10 + i}, 2027` }));

function Admin() {
  const [sec, setSec] = useState<Sec>("overview");
  const [mobile, setMobile] = useState(false);
  return (
    <div className="flex min-h-screen">
      <aside className={cn("fixed inset-y-0 left-0 z-40 w-64 border-r bg-sidebar p-4 transition-transform lg:static lg:translate-x-0", mobile ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center gap-2 px-2"><Logo /><Pill tone="primary">Admin</Pill></div>
        <nav className="mt-8 space-y-0.5">
          {NAV.map(([id, label, Icon]) => (
            <button key={id} onClick={() => { setSec(id); setMobile(false); }} className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition", sec === id ? "bg-sidebar-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60")}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </nav>
        <Link to="/" className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs text-muted-foreground hover:text-foreground"><ExternalLink className="h-3.5 w-3.5" />View storefront</Link>
      </aside>
      {mobile && <div className="fixed inset-0 z-30 bg-background/70 lg:hidden" onClick={() => setMobile(false)} />}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobile(true)}><Menu /></Button>
          <h1 className="text-lg font-semibold">{NAV.find((n) => n[0] === sec)![1]}</h1>
          <div className="ml-auto flex items-center gap-3"><span className="hidden sm:block text-xs text-muted-foreground">Prototype · sample data</span><span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">VA</span></div>
        </header>
        <main className="p-6">
          {sec === "overview" && <Overview go={setSec} />}
          {sec === "products" && <Products />}
          {sec === "versions" && <Versions />}
          {sec === "categories" && <Categories />}
          {sec === "orders" && <OrdersSec />}
          {sec === "payments" && <Payments />}
          {sec === "keys" && <Keys />}
          {sec === "customers" && <Customers />}
          {sec === "coupons" && <Coupons />}
          {sec === "analytics" && <Analytics />}
          {sec === "settings" && <SettingsSec />}
        </main>
      </div>
    </div>
  );
}

const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => <div className={cn("surface p-5", className)}>{children}</div>;
function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return <div className="surface overflow-x-auto"><table className="w-full text-sm"><thead className="text-left text-xs text-muted-foreground"><tr className="border-b">{head.map((h) => <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">{h}</th>)}</tr></thead><tbody className="divide-y [&_td]:px-4 [&_td]:py-3 [&_tr:hover]:bg-surface-2">{children}</tbody></table></div>;
}
function Stat({ k, v, d }: { k: string; v: string; d: string }) {
  return <Card><p className="text-sm text-muted-foreground">{k}</p><p className="mt-2 font-display text-3xl font-semibold">{v}</p><p className="mt-1 flex items-center gap-1 text-xs text-success"><ArrowUpRight className="h-3 w-3" />{d}</p></Card>;
}
const SALES = [42, 55, 48, 70, 66, 82, 74, 91, 88, 104, 97, 120, 112, 134];
function Bars() {
  const max = Math.max(...SALES);
  return <div className="flex h-48 items-end gap-2">{SALES.map((s, i) => <div key={i} className="flex-1 rounded-t-md bg-gradient-primary opacity-80 transition hover:opacity-100" style={{ height: `${(s / max) * 100}%` }} title={`$${s * 10}`} />)}</div>;
}

function Overview({ go }: { go: (s: Sec) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat k="Revenue (30d)" v="$18,420" d="+12.4%" /><Stat k="Orders" v="1,284" d="+8.1%" /><Stat k="Customers" v="24,310" d="+3.2%" /><Stat k="Active products" v={String(PRODUCTS.length)} d="+2 this month" /></div>
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card><div className="flex justify-between mb-6"><h2 className="font-semibold">Sales · last 14 days</h2><Pill tone="success">+18%</Pill></div><Bars /></Card>
        <Card><h2 className="font-semibold mb-4">Needs attention</h2><ul className="space-y-3 text-sm">
          <li className="flex justify-between"><span>Pending payments</span><Status s="pending" /></li>
          <li className="flex justify-between"><span>Low key inventory · Prism Vault</span><Status s="low" /></li>
          <li className="flex justify-between"><span>Out of stock · Halo Kit</span><Status s="out" /></li>
        </ul><Button variant="outline" size="sm" className="mt-6" onClick={() => go("payments")}>Review payments</Button></Card>
      </div>
      <h2 className="font-semibold">Recent orders</h2><OrdersSec limit={5} />
    </div>
  );
}

function Products() {
  const [q, setQ] = useState(""); const [pl, setPl] = useState("all"); const [edit, setEdit] = useState<Product | "new" | null>(null);
  const list = useMemo(() => PRODUCTS.filter((p) => (pl === "all" || p.platform === pl) && p.name.toLowerCase().includes(q.toLowerCase())), [q, pl]);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-56"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input className={cn(inputCls, "pl-9")} placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select className={cn(inputCls, "w-40")} value={pl} onChange={(e) => setPl(e.target.value)}><option value="all">All platforms</option>{PLATFORMS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</select>
        <Button variant="hero" className="h-11" onClick={() => setEdit("new")}><Plus />Add product</Button>
      </div>
      <Table head={["Product", "Platform", "Price", "Current version", "Stock", "Sales", ""]}>
        {list.map((p) => { const I = platformIcon(p.platform); return (
          <tr key={p.slug}><td className="font-medium">{p.name}</td><td><span className="flex items-center gap-1.5 text-muted-foreground"><I className="h-3.5 w-3.5" />{platformLabel(p.platform)}</span></td><td>{money(p.price)}</td>
            <td><span className="flex items-center gap-2 font-mono text-xs">v{p.version}<Status s="current" /></span></td><td><Status s={p.stock} /></td><td>{p.sales.toLocaleString()}</td>
            <td><Button size="icon" variant="ghost" onClick={() => setEdit(p)} aria-label="Edit"><Pencil /></Button></td></tr>
        ); })}
      </Table>
      <ProductDialog p={edit} onClose={() => setEdit(null)} />
    </div>
  );
}

function ProductDialog({ p, onClose }: { p: Product | "new" | null; onClose: () => void }) {
  const prod = p && p !== "new" ? p : undefined;
  return (
    <Dialog open={!!p} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl bg-popover">
        <DialogHeader><DialogTitle>{prod ? `Edit ${prod.name}` : "Add product"}</DialogTitle></DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Field label="Name"><input className={inputCls} defaultValue={prod?.name} /></Field></div>
          <Field label="Price (USD)"><input className={inputCls} defaultValue={prod?.price} /></Field>
          <Field label="Platform"><select className={inputCls} defaultValue={prod?.platform}>{PLATFORMS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select></Field>
          <div className="sm:col-span-2"><Field label="Description"><textarea className={cn(inputCls, "h-20 py-2")} defaultValue={prod?.tagline} /></Field></div>
          {["Product images", "Download file (.zip, .apk, .ipa)"].map((t) => (
            <button key={t} onClick={() => toast("Upload dialog (demo)")} className="grid place-items-center gap-2 rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground">
              <Upload className="h-5 w-5" />{t}<span>Drag & drop or browse</span></button>
          ))}
        </div>
        <DialogFooter><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="hero" onClick={() => { toast.success("Product saved"); onClose(); }}>Save product</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Versions() {
  const [sel, setSel] = useState(PRODUCTS[0].slug); const p = PRODUCTS.find((x) => x.slug === sel)!;
  const [maj, min, pat] = p.version.split(".").map(Number);
  const vers = [{ v: p.version, s: "current", d: p.released, n: p.notes }, { v: `${maj}.${min}.${Math.max(0, pat - 1)}`, s: "archived", d: "Sep 2, 2026", n: ["Stability fixes"] }, { v: `${maj}.${Math.max(0, min - 1)}.0`, s: "archived", d: "Jul 18, 2026", n: ["Major layout update"] }];
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        <select className={cn(inputCls, "max-w-xs")} value={sel} onChange={(e) => setSel(e.target.value)}>{PRODUCTS.map((x) => <option key={x.slug} value={x.slug}>{x.name}</option>)}</select>
        {vers.map((v) => (
          <Card key={v.v} className={v.s === "current" ? "border-primary/40" : "opacity-75"}>
            <div className="flex items-center gap-3"><span className="font-mono">v{v.v}</span><Status s={v.s} /><span className="ml-auto text-xs text-muted-foreground">{v.d}</span></div>
            <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground">{v.n.map((n) => <li key={n}>{n}</li>)}</ul>
            {v.s !== "current" && <p className="mt-3 text-xs text-muted-foreground">Hidden from customers · not downloadable</p>}
          </Card>
        ))}
      </div>
      <Card className="h-fit space-y-4"><h2 className="font-semibold">Publish new version</h2>
        <Field label="Version"><input className={inputCls} placeholder={`${maj}.${min}.${pat + 1}`} /></Field>
        <Field label="Release notes"><textarea className={cn(inputCls, "h-24 py-2")} /></Field>
        <button onClick={() => toast("Upload dialog (demo)")} className="w-full grid place-items-center gap-1 rounded-xl border border-dashed p-5 text-xs text-muted-foreground hover:border-primary/50"><Upload className="h-4 w-4" />Upload build</button>
        <Button variant="hero" className="w-full" onClick={() => toast.success("Version published — set as current")}>Publish as current</Button></Card>
    </div>
  );
}

function Categories() {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{PLATFORMS.map((p) => { const I = platformIcon(p.id); return (
    <Card key={p.id}><I className="h-6 w-6 text-primary-glow" /><p className="mt-6 font-semibold">{p.label}</p><p className="text-sm text-muted-foreground">{p.blurb}</p>
      <div className="mt-4 flex items-center justify-between"><Pill>{PRODUCTS.filter((x) => x.platform === p.id).length} products</Pill><Button size="sm" variant="ghost"><Pencil />Edit</Button></div></Card>
  ); })}<button className="surface grid place-items-center gap-2 border-dashed p-5 text-sm text-muted-foreground hover:text-foreground"><Plus />New category</button></div>;
}

function OrdersSec({ limit }: { limit?: number }) {
  const [f, setF] = useState("all");
  const list = ORDERS.filter((o) => f === "all" || o.pay === f).slice(0, limit);
  return (
    <div className="space-y-4">
      {!limit && <div className="flex flex-wrap gap-2">{["all", "paid", "pending", "failed", "refunded"].map((s) => <Button key={s} size="sm" variant={f === s ? "secondary" : "outline"} className="capitalize" onClick={() => setF(s)}>{s}</Button>)}</div>}
      <Table head={["Order", "Customer", "Product", "Total", "Method", "Payment", "Date"]}>
        {list.map((o) => <tr key={o.id}><td className="font-mono">{o.id}</td><td className="text-muted-foreground">{o.customer}</td><td>{o.product.name}</td><td>{money(o.total)}</td><td>{o.method}</td><td><Status s={o.pay} /></td><td className="text-muted-foreground whitespace-nowrap">{o.date}</td></tr>)}
      </Table>
    </div>
  );
}

function Payments() {
  const pending = ORDERS.filter((o) => o.pay === "pending" || o.pay === "failed");
  const [done, setDone] = useState<Record<string, string>>({});
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">{[["paid", "Verified", 7], ["pending", "Awaiting", 2], ["failed", "Failed", 1], ["refunded", "Refunded", 1]].map(([s, l, n]) => <Card key={s as string}><Status s={s as string} /><p className="mt-3 font-display text-2xl font-semibold">{n}</p><p className="text-xs text-muted-foreground">{l as string}</p></Card>)}</div>
      <div className="space-y-3">{pending.map((o) => (
        <Card key={o.id} className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1"><p className="font-mono text-sm">{o.id} · {o.method}</p><p className="text-xs text-muted-foreground">{o.customer} · {money(o.total)}</p></div>
          <Status s={done[o.id] ?? o.pay} />
          <Button size="sm" variant="outline" onClick={() => setDone({ ...done, [o.id]: "failed" })}><Ban />Reject</Button>
          <Button size="sm" variant="hero" onClick={() => { setDone({ ...done, [o.id]: "paid" }); toast.success(`${o.id} verified · key assigned`); }}><ShieldCheck />Verify</Button>
        </Card>
      ))}</div>
    </div>
  );
}

function Keys() {
  const [st, setSt] = useState<Record<number, string>>({});
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3"><Button variant="hero" onClick={() => toast("Bulk import (demo)")}><Upload />Import keys</Button><div className="ml-auto flex gap-2">{["active", "unassigned", "expired", "revoked"].map((s) => <Status key={s} s={s} />)}</div></div>
      <Table head={["Key", "Product", "Order", "Expires", "Status", ""]}>
        {KEYS.map((k, i) => { const s = st[i] ?? k.status; return (
          <tr key={i}><td className="font-mono text-xs">{k.key}</td><td>{k.product.name}</td><td className="font-mono text-xs text-muted-foreground">{s === "unassigned" ? "—" : k.order}</td><td className="text-muted-foreground whitespace-nowrap">{k.expires}</td><td><Status s={s} /></td>
            <td className="whitespace-nowrap">{s === "unassigned" && <Button size="sm" variant="outline" onClick={() => setSt({ ...st, [i]: "active" })}>Assign</Button>}{s === "active" && <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setSt({ ...st, [i]: "revoked" })}>Revoke</Button>}</td></tr>
        ); })}
      </Table>
    </div>
  );
}

function Customers() {
  return <Table head={["Customer", "Email", "Orders", "Spent", "Joined", "Status"]}>
    {[["Alex Rivera", "alex@example.com", 5, 63.9, "Mar 2025"], ["Mira Chen", "mira@mail.io", 3, 41.5, "Jun 2025"], ["Kenji Sato", "kenji@web.jp", 8, 112.4, "Jan 2025"], ["Sofia Lima", "sofia@mail.br", 1, 9.99, "Oct 2026"], ["Dev Patel", "dev@ops.in", 2, 24.98, "Aug 2026"]].map(([n, e, o, s, j]) => (
      <tr key={e as string}><td className="font-medium">{n}</td><td className="text-muted-foreground">{e}</td><td>{o}</td><td>{money(s as number)}</td><td className="text-muted-foreground">{j}</td><td><Status s="active" /></td></tr>
    ))}
  </Table>;
}

function Coupons() {
  return <div className="space-y-4"><Button variant="hero" onClick={() => toast("New coupon (demo)")}><Plus />Create coupon</Button>
    <Table head={["Code", "Discount", "Uses", "Expires", "Status"]}>
      {[["VANTIX10", "10%", "412 / ∞", "Dec 31, 2026", "active"], ["DROP25", "25%", "200 / 200", "Oct 1, 2026", "expired"], ["WELCOME5", "$5.00", "88 / 500", "—", "active"]].map(([c, d, u, e, s]) => <tr key={c}><td className="font-mono">{c}</td><td>{d}</td><td>{u}</td><td className="text-muted-foreground">{e}</td><td><Status s={s} /></td></tr>)}
    </Table></div>;
}

function Analytics() {
  return <div className="grid gap-6 xl:grid-cols-2">
    <Card><h2 className="font-semibold mb-6">Revenue trend</h2><Bars /></Card>
    <Card><h2 className="font-semibold mb-4">Top products</h2><ul className="space-y-4">{[...PRODUCTS].sort((a, b) => b.sales - a.sales).slice(0, 5).map((p) => (
      <li key={p.slug}><div className="flex justify-between text-sm"><span>{p.name}</span><span className="text-muted-foreground">{p.sales.toLocaleString()}</span></div><div className="mt-1.5 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-gradient-primary" style={{ width: `${(p.sales / 5410) * 100}%` }} /></div></li>
    ))}</ul></Card>
    <Card><h2 className="font-semibold mb-4">Sales by platform</h2><div className="grid grid-cols-4 gap-3 text-center">{PLATFORMS.map((p) => <div key={p.id}><p className="font-display text-2xl font-semibold">{Math.round(PRODUCTS.filter((x) => x.platform === p.id).reduce((s, x) => s + x.sales, 0) / 280)}%</p><p className="text-xs text-muted-foreground">{p.label}</p></div>)}</div></Card>
  </div>;
}

function SettingsSec() {
  return <div className="grid gap-6 xl:grid-cols-2">
    <Card className="space-y-4"><h2 className="font-semibold">Store settings</h2><Field label="Store name"><input className={inputCls} defaultValue="Vantix" /></Field><Field label="Currency"><select className={inputCls}><option>USD</option><option>INR</option><option>BRL</option></select></Field><Field label="Tax / fee rate (%)"><input className={inputCls} defaultValue="5" /></Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" />Maintenance mode</label><Button variant="hero" onClick={() => toast.success("Settings saved")}>Save</Button></Card>
    <Card className="space-y-4"><h2 className="font-semibold">Support settings</h2><Field label="Support email"><input className={inputCls} defaultValue="support@vantix.example" /></Field><Field label="Discord invite URL"><input className={inputCls} defaultValue="https://discord.gg/vantix-demo" /></Field><Field label="Auto-reply message"><textarea className={cn(inputCls, "h-24 py-2")} defaultValue="Thanks for reaching out — we'll reply within a few hours." /></Field><Button variant="hero" onClick={() => toast.success("Settings saved")}>Save</Button></Card>
  </div>;
}
