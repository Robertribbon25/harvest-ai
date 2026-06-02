import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/market")({
  head: () => ({ meta: [{ title: "Market Prices — AgriCoop" }] }),
  component: () => <AppShell><MarketPage /></AppShell>,
});

const data = [
  { m: "Jan", maize: 420, beans: 950, potato: 380 },
  { m: "Feb", maize: 450, beans: 970, potato: 400 },
  { m: "Mar", maize: 480, beans: 1020, potato: 420 },
  { m: "Apr", maize: 460, beans: 1080, potato: 410 },
  { m: "May", maize: 510, beans: 1100, potato: 450 },
  { m: "Jun", maize: 540, beans: 1150, potato: 470 },
  { m: "Jul", maize: 580, beans: 1200, potato: 490 },
  { m: "Aug", maize: 610, beans: 1180, potato: 520 },
];

const crops = [
  { name: "Maize", price: 610, change: +5.2, unit: "RWF/kg" },
  { name: "Beans", price: 1180, change: -1.7, unit: "RWF/kg" },
  { name: "Potato", price: 520, change: +6.1, unit: "RWF/kg" },
  { name: "Rice", price: 1450, change: +2.3, unit: "RWF/kg" },
  { name: "Coffee (cherry)", price: 850, change: +12.4, unit: "RWF/kg" },
  { name: "Cassava", price: 320, change: -0.8, unit: "RWF/kg" },
];

function MarketPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Market Prices</h1>
        <p className="text-muted-foreground mt-1">AI-forecasted prices and selling recommendations.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {crops.map((c) => (
          <div key={c.name} className="rounded-2xl border bg-card p-5">
            <div className="text-sm text-muted-foreground">{c.name}</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold">{c.price}</span>
              <span className="text-xs text-muted-foreground">{c.unit}</span>
            </div>
            <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${c.change >= 0 ? "text-success" : "text-destructive"}`}>
              {c.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {c.change > 0 ? "+" : ""}{c.change}%
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <h3 className="font-semibold mb-1">Price trends (8-month)</h3>
        <p className="text-sm text-muted-foreground mb-4">Forecast powered by LSTM time-series models</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="m" />
              <YAxis />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="maize" stroke="var(--primary)" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" dataKey="potato" stroke="var(--accent)" fill="url(#g2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <h3 className="font-semibold mb-2">💡 Smart selling advice</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• <strong className="text-foreground">Coffee:</strong> Prices up 12.4% — strong moment to sell green cherry.</li>
          <li>• <strong className="text-foreground">Maize:</strong> Forecasted to peak in 3 weeks. Consider holding if storage allows.</li>
          <li>• <strong className="text-foreground">Beans:</strong> Slight dip; demand expected to recover next month.</li>
        </ul>
      </div>
    </div>
  );
}
