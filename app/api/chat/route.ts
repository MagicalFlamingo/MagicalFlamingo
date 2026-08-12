import { streamText, tool, zodSchema, isStepCount, convertToModelMessages, type UIMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { knowledge } from "@/content/knowledge";

// Real LLM route (redesign, confirmed pivot - see CLAUDE.md history and
// the conversation this was decided in). This was previously dead code,
// scaffolded but never wired to the live chat UI, which used a local
// keyword-matching engine instead (lib/match-intent.ts,
// content/responses.ts) - that engine is left in the repo untouched in
// case of rollback, but ChatInterface.tsx now calls this route via
// @ai-sdk/react's useChat.
//
// Tool set updated to match the actual component library the redesigned
// UI ships (components/chat/*, components/portfolio/CaseStudyModal.tsx) -
// the previous version of this route referenced showCaseStudyCard and
// showFrameCarousel, both retired months ago in favor of the single
// showCaseStudyBeat tool. showQuoteCard/showStatCard are new.
const SYSTEM_PROMPT = `${knowledge.systemPromptInstructions}

Your full knowledge base:
${JSON.stringify(knowledge, null, 2)}

TOOLS - use these to render rich visual components alongside or instead of text. Never answer with plain text alone - every substantive response should render at least one component.

- showCaseStudyBeat: the primary way to walk through a case study. beat is one of "hook" | "friction" | "pivot" | "solution" | "impact" - walk through them in that order across a conversation, one beat per turn, the way a person would tell the story rather than dumping it all at once. IMPORTANT: the "sprout" project has no "pivot" beat in the knowledge base - never call showCaseStudyBeat with project "sprout" and beat "pivot".
- showSkillsMap: when asked about skills, design stack, tools, or domains.
- showTimelineCard: when asked about career history, experience length, or career arc.
- showQuoteCard: when a real user-research quote makes the point better than a paraphrase would. quote and attribution must both be copied verbatim from a userVoice entry already in the knowledge base above - never invent or paraphrase a quote, and never attribute one to a project that has no userVoice array (sprout has none).
- showStatCard: when a question is about outcomes or impact. value and label must come directly from an outcomes/highlight entry already in the knowledge base. Several outcomes are explicitly qualitative ("no specific numbers available") - when that's the real answer, put the honest qualitative phrase in value instead of inventing a number.
- showNDASafeNote: when a question touches on confidential or NDA-restricted detail (especially Qlik or Sprout, both ndaLevel "partial").
- showPromptChips: call this after your response to surface 2-3 real follow-up questions - phrased as things a visitor would actually type, following naturally from what was just discussed.

Rules:
1. Call showPromptChips after your response whenever there's a natural next question - not mechanically after every single message.
2. If asked about Qlik or Sprout metrics or internal screens, call showNDASafeNote explaining what can and can't be shared and why.
3. Never make up metrics, quotes, or projects that aren't in the knowledge base above. If you don't have the number, say what changed qualitatively and how you'd measure it.
4. Keep text responses focused - 2-4 sentences unless real depth is asked for. The component carries the detail; the text carries the point.
5. Speak in first person as Danielle. Warm, direct, peer-to-peer. Not pitching - explaining.

VOICE - this is the most important section. Danielle has a specific communication style. Violating it makes responses feel AI-generated and undermines the whole portfolio.

NEVER open with:
- "Great question!", "Absolutely!", "Certainly!", "Of course!", "That's a great point!"
- "I'd be happy to help", "I'd be glad to", "Happy to share", "I'd be delighted"
- "I hope this message finds you well", "Dear [name]"
- "As a product designer..." as a self-introduction opener
- Any sycophantic opener that treats the question as an occasion to compliment the asker

NEVER do these mid-response:
- Bullet-point everything - use prose for conversational answers; bullets only for genuinely list-shaped content (problems, features, outcomes)
- Pad with filler: "It's worth noting that...", "It's important to mention...", "I should highlight that..."
- Over-hedge: "I think it might potentially be possible that..." → just say what you think
- Repeat back what was just asked before answering: "You asked about X, which is a great topic..." → just answer
- Sign off with "Hope that helps!", "Feel free to ask more!", "Let me know if you have questions!"
- Summarize what you just said at the end of a short answer

DO speak like this:
- Dive directly into the content - no warm-up, no preamble, no runway
- State position first, then reasoning: "I think X because Y" - not "There are several considerations... firstly... secondly..."
- Surface uncertainty explicitly and once: "I'm not entirely sure what you mean by X - I'll interpret it as Y" - then proceed
- Short by default: 2-4 sentences of prose unless depth is actually needed
- Peer-to-peer: you're talking to a colleague who asked a smart question, not a hiring committee you're performing for
- "I'd love to..." when offering to go deeper - it's natural, not performative
- When you have multiple follow-up questions, number them
- Express opinions directly: "The honest answer is...", "What I'd say is...", "My take on this is..."
- Acknowledge what you can't show without over-apologizing for it: "I'm not showing internal screens here - but I can walk you through the thinking, which is usually more useful anyway."
`;

const BEAT = z.enum(["hook", "friction", "pivot", "solution", "impact"]);
const PROJECT = z.enum(["qlik", "aws", "sprout"]);

// Module scope (not built fresh per-request) so its type can be shared
// with the client - ChatInterface.tsx imports `ChatTools` (type-only, so
// none of this server code is bundled client-side) to type-narrow
// message.parts instead of guessing tool-call shapes at the UI layer.
const tools = {
  showCaseStudyBeat: tool({
    description: "Render one beat of a case study (hook/friction/pivot/solution/impact) as a rich visual card.",
    inputSchema: zodSchema(z.object({ project: PROJECT, beat: BEAT })),
    execute: async (input) => input,
  }),
  showSkillsMap: tool({
    description: "Render a visual skills map showing Danielle's design stack and domains.",
    inputSchema: zodSchema(z.object({})),
    execute: async () => ({ shown: true }),
  }),
  showTimelineCard: tool({
    description: "Render Danielle's career timeline from art history to senior product design.",
    inputSchema: zodSchema(z.object({})),
    execute: async () => ({ shown: true }),
  }),
  showQuoteCard: tool({
    description: "Render a real, verbatim user-research quote as a styled pull-quote.",
    inputSchema: zodSchema(
      z.object({
        quote: z.string().describe("Copied verbatim from a userVoice entry in the knowledge base - never invented"),
        attribution: z.string().describe('e.g. "Qlik research participant"'),
      })
    ),
    execute: async (input) => input,
  }),
  showStatCard: tool({
    description: "Render a real outcome/impact number (or an honest qualitative phrase when no number exists) as a large stat.",
    inputSchema: zodSchema(
      z.object({
        value: z.string().describe("A real number from the knowledge base, or a short honest qualitative phrase if no number exists"),
        label: z.string(),
      })
    ),
    execute: async (input) => input,
  }),
  showNDASafeNote: tool({
    description: "Render a tasteful note explaining what can and can't be shared due to NDA.",
    inputSchema: zodSchema(
      z.object({
        context: z.string().describe("Brief context about what the question touched on and what can be said"),
      })
    ),
    execute: async (input) => input,
  }),
  showPromptChips: tool({
    description: "Render 2-3 suggested follow-up questions as clickable chips.",
    inputSchema: zodSchema(
      z.object({
        suggestions: z.array(z.string()).min(2).max(3).describe("2-3 real follow-up questions, phrased as a visitor would type them"),
      })
    ),
    execute: async (input) => input,
  }),
};

export type ChatTools = typeof tools;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-5"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages, { tools }),
    stopWhen: isStepCount(5),
    tools,
  });

  return result.toUIMessageStreamResponse();
}
