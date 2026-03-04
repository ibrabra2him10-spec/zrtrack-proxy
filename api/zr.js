export default async function handler(req, res) {
  // Allow requests from any origin (your web app)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { apiKey, tenant, page = 1, pageSize = 100 } = req.body;

  if (!apiKey || !tenant) {
    return res.status(400).json({ error: "apiKey and tenant are required" });
  }

  try {
    const zrRes = await fetch("https://api.zrexpress.app/api/v1.0/parcels/search", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
        "X-Tenant": tenant,
      },
      body: JSON.stringify({ page, pageSize }),
    });

    const data = await zrRes.json();

    if (!zrRes.ok) {
      return res.status(zrRes.status).json({ error: data?.detail || data?.title || "ZR Express API error" });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Proxy error: " + err.message });
  }
}
