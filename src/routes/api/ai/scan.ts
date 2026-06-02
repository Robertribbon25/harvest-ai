import { createFileRoute } from "@tanstack/react-router";

const SYSTEM = `You are an expert plant pathologist. Analyze the leaf image and identify any crop disease. Always respond using the diagnose_plant tool. Be conservative on confidence. If the image is not a plant leaf, set disease_name to "Not a plant leaf" with low confidence.`;

export const Route = createFileRoute("/api/ai/scan")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { image } = (await request.json()) as { image: string };
          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), { status: 500 });

          const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                { role: "system", content: SYSTEM },
                {
                  role: "user",
                  content: [
                    { type: "text", text: "Analyze this plant leaf and diagnose any disease." },
                    { type: "image_url", image_url: { url: image } },
                  ],
                },
              ],
              tools: [{
                type: "function",
                function: {
                  name: "diagnose_plant",
                  description: "Return diagnosis of the plant leaf.",
                  parameters: {
                    type: "object",
                    properties: {
                      crop_type: { type: "string", description: "Crop species, e.g. Maize, Tomato, Potato." },
                      disease_name: { type: "string", description: "Disease name or 'Healthy'." },
                      confidence: { type: "number", description: "0 to 1." },
                      severity: { type: "string", enum: ["mild", "moderate", "severe", "healthy"] },
                      treatment: { type: "string", description: "Treatment recommendations, 2-3 sentences." },
                    },
                    required: ["crop_type", "disease_name", "confidence", "severity", "treatment"],
                    additionalProperties: false,
                  },
                },
              }],
              tool_choice: { type: "function", function: { name: "diagnose_plant" } },
            }),
          });

          if (r.status === 429 || r.status === 402) {
            return new Response(JSON.stringify({ error: r.status === 429 ? "rate limited" : "credits" }), { status: r.status });
          }
          if (!r.ok) {
            const t = await r.text();
            console.error("AI scan error", r.status, t);
            return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500 });
          }

          const data = await r.json();
          const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
          if (!args) return new Response(JSON.stringify({ error: "no diagnosis" }), { status: 500 });
          const parsed = JSON.parse(args);
          return new Response(JSON.stringify(parsed), { headers: { "Content-Type": "application/json" } });
        } catch (e) {
          console.error(e);
          return new Response(JSON.stringify({ error: "Unknown error" }), { status: 500 });
        }
      },
    },
  },
});
