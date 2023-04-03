import { columnMatching } from "@/lib/api";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ message: "not found" });
  }

  const { sample_data } = req.body;

  if (Array.isArray(sample_data) && sample_data.length > 0) {
    const response = await columnMatching(sample_data);
    return res.status(200).json(await response.json());
  }

  return res.status(400).json({ message: "invalid request" });
}
