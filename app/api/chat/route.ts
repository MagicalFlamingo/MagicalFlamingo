import { streamText, tool, zodSchema, isStepCount } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { knowledge } from "@/content/knowledge";

const SYSTEM_PROMPT = `${knowledge.systemPromptInstructions}

Your full knowledge base:
${JSON.stringify(knowledge, null, 2)}

TOOLS — use these to render rich visual components alongside or instead of text:

- showCaseStudyCard: when asked about a specific project in general terms
- showFrameCarousel: when asked to walk through or see details of a specific case study
- showSkillsMap: when asked about skills, design stack, or capabilities
- showTimelineCard: when asked about career history, experience length, or career arc
- showPromptChips: ALWAYS call this after your first substantive response
- showNDASafeNote: when a question touches on confidential or NDA-restricted detail

Rules:
1. Always call showPromptChips after your first response.
2. If asked about Qlik metrics or internal screens, call showNDASafeNote.
3. Never make up metrics. Say what changed qualitatively and what you'd have measured.
4. Keep text responses focused — 3–5 sentences max.
5. When rendering a component, keep text short — the component carries the detail.
6. Speak in first person as Danielle. Warm, direct, peer-to-peer.
`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: SYSTEM_PROMPT,
    messages,
    stopWhen: isStepCount(5),
    tools: {
      showCaseStudyCard: tool({
        description: "Render a visual summary card for one of Danielle's case studies",
        inputSchema: zodSchema(z.object({ project: z.enum(["qlik", "aws", "sprout"]).describe("Which case study to show") })),
      }),
      showFrameCarousel: tool({
        description: "Render a visual walkthrough of a case study inline in the chat",
        inputSchema: zodSchema(z.object({ project: z.enum(["qlik", "aws", "sprout"]).describe("Which case study to walk through") })),
      }),
      showSkillsMap: tool({
        description: "Render a visual skills map showing Danielle's design stack and domains",
        inputSchema: zodSchema(z.object({})),
      }),
      showTimelineCard: tool({
        description: "Render Danielle's career timeline from art history to senior product design",
        inputSchema: zodSchema(z.object({})),
      }),
      showPromptChips: tool({
        description: "Render suggested follow-up questions as clickable chips",
        inputSchema: zodSchema(z.object({ suggestions: z.array(z.string()).max(6).describe("3–6 suggested follow-up questions") })),
      }),
      showNDASafeNote: tool({
        description: "Render a tasteful note explaining what can and can't be shared due to NDA",
        inputSchema: zodSchema(z.object({ context: z.string().describe("Brief context about what the question touched on and what can be said") })),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
