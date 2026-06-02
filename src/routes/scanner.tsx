import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ScanLine, Upload, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/scanner")({
  head: () => ({ meta: [{ title: "Disease Scanner — AgriCoop" }] }),
  component: () => <AppShell><ScannerPage /></AppShell>,
});

type ScanResult = {
  crop_type: string;
  disease_name: string;
  confidence: number;
  severity: string;
  treatment: string;
};

function ScannerPage() {
  const qc = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: history = [] } = useQuery({
    queryKey: ["scans"],
    queryFn: async () => {
      const { data } = await supabase.from("disease_scans").select("*").order("created_at", { ascending: false }).limit(6);
      return data ?? [];
    },
  });

  const onFile = async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image"); return; }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      setResult(null);
      setLoading(true);
      try {
        const r = await fetch("/api/ai/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: dataUrl }),
        });
        if (r.status === 429) { toast.error("Rate limit reached"); setLoading(false); return; }
        if (r.status === 402) { toast.error("AI credits exhausted"); setLoading(false); return; }
        if (!r.ok) throw new Error("Scan failed");
        const data = (await r.json()) as ScanResult;
        setResult(data);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("disease_scans").insert({
            user_id: user.id,
            crop_type: data.crop_type,
            disease_name: data.disease_name,
            confidence: data.confidence,
            severity: data.severity,
            treatment: data.treatment,
          });
          qc.invalidateQueries({ queryKey: ["scans"] });
        }
      } catch (err) {
        toast.error("Analysis failed");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const sevColor = (s?: string) =>
    s === "severe" ? "text-destructive bg-destructive/10" :
    s === "moderate" ? "text-warning bg-warning/10" :
    "text-success bg-success/10";

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ScanLine className="h-7 w-7 text-primary" /> Crop Disease Scanner
        </h1>
        <p className="text-muted-foreground mt-1">Upload a leaf photo. AI vision identifies the disease and recommends treatment.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-card p-6">
          <label className="block">
            <div className="rounded-2xl border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer p-12 text-center">
              {preview ? (
                <img src={preview} alt="leaf preview" className="max-h-64 mx-auto rounded-lg" />
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium">Click to upload leaf photo</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG or PNG, up to 10MB</p>
                </>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          </label>
          {preview && <Button variant="outline" className="w-full mt-4" onClick={() => { setPreview(null); setResult(null); }}>Upload another</Button>}
        </div>

        <div className="rounded-2xl border bg-card p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin mb-3 text-primary" />
              AI analyzing your leaf…
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Crop</div>
                  <div className="text-xl font-bold">{result.crop_type}</div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sevColor(result.severity)}`}>{result.severity}</span>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Diagnosis</div>
                <div className="text-2xl font-bold text-primary">{result.disease_name}</div>
                <div className="text-sm text-muted-foreground mt-1">Confidence: {Math.round(result.confidence * 100)}%</div>
              </div>
              <div className="rounded-xl bg-muted p-4">
                <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <ShieldCheck className="h-4 w-4 text-success" /> Treatment
                </div>
                <p className="text-sm leading-relaxed">{result.treatment}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <AlertTriangle className="h-10 w-10 mb-3 opacity-40" />
              Upload a photo to get instant AI diagnosis.
            </div>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Recent scans</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {history.map((s) => (
              <div key={s.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{s.crop_type}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${sevColor(s.severity ?? undefined)}`}>{s.severity}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{s.disease_name}</div>
                <div className="text-xs text-muted-foreground mt-2">{new Date(s.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
