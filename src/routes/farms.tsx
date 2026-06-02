import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Tractor, Plus, MapPin, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/farms")({
  head: () => ({ meta: [{ title: "Farms — AgriCoop" }] }),
  component: () => <AppShell><FarmsPage /></AppShell>,
});

function FarmsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");

  const { data: farms = [] } = useQuery({
    queryKey: ["farms"],
    queryFn: async () => {
      const { data, error } = await supabase.from("farms").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("farms").insert({
        user_id: user.id, name, location, size_hectares: size ? Number(size) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Farm registered");
      qc.invalidateQueries({ queryKey: ["farms"] });
      setOpen(false); setName(""); setLocation(""); setSize("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("farms").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Farm removed"); qc.invalidateQueries({ queryKey: ["farms"] }); },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farms</h1>
          <p className="text-muted-foreground mt-1">Register and manage your farm plots.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />New farm</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Register a farm</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); create.mutate(); }} className="space-y-4">
              <div><Label>Name</Label><Input required value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div><Label>Location</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Musanze, RW" /></div>
              <div><Label>Size (hectares)</Label><Input type="number" step="0.1" value={size} onChange={(e) => setSize(e.target.value)} /></div>
              <Button type="submit" className="w-full" disabled={create.isPending}>{create.isPending ? "Saving…" : "Register farm"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {farms.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
          <Tractor className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No farms yet. Register your first farm to begin.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {farms.map((f) => (
            <div key={f.id} className="rounded-2xl border bg-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Tractor className="h-5 w-5" /></div>
                <button onClick={() => remove.mutate(f.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
              <h3 className="font-semibold mt-3">{f.name}</h3>
              {f.location && <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1"><MapPin className="h-3 w-3" />{f.location}</div>}
              {f.size_hectares && <div className="text-sm text-muted-foreground mt-1">{f.size_hectares} hectares</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
