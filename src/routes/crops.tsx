import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Sprout, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/crops")({
  head: () => ({ meta: [{ title: "Crops — AgriCoop" }] }),
  component: () => <AppShell><CropsPage /></AppShell>,
});

const CROPS = ["Maize", "Potato", "Tomato", "Rice", "Beans", "Coffee", "Cassava", "Banana"];

function CropsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [cropType, setCropType] = useState("Maize");
  const [plantedAt, setPlantedAt] = useState("");
  const [expected, setExpected] = useState("");

  const { data: crops = [] } = useQuery({
    queryKey: ["crops"],
    queryFn: async () => {
      const { data, error } = await supabase.from("crops").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("crops").insert({
        user_id: user.id,
        crop_type: cropType,
        planted_at: plantedAt || null,
        expected_harvest: expected || null,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Crop added"); qc.invalidateQueries({ queryKey: ["crops"] }); setOpen(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("crops").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crops"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crops</h1>
          <p className="text-muted-foreground mt-1">Track every crop from planting to harvest.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add crop</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add a crop</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); create.mutate(); }} className="space-y-4">
              <div>
                <Label>Crop</Label>
                <Select value={cropType} onValueChange={setCropType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CROPS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Planted</Label><Input type="date" value={plantedAt} onChange={(e) => setPlantedAt(e.target.value)} /></div>
              <div><Label>Expected harvest</Label><Input type="date" value={expected} onChange={(e) => setExpected(e.target.value)} /></div>
              <Button type="submit" className="w-full" disabled={create.isPending}>Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {crops.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
          <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No crops yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crops.map((c) => (
            <div key={c.id} className="rounded-2xl border bg-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success"><Sprout className="h-5 w-5" /></div>
                <button onClick={() => remove.mutate(c.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
              <h3 className="font-semibold mt-3">{c.crop_type}</h3>
              <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                {c.planted_at && <div>Planted: {c.planted_at}</div>}
                {c.expected_harvest && <div>Harvest: {c.expected_harvest}</div>}
              </div>
              <span className="inline-block mt-3 text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">{c.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
