import type { ReactNode } from "react";
import { Logo } from "@/components/site";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero.jpg";

export function AuthLayout({ title, sub, children, discord = true }: { title: string; sub: string; children: ReactNode; discord?: boolean }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block overflow-hidden border-r">
        <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="eyebrow">Vantix</p>
          <p className="mt-3 font-display text-3xl font-semibold max-w-sm">Your keys, downloads and updates — in one place.</p>
        </div>
      </div>
      <div className="flex flex-col px-6 py-8">
        <Logo />
        <div className="m-auto w-full max-w-sm py-12">
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{sub}</p>
          {discord && (
            <>
              <Button variant="outline" size="lg" className="mt-8 w-full">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M20 4.5A18 18 0 0 0 15.6 3l-.6 1.2a16 16 0 0 0-6 0L8.4 3A18 18 0 0 0 4 4.5C1.3 8.6.6 12.6 1 16.5A18 18 0 0 0 6.4 19l1.1-1.8c-.6-.2-1.2-.5-1.7-.9l.4-.3a12.8 12.8 0 0 0 11.6 0l.4.3c-.5.4-1.1.7-1.7.9l1.1 1.8a18 18 0 0 0 5.4-2.5c.5-4.5-.7-8.5-3-12ZM8.7 14.2c-1 0-1.9-1-1.9-2.2s.8-2.2 1.9-2.2 1.9 1 1.9 2.2-.8 2.2-1.9 2.2Zm6.6 0c-1 0-1.9-1-1.9-2.2s.8-2.2 1.9-2.2 1.9 1 1.9 2.2-.8 2.2-1.9 2.2Z" /></svg>
                Continue with Discord
              </Button>
              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
            </>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
