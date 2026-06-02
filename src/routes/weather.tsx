import { createFileRoute } from "@tanstack/react-router";
import { CloudSun, Cloud, CloudRain, Sun, Droplets, Wind, ThermometerSun } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/weather")({
  head: () => ({ meta: [{ title: "Weather — AgriCoop" }] }),
  component: () => <AppShell><WeatherPage /></AppShell>,
});

const forecast = [
  { day: "Today", icon: CloudSun, temp: 26, rain: 10 },
  { day: "Tue", icon: CloudRain, temp: 22, rain: 70 },
  { day: "Wed", icon: CloudRain, temp: 21, rain: 80 },
  { day: "Thu", icon: Cloud, temp: 23, rain: 30 },
  { day: "Fri", icon: Sun, temp: 27, rain: 5 },
  { day: "Sat", icon: Sun, temp: 28, rain: 0 },
  { day: "Sun", icon: CloudSun, temp: 26, rain: 15 },
];

function WeatherPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Weather Intelligence</h1>
        <p className="text-muted-foreground mt-1">Hyper-local forecasts and irrigation guidance for your farms.</p>
      </div>

      <div className="rounded-3xl p-8 text-white" style={{ background: "var(--gradient-hero)" }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="text-sm opacity-80">Musanze, Rwanda</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-6xl font-bold">26°</span>
              <span className="text-xl opacity-80">Partly cloudy</span>
            </div>
            <div className="text-sm opacity-80 mt-2">Feels like 28° • UV index 6</div>
          </div>
          <CloudSun className="h-28 w-28 opacity-90" />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/20">
          <div className="flex items-center gap-2"><Droplets className="h-5 w-5" /><div><div className="text-xs opacity-80">Humidity</div><div className="font-semibold">68%</div></div></div>
          <div className="flex items-center gap-2"><Wind className="h-5 w-5" /><div><div className="text-xs opacity-80">Wind</div><div className="font-semibold">12 km/h</div></div></div>
          <div className="flex items-center gap-2"><ThermometerSun className="h-5 w-5" /><div><div className="text-xs opacity-80">Pressure</div><div className="font-semibold">1014 hPa</div></div></div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
        {forecast.map((d) => {
          const I = d.icon;
          return (
            <div key={d.day} className="rounded-2xl border bg-card p-4 text-center">
              <div className="text-sm font-medium text-muted-foreground">{d.day}</div>
              <I className="h-8 w-8 mx-auto my-2 text-primary" />
              <div className="font-bold">{d.temp}°</div>
              <div className="text-xs text-chart-3 mt-1">💧 {d.rain}%</div>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold mb-2">Irrigation recommendation</h3>
          <p className="text-sm text-muted-foreground">Heavy rain expected Tue–Wed (150mm). Skip irrigation for the next 48 hours to avoid waterlogging.</p>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold mb-2">Seasonal advisory</h3>
          <p className="text-sm text-muted-foreground">Conditions favorable for maize tasseling. Apply nitrogen top-dressing after Wednesday's rain.</p>
        </div>
      </div>
    </div>
  );
}
