import { createFileRoute } from "@tanstack/react-router";

const SYSTEM = `You are AgriCoop AI, an expert agronomist and farming assistant for African smallholder farmers and cooperatives. You give practical, locally-relevant advice on crops (maize, beans, potato, rice, coffee, cassava, banana, tomato), soil, irrigation, fertilizer, pest and disease management, weather, and market timing. Reply concisely (under 200 words), use bullet points where helpful, and prefer low-cost, accessible solutions. If a user writes in Kinyarwanda, reply in Kinyarwanda.`;

export const Route = createFileRoute("/api/ai/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = (await request.json()) as { messages: { role: string; content: string }[] };
          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), { status: 500 });

          const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              stream: true,
              messages: [{ role: "system", content: SYSTEM }, ...messages],
            }),
          });

          if (r.status === 429 || r.status === 402) {
            return new Response(JSON.stringify({ error: r.status === 429 ? "rate limited" : "credits" }), { status: r.status });
          }
          if (!r.ok || !r.body) {
            const t = await r.text();
            console.error("AI gateway error", r.status, t);
            return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500 });
          }

          return new Response(r.body, { headers: { "Content-Type": "text/event-stream" } });
        } catch (e) {
          console.error(e);
          return new Response(JSON.stringify({ error: "Unknown error" }), { status: 500 });
        }
      },
    },
  },
});
