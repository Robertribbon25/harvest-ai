import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Sprout, Tractor, ScanLine, CloudSun, TrendingUp, MessageCircle, Droplets, ThermometerSun } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { AppShell } from "@/components/app-shell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — AgriCoop" }] }),
  component: () => <AppShell><Dashboard /></AppShell>,
});

const yieldData = [
  { m: "Jan", v: 1.2 }, { m: "Feb", v: 1.4 }, { m: "Mar", v: 1.8 }, { m: "Apr", v: 2.1 },
  { m: "May", v: 2.4 }, { m: "Jun", v: 2.2 }, { m: "Jul", v: 2.8 }, { m: "Aug", v: 3.1 },
];

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [farms, crops, scans] = await Promise.all([
        supabase.from("farms").select("id", { count: "exact", head: true }),
        supabase.from("crops").select("id", { count: "exact", head: true }),
        supabase.from("disease_scans").select("id", { count: "exact", head: true }),
      ]);
      return {
        farms: farms.count ?? 0,
        crops: crops.count ?? 0,
        scans: scans.count ?? 0,
      };
    },
  });

  const cards = [
    { label: "Farms", value: stats?.farms ?? 0, icon: Tractor, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Crops", value: stats?.crops ?? 0, icon: Sprout, color: "text-success", bg: "bg-success/10" },
    { label: "Disease Scans", value: stats?.scans ?? 0, icon: ScanLine, color: "text-warning", bg: "bg-warning/10" },
    { label: "Yield (tons)", value: "8.4", icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
  ];

  const quickActions = [
    { to: "/chat" as const, label: "Ask AI", icon: MessageCircle },
    { to: "/scanner" as const, label: "Scan a leaf", icon: ScanLine },
    { to: "/weather" as const, label: "Weather", icon: CloudSun },
    { to: "/market" as const, label: "Market", icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back 🌱</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening on your farms today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const I = c.icon;
          return (
            <div key={c.label} className="rounded-2xl border bg-card p-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg} ${c.color} mb-3`}><I className="h-5 w-5" /></div>
              <div className="text-2xl font-bold">{c.value}</div>
              <div className="text-sm text-muted-foreground">{c.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Predicted yield trend</h3>
              <p className="text-sm text-muted-foreground">Tons per hectare, ML forecast</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yieldData}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="m" stroke="currentColor" className="text-muted-foreground text-xs" />
                <YAxis stroke="currentColor" className="text-muted-foreground text-xs" />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={3} dot={{ r: 5, fill: "var(--primary)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold mb-4">Today's conditions</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ThermometerSun className="h-8 w-8 text-accent" />
              <div><div className="text-2xl font-bold">26°C</div><div className="text-xs text-muted-foreground">Partly cloudy</div></div>
            </div>
            <div className="flex items-center gap-3">
              <Droplets className="h-8 w-8 text-chart-3" />
              <div><div className="text-2xl font-bold">68%</div><div className="text-xs text-muted-foreground">Humidity</div></div>
            </div>
            <div className="rounded-xl bg-primary/10 p-3 text-sm text-foreground">
              💧 Light rain expected tomorrow. Hold off on irrigation.
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Quick actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((a) => {
            const I = a.icon;
            return (
              <Link key={a.to} to={a.to} className="rounded-2xl border bg-card p-5 flex items-center gap-3 hover:shadow-md hover:border-primary/40 transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><I className="h-5 w-5" /></div>
                <div className="font-medium">{a.label}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
