// Visit counter backed by Upstash Redis (REST API, no SDK needed).
// POST increments and returns the new total; GET only reads it.
// Needs UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in the Vercel project.
const KEY = "portfolio:visits";

export default async function handler(req, res) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return res.status(503).json({ error: "counter not configured" });
  }

  const command = req.method === "POST" ? `incr/${KEY}` : `get/${KEY}`;
  try {
    const r = await fetch(`${url}/${command}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) throw new Error(`upstash ${r.status}`);
    const { result } = await r.json();
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ count: Number(result) || 0 });
  } catch (err) {
    console.error("visits:", err);
    return res.status(502).json({ error: "counter unavailable" });
  }
}
