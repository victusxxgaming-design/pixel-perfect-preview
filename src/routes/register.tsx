import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "@/components/auth-layout";
import { Field, inputCls } from "@/components/site";
import { Button } from "@/components/ui/button";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/register")({
  head: () => seo("Create account", "Create a Vantix account to manage purchases, keys and downloads."),
  component: Register,
});

function Register() {
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", pw: "", pw2: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const x: Record<string, string> = {};
    if (!f.name.trim()) x.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = "Enter a valid email address";
    if (f.pw.length < 8) x.pw = "Use at least 8 characters";
    if (f.pw !== f.pw2) x.pw2 = "Passwords don't match";
    setErr(x);
    if (!Object.keys(x).length) nav({ to: "/account" });
  };
  return (
    <AuthLayout title="Create your account" sub="Takes less than a minute.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Display name" error={err.name}><input aria-invalid={!!err.name} className={inputCls} value={f.name} onChange={set("name")} /></Field>
        <Field label="Email" error={err.email}><input aria-invalid={!!err.email} className={inputCls} value={f.email} onChange={set("email")} /></Field>
        <Field label="Password" error={err.pw}><input type="password" aria-invalid={!!err.pw} className={inputCls} value={f.pw} onChange={set("pw")} /></Field>
        <Field label="Confirm password" error={err.pw2}><input type="password" aria-invalid={!!err.pw2} className={inputCls} value={f.pw2} onChange={set("pw2")} /></Field>
        <Button variant="hero" size="lg" className="w-full">Create account</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="text-primary-glow hover:underline">Sign in</Link></p>
    </AuthLayout>
  );
}
