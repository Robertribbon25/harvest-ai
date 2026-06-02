import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Leaf,
  ScanLine,
  MessageCircle,
  CloudSun,
  TrendingUp,
  Tractor,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-farm.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriCoop — AI-Powered Smart Agriculture for African Farmers" },
      {
        name: "description",
        content:
          "AI farming assistant, crop disease detection, yield predictions, weather alerts, market prices, mobile money and USSD — built for cooperatives, agronomists and smallholder farmers.",
      },
      { property: "og:title", content: "AgriCoop — Smart Agriculture AI Platform" },
      { property: "og:description", content: "Empowering African farmers with AI, computer vision, and mobile-first tools." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: MessageCircle, title: "AI Agriculture Chatbot", desc: "Ask farming questions in English or Kinyarwanda and get expert answers powered by RAG and LLMs." },
  { icon: ScanLine, title: "Crop Disease Scanner", desc: "Snap a leaf photo. Computer vision detects diseases with confidence scores and treatment plans." },
  { icon: TrendingUp, title: "Yield & Price Forecasting", desc: "Predict harvests and market prices using ML models trained on historical and weather data." },
  { icon: CloudSun, title: "Weather Intelligence", desc: "Hyper-local rain alerts, irrigation guidance, and seasonal recommendations." },
  { icon: Tractor, title: "Cooperative Management", desc: "Register farmers, track production, manage payments and inventory in one dashboard." },
  { icon: Smartphone, title: "USSD + Mobile Money", desc: "Feature-phone farmers dial *182*7# to check prices, weather, and receive MoMo payments." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg">AgriCoop</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Sign in</Button></Link>
            <Link to="/signup"><Button className="bg-white text-primary hover:bg-white/90">Get started</Button></Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="African farmland at golden hour" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-sm border border-white/20 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered for Africa
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              The intelligent platform for <span className="text-accent">modern farmers</span>.
            </h1>
            <p className="mt-6 text-lg text-white/85 max-w-xl">
              AgriCoop unites cooperatives, agronomists and smallholder farmers with AI crop diagnosis,
              yield prediction, weather alerts, USSD access and mobile money — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
                  Start free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  Sign in
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/70">
              <div><span className="text-white font-semibold text-2xl">12k+</span><div>Farmers onboarded</div></div>
              <div><span className="text-white font-semibold text-2xl">94%</span><div>Disease detection accuracy</div></div>
              <div><span className="text-white font-semibold text-2xl">3</span><div>Languages supported</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <h2 className="text-4xl font-bold tracking-tight">Everything farmers and cooperatives need.</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From AI-driven crop diagnostics to mobile-money payouts, AgriCoop is the operating system for modern agriculture.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-2xl border bg-card p-6 transition-all hover:shadow-[var(--shadow-elegant)] hover:-translate-y-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl p-12 md:p-16 text-center text-white" style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Grow smarter, harvest more.</h2>
          <p className="mt-4 text-lg text-white/85 max-w-2xl mx-auto">
            Join cooperatives across the continent already using AgriCoop to feed the future.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">Create your account</Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} AgriCoop. Built with AI for African agriculture.
      </footer>
    </div>
  );
}
