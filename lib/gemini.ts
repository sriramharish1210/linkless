const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export interface AnalysisResult {
  category: string;
  priority: string;
  summary: string;
  bestReceiver: string;
  keywords: string[];
  urgencyScore: number;
}

export async function analyzeIntent(
  need: string,
  description: string,
  priority: string
): Promise<AnalysisResult> {
  const prompt = `You are an emergency intent parser for a crisis communication system.

Analyze this anonymous request and return ONLY a JSON object — no markdown, no explanation.

Need: "${need}"
Description: "${description}"
User-set priority: "${priority}"

Return exactly this JSON structure:
{
  "category": "Medical | Food | Shelter | Transport | Safety | Emotional | Other",
  "priority": "Low | Medium | High | Critical",
  "summary": "One sentence plain-language summary of the need",
  "bestReceiver": "Who should respond, e.g. Medical Volunteer, Food Aid Worker",
  "keywords": ["array", "of", "3-5", "keywords"],
  "urgencyScore": 0-100
}`;

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 400 },
    }),
  });

  if (!res.ok) throw new Error("Gemini API error");

  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned) as AnalysisResult;
}
