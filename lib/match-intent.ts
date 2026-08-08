import { intents, fallbackResponses, fallbackFollowups, pick } from "@/content/responses";

export type MatchResult = {
  response: string;
  tool?: string;
  toolArgs?: Record<string, unknown>;
  chips: string[];
};

export function matchIntent(input: string): MatchResult {
  const lower = input.toLowerCase();

  let best = null as (typeof intents)[0] | null;
  let bestScore = 0;

  for (const intent of intents) {
    let score = 0;
    for (const kw of intent.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += intent.weights?.[kw] ?? 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }

  if (!best || bestScore < 1) {
    return {
      response: pick(fallbackResponses),
      chips: fallbackFollowups,
    };
  }

  return {
    response: pick(best.responses),
    tool: best.tool,
    toolArgs: best.toolArgs,
    chips: best.followups,
  };
}
