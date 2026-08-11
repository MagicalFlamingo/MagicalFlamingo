// Intent-matching response library. Add new intents here - no code change needed.

import type { CaseStudyId } from "@/content/knowledge";
import type { BeatId } from "@/components/chat/CaseStudyBeat";

// A closed set of rich components a reply can trigger, with each tool's
// args shape tied to its name - `renderTool()` narrows this with an
// exhaustive switch, so a wrong-shaped payload is a compile error instead
// of a runtime crash with no test suite to catch it.
//
// showCaseStudyBeat replaces the old showFrameCarousel (council round 11).
// A case study used to render as one multi-step card a visitor paginated
// through - two rounds of rejection later ("hard to navigate," then "no,
// I don't know how to make it work better" on a rewritten single-scroll
// version), the actual fix was structural: every beat (Hook/Friction/
// Pivot/Solution/Impact) is now its own tool call, attached to its own
// separate chat message, the same way any other multi-part answer in this
// chat already works. No pagination state exists anymore for case
// studies - "next" is just another followup chip routing to another
// intent, exactly like everything else in this file.
export type ChatTool =
  | { tool: "showCaseStudyBeat"; toolArgs: { project: CaseStudyId; beat: BeatId } }
  | { tool: "showSkillsMap" }
  | { tool: "showTimelineCard" }
  | { tool: "showNDASafeNote"; toolArgs: { context: string } }
  | { tool: "showQuoteCard"; toolArgs: { quote: string; attribution: string } }
  | { tool: "showStatCard"; toolArgs: { value: string; label: string } };

export type ToolName = ChatTool["tool"];

export type Intent = {
  id: string;
  keywords: string[];
  weights?: Record<string, number>;
  responses: string[];
  toolCall?: ChatTool;
  followups: string[];
};

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const thinkingPhrases: string[] = [
  "actually thinking, no LLM to blame",
  "reading between the lines",
  "checking my notes",
  "no bullet points forming yet",
  "being thorough, one sec",
  "connecting this to something real",
];

// Shown once - for the very first message a visitor ever sends in a
// session, instead of one of the generic thinkingPhrases above. Council
// round 7: the moment someone stops browsing chips and actually types or
// clicks something is the one beat in the whole flow with real stakes -
// it's where they stop watching the site and start participating. A
// dedicated line here is the smallest possible acknowledgment of that,
// through the same mechanism (thinking phrase) rather than new UI.
export const firstMessagePhrase = "okay, an actual question - let's see";

export const fallbackResponses: string[] = [
  "I can cover the case studies, research approach, working style, or career background. What's most relevant to what you're evaluating?",
  "That's a bit outside what I can answer here - try asking about a specific project, how I work, or what I'd do in the first 30 days.",
  "Not quite landing for me - try rephrasing, or pick one of the prompts below and I'll run with it.",
  "Not sure I caught that. I can tell you about Qlik, AWS, my research process, or the art history angle - whichever is most relevant.",
  "I'm set up to answer questions about work, process, and background. What are you trying to figure out?",
  "I have opinions on most things design-related, but I'm blanking on that one. Try something in the chips below.",
];

export const fallbackFollowups: string[] = [
  "Show me the Qlik project",
  "Walk me through AWS Resilience Hub",
  "How do you approach research?",
  "Show me your career timeline",
  "How can I get in touch?",
];

export const intents: Intent[] = [
  // ── CASE STUDIES ─────────────────────────────────────────────────────────

  {
    id: "qlik",
    keywords: ["qlik", "data catalog", "data connection", "data governance", "connections", "unified connections", "platform"],
    weights: { qlik: 4, "data catalog": 3, "data connection": 3, "data governance": 2, "unified connections": 4 },
    responses: [
      "Qlik is the most complex problem I've worked on - four product lines, no shared way to manage the same data connection. Here's the story:",
      "The Qlik project starts with a question real users were asking without knowing how to ask it: why do I have to connect to the same database three times?",
      "That project is where I learned that 'unify the experience' is easy to say and genuinely hard when the technical objects underneath aren't the same thing.",
    ],
    toolCall: { tool: "showCaseStudyBeat", toolArgs: { project: "qlik", beat: "hook" } },
    // Council round 11: this used to open the full multi-step carousel -
    // now it shows only the Hook, the same way every other reply in this
    // chat shows one thing at a time. Going deeper means asking (or
    // clicking) for the next beat, exactly like any other followup.
    followups: [
      "What was the biggest friction at Qlik?",
      "What did the research uncover?",
      "What was the actual impact of this research?",
      "Walk me through AWS next",
    ],
  },

  {
    id: "qlik_friction",
    keywords: ["biggest friction", "friction at qlik", "what was the friction", "qlik problems", "qlik pain point"],
    weights: { "biggest friction": 6, "friction at qlik": 6, "what was the friction": 5 },
    responses: [
      "The concrete one: users were creating the same connection over and over without knowing it.",
    ],
    toolCall: { tool: "showCaseStudyBeat", toolArgs: { project: "qlik", beat: "friction" } },
    followups: [
      "What did the research uncover?",
      "What would you do differently on Qlik?",
      "How did you handle the NDA parts?",
    ],
  },

  {
    id: "qlik_pivot",
    keywords: ["research uncover", "qlik pivot", "technical constraint", "what changed the design strategy", "qlik insight"],
    weights: { "research uncover": 6, "qlik pivot": 6, "technical constraint": 5, "what changed the design strategy": 5 },
    responses: [
      "A real one: a Talend Studio \"connection\" isn't the same technical object as a Qlik Cloud connection.",
    ],
    toolCall: { tool: "showCaseStudyBeat", toolArgs: { project: "qlik", beat: "pivot" } },
    followups: [
      "What did you actually build?",
      "What was the biggest friction at Qlik?",
      "What was the actual impact of this research?",
    ],
  },

  {
    id: "qlik_solution",
    keywords: ["what did you actually build", "qlik solution", "unified browse view", "qlik creation flow", "what did you ship on qlik"],
    weights: { "what did you actually build": 6, "qlik solution": 6, "unified browse view": 5 },
    responses: [
      "A unified browse view and creation flow that works for both ends of the experience spectrum.",
    ],
    toolCall: { tool: "showCaseStudyBeat", toolArgs: { project: "qlik", beat: "solution" } },
    followups: [
      "What was the actual impact of this research?",
      "How did you handle the NDA parts?",
      "Walk me through AWS next",
    ],
  },

  {
    id: "qlik_retro",
    keywords: ["would you do differently on qlik", "qlik retrospective", "qlik lesson learned", "qlik in hindsight"],
    weights: { "would you do differently on qlik": 6, "qlik retrospective": 5 },
    responses: [
      "I'd push for the feasibility session with engineering to happen in Iteration 1, not Iteration 2. We got lucky that the Talend developer who flagged the context-variable constraint joined one of our sessions - that should be a structured part of the research design from the start, not left to chance.",
    ],
    followups: [
      "What was the actual impact of this research?",
      "How do you approach research?",
      "Walk me through AWS next",
    ],
  },

  {
    id: "qlik_impact",
    keywords: ["actual impact of this research", "impact of the qlik", "did the qlik research pay off", "impact of this research", "qlik impact", "did it work on qlik"],
    weights: { "actual impact of this research": 6, "impact of the qlik": 5, "impact of this research": 5, "qlik impact": 5 },
    responses: [
      "It's not shipped yet - still active development - but the signal is real.",
    ],
    toolCall: { tool: "showCaseStudyBeat", toolArgs: { project: "qlik", beat: "impact" } },
    // Impact is the terminal node in this chain - a visitor here has
    // already heard friction and/or the retrospective. No backlinks;
    // forward exits only, including a direct path to contact for whoever
    // just finished the loop instead of handing them back to the start.
    followups: [
      "How can I get in touch?",
      "Walk me through AWS next",
      "Walk me through the Sprout work",
    ],
  },

  {
    id: "aws",
    keywords: ["aws", "amazon", "resilience hub", "resiliency", "resiliency score", "disaster recovery", "cloud resilience", "resilience"],
    weights: { aws: 4, amazon: 3, "resilience hub": 5, "resiliency score": 5, resiliency: 3 },
    responses: [
      "AWS Resilience Hub showed customers a number - 13% - and expected them to act on it. They didn't, because the number had nothing to say.",
      "The resiliency score problem was a trust problem before it was a UI problem. Walk through it here.",
      "That one's my clearest example of a design problem that looked like a display issue but was actually a communication problem - the score wasn't wrong, it just had nothing to say.",
    ],
    toolCall: { tool: "showCaseStudyBeat", toolArgs: { project: "aws", beat: "hook" } },
    followups: [
      "Why didn't people trust the score?",
      "What did the redesign actually change?",
      "How did you measure success on AWS?",
      "Show me the Qlik project next",
    ],
  },

  {
    id: "aws_friction",
    keywords: ["why didn't people trust", "aws trust problem", "aws friction", "trust your evaluation", "aws confused users"],
    weights: { "why didn't people trust": 6, "aws trust problem": 6, "aws friction": 5 },
    responses: [
      "It undermined its own credibility - no breakdown, no explanation, and the one call to action didn't say what to actually do.",
    ],
    toolCall: { tool: "showCaseStudyBeat", toolArgs: { project: "aws", beat: "friction" } },
    followups: [
      "What was the actual insight?",
      "What did the redesign actually change?",
      "How did you measure success on AWS?",
    ],
  },

  {
    id: "aws_pivot",
    keywords: ["actual insight", "aws pivot", "score had nothing to say", "aws design objectives"],
    weights: { "actual insight": 6, "aws pivot": 6, "score had nothing to say": 6 },
    responses: [
      "Users didn't need a different score - they needed to see what was inside it, and then do something about it.",
    ],
    toolCall: { tool: "showCaseStudyBeat", toolArgs: { project: "aws", beat: "pivot" } },
    followups: [
      "What did the redesign actually change?",
      "Why didn't people trust the score?",
      "How did you measure success on AWS?",
    ],
  },

  {
    id: "aws_change",
    keywords: ["redesign actually change", "what changed on aws", "aws before and after", "score as points"],
    weights: { "redesign actually change": 6, "what changed on aws": 5 },
    responses: [
      "Five concrete things changed, starting with the score itself: points instead of a percentage.",
    ],
    toolCall: { tool: "showCaseStudyBeat", toolArgs: { project: "aws", beat: "solution" } },
    followups: [
      "How did you measure success on AWS?",
      "Show me the Qlik project next",
      "Walk me through the Sprout work",
    ],
  },

  {
    id: "aws_measure",
    keywords: ["measure success on aws", "aws results", "aws outcome", "did it work on aws"],
    weights: { "measure success on aws": 6, "aws results": 4 },
    responses: [
      "It shipped and is live in AWS Resilience Hub today - and the signal since launch has been unambiguous.",
    ],
    toolCall: { tool: "showCaseStudyBeat", toolArgs: { project: "aws", beat: "impact" } },
    // Terminal node, same treatment as qlik_impact - no backlink to
    // aws_change, a direct path to contact for whoever's just heard the
    // outcome instead of handing them back to the start.
    followups: [
      "How can I get in touch?",
      "Show me the Qlik project next",
      "Walk me through the Sprout work",
    ],
  },

  {
    id: "sprout",
    keywords: ["sprout", "sprout 2.0", "component library", "design system", "design tokens", "component audit"],
    weights: { sprout: 5, "sprout 2.0": 5, "component library": 3, "design system": 3, "design tokens": 3 },
    responses: [
      "Sprout 2.0 is Qlik's own design system - same project as the connections work, different lens. That case study is the research story; this is the systems-building one.",
      "Design systems work is often invisible when it's working well. This one's about making sure the wizard and the browse table look and behave like the same product instead of two screens that happen to sit next to each other.",
      "The Sprout work is about removing myself from being the bottleneck - if I'm the only one who knows the token set, that doesn't scale past this one project.",
    ],
    toolCall: { tool: "showCaseStudyBeat", toolArgs: { project: "sprout", beat: "hook" } },
    followups: [
      "What was the friction without a design system?",
      "What components did you rebuild?",
      "How does this relate to the Qlik connections work?",
    ],
  },

  {
    id: "sprout_friction",
    keywords: ["friction without a design system", "sprout friction", "no shared components", "sprout tokens hardcoded"],
    weights: { "friction without a design system": 6, "sprout friction": 6, "no shared components": 5 },
    responses: [
      "No shared token set, so colors and spacing were hardcoded per screen and drifted from spec over time.",
    ],
    toolCall: { tool: "showCaseStudyBeat", toolArgs: { project: "sprout", beat: "friction" } },
    followups: [
      "What components did you rebuild?",
      "How does this relate to the Qlik connections work?",
    ],
  },

  {
    id: "sprout_components",
    keywords: ["components did you rebuild", "sprout components", "which components", "component audit against spec"],
    weights: { "components did you rebuild": 6, "sprout components": 5 },
    responses: [
      "Search, filter pills, switches, and badges - rebuilt to match the Sprout 2.0 spec exactly.",
    ],
    toolCall: { tool: "showCaseStudyBeat", toolArgs: { project: "sprout", beat: "solution" } },
    followups: [
      "What's the actual impact of the design system?",
      "How does this relate to the Qlik connections work?",
      "Show me your full skills breakdown",
    ],
  },

  {
    id: "sprout_impact",
    keywords: ["actual impact of the design system", "sprout impact", "did sprout work", "sprout results"],
    weights: { "actual impact of the design system": 6, "sprout impact": 6 },
    responses: [
      "In progress, same as the connections work it underpins - but already real.",
    ],
    toolCall: { tool: "showCaseStudyBeat", toolArgs: { project: "sprout", beat: "impact" } },
    followups: [
      "How can I get in touch?",
      "Show me the Qlik project next",
      "Walk me through AWS next",
    ],
  },

  // ── PROCESS & METHODS ───────────────────────────────────────────────────

  {
    id: "research",
    keywords: ["research", "user research", "interview", "study", "testing", "longitudinal", "moderated", "usability", "discovery"],
    weights: { "user research": 3, longitudinal: 4, interview: 2, research: 2, discovery: 2 },
    responses: [
      "I default to talking to users earlier than most teams want me to - not structured interviews, just conversations where I listen for what surprises me.",
      "Research for me is less about proving a hypothesis and more about finding the thing I didn't know to ask. That usually happens in the second half of an interview, not the first.",
      "The Qlik study is probably the best example - five months, four user groups, two iteration cycles. The critical insight didn't come from a user question. It came from an engineer who joined one session.",
    ],
    toolCall: {
      tool: "showQuoteCard",
      toolArgs: {
        quote: "I need to know not just that a connection is used 11 times, but where, and who to contact.",
        attribution: "Qlik research participant",
      },
    },
    followups: [
      "Show me the Qlik project - good example of this",
      "What's your process for synthesizing findings?",
      "What's it like being a solo designer?",
      "What would you do in your first 30 days?",
    ],
  },

  {
    id: "process",
    keywords: ["process", "workflow", "how do you work", "design process", "method", "approach", "wireframe", "prototype", "iteration", "how you design"],
    weights: { "design process": 4, "how do you work": 4, prototype: 2, wireframe: 2, iteration: 2, process: 2 },
    responses: [
      "Research before wireframes, always. Then get to a testable artifact as fast as possible - not a polished mockup, something that can fail in an interesting way. The interesting failures are where the real design decisions happen.",
      "I work at two levels simultaneously - the micro and the macro. I care about the interaction detail in front of me, and also constantly step back to ask how this specific decision serves the broader journey.",
      "I try to document decisions as I make them - so I can explain 'why this and not that' in a design review. The thing you didn't build is often as important as the thing you did.",
    ],
    followups: [
      "How do you approach research?",
      "What would you do in your first 30 days?",
      "How do you collaborate with engineers and PMs?",
    ],
  },

  // ── IDENTITY & BACKGROUND ───────────────────────────────────────────────

  {
    id: "background",
    keywords: ["art history", "background", "leiden", "education", "degree", "academic", "transition", "how did you get into", "how did you end up", "art", "museum", "interior design"],
    weights: { "art history": 5, leiden: 4, museum: 2, background: 1, education: 1, "interior design": 3, "how did you end up": 4 },
    responses: [
      "Art history is fundamentally about reading objects - understanding what a thing is communicating, to whom, and why it was made that way. That's UX design. The tools are different; the question is exactly the same.",
      "The clearest example: the AWS resiliency score showed users '13%' with no context. As a number, it's fine. As a communication artifact, it's saying 'we don't think you need to understand this.' That's a very art-history way to read a UI - and the research confirmed that's how users felt.",
      "MA in Art History from Leiden, then interior design, then UX. There are more direct routes into product design. I chose the scenic one - and it turns out reading how objects communicate to people is the whole job, just with a different set of objects.",
    ],
    followups: [
      "Walk me through AWS - good example of this lens",
      "Show me your career timeline",
      "What's your research approach?",
    ],
  },

  {
    id: "timeline",
    keywords: ["career", "timeline", "years", "where have you worked", "companies", "resume", "cv", "experience history", "previous jobs"],
    weights: { timeline: 3, career: 2, resume: 4, cv: 4, "years of experience": 3, "where have you worked": 4 },
    responses: [
      "Eight years in product design - enterprise B2B the whole way. AWS for two and a half years, Menora Insurance before that, Qlik now.",
      "The arc: military photographer → art history MA → interior design → UX architecture → senior product design. Each step built the same skill from a different angle.",
    ],
    toolCall: { tool: "showTimelineCard" },
    followups: [
      "Tell me more about the Amazon AWS work",
      "Show me the Qlik project",
      "What are you honest about not having yet?",
    ],
  },

  {
    id: "growth",
    keywords: ["honest", "gap", "weakness", "haven't done", "growth area", "not done", "missing", "what you lack", "don't have", "limitations"],
    weights: { honest: 3, gap: 2, weakness: 3, "haven't done": 4, "growth area": 4, "don't have": 3 },
    responses: [
      "No direct reports. I've led cross-functional work across four product teams at once, but I've never managed a designer's career. If that's a requirement for the role, better to name it early.",
      "Mobile-first consumer product is something I haven't owned end-to-end. The Menora work touched it - 400K monthly users - but the design constraints were enterprise-shaped even in a consumer context.",
      "I haven't shipped something that failed publicly. That sounds like a flex - it's actually a gap. I've never had to run a post-mortem on a feature that missed in production, and I'm curious what that teaches you that success doesn't.",
    ],
    followups: [
      "What makes you different from other senior designers?",
      "What would you do in your first 30 days?",
      "Show me your career timeline",
    ],
  },

  {
    id: "menora_impact",
    keywords: ["menora", "insurance company", "flagship project", "conversion rate", "insurance platform", "400k customers"],
    weights: { menora: 5, "flagship project": 4, "conversion rate": 4 },
    responses: [
      "Menora Insurance, before AWS - solo designer on their digital flagship project, serving 400K unique monthly customers.",
    ],
    toolCall: {
      tool: "showStatCard",
      toolArgs: {
        value: "95%",
        label: "Conversion rate on the Menora Insurance flagship project - solo designer, 400K monthly customers, millions of NIS in direct revenue impact.",
      },
    },
    followups: [
      "Show me your career timeline",
      "What would you do in your first 30 days?",
      "How can I get in touch?",
    ],
  },

  {
    id: "first30",
    keywords: ["first 30", "first 60", "first 90", "onboarding", "starting", "day one", "first weeks", "joining", "first month", "when you join"],
    weights: { "first 30": 5, "first 60": 4, "first 90": 4, "day one": 4, onboarding: 2, joining: 2, "first month": 4 },
    responses: [
      "I'd spend the first two weeks not designing anything. Map the product, understand where users get confused, talk to CS and support. Design artifacts start in week five - not before.",
      "Concretely: 4-5 user conversations in the first two weeks, not structured interviews - just conversations. Talk to CS, sales, support. Understand what the product is actually being used for before assuming I know what it should be.",
      "Too many designers show up and immediately start wireframing. You end up solving the wrong problem very confidently. The first month is for building a map I can trust.",
    ],
    followups: [
      "How do you approach research?",
      "How do you collaborate with PMs and engineers?",
      "What are you honest about not having yet?",
    ],
  },

  // ── SKILLS & TOOLS ──────────────────────────────────────────────────────

  {
    id: "skills",
    keywords: ["skills", "tools", "figma", "stack", "capabilities", "design tools", "software", "proficiency", "what do you use"],
    weights: { figma: 4, "design tools": 4, skills: 2, stack: 2, capabilities: 3, "what do you use": 4 },
    responses: [
      "Figma is home base. Beyond tools: longitudinal research, information architecture, interaction design, design systems. Domains: enterprise B2B, data infrastructure, cloud services, AI product interfaces.",
      "I'm comfortable in AWS CloudScape - their design system - which matters more than it sounds. Building to a mature design system with real constraints is a different skill from starting from scratch.",
    ],
    toolCall: { tool: "showSkillsMap" },
    followups: [
      "Tell me about your enterprise experience",
      "How do you approach design systems?",
      "Show me the Sprout component library work",
    ],
  },

  // ── EXPERIENCE ANGLES ─────────────────────────────────────────────────────

  {
    id: "enterprise",
    keywords: ["enterprise", "b2b", "complex", "expert users", "complexity", "large company", "corporate", "saas"],
    weights: { enterprise: 4, b2b: 4, "expert users": 4, complexity: 2, saas: 2 },
    responses: [
      "Eight years of enterprise B2B. Expert users with complex mental models, real constraints, and organizational politics that affect what 'simpler' even means. I'd say I specialize in this specifically.",
      "Enterprise is where 'just make it simpler' isn't an option. The complexity is real - the challenge is figuring out which complexity is inherent to the domain and which the product added unnecessarily.",
    ],
    followups: [
      "Show me the Qlik project - strong enterprise example",
      "Walk me through AWS Resilience Hub",
      "Can you do consumer product too?",
    ],
  },

  {
    id: "consumer",
    keywords: ["consumer", "b2c", "mobile", "everyday", "general user", "menora", "insurance", "non-enterprise"],
    weights: { consumer: 4, b2c: 4, menora: 5, insurance: 4, mobile: 2 },
    responses: [
      "The Menora work was consumer-facing - 400K monthly users, a conversion-rate product that directly affected revenue in NIS. Enterprise UX taught me complex hierarchies; Menora showed I can think in funnels and conversion too.",
      "Menora Insurance: solo designer, 400K unique monthly customers, 95% conversion on the digital flagship product. That one is not B2B.",
    ],
    followups: [
      "Show me your career timeline",
      "What makes you different from other senior designers?",
      "What are you honest about not having yet?",
    ],
  },

  {
    id: "collaboration",
    keywords: ["team", "collaborate", "engineer", "developer", "pm", "product manager", "stakeholder", "working with", "cross-functional", "handoff", "solo designer"],
    weights: { "cross-functional": 4, "solo designer": 4, collaboration: 2, engineer: 2, stakeholder: 2, handoff: 2 },
    responses: [
      "I can explain a design decision to an engineer, a PM, a CPO, and a skeptical user - and make it land differently for each of them without changing what I'm actually saying. That's the skill I'm most confident in.",
      "At AWS I was solo embedded in an engineering team. You learn fast that design credibility comes from showing your work - not just the output, but the thinking behind why you didn't do the other thing.",
      "The Qlik work involves coordinating across four product teams simultaneously. Solo designer doesn't mean lone wolf - it means you become very explicit about your thinking because there's no one to catch you if you skip a step.",
    ],
    followups: [
      "What would you do in your first 30 days?",
      "Walk me through the AWS work",
      "What makes you different from other senior designers?",
    ],
  },

  {
    id: "leadership",
    keywords: ["lead", "leadership", "manager", "management", "direct report", "mentor", "staff", "principal", "head of design"],
    weights: { "direct report": 5, "head of design": 5, manager: 4, leadership: 3, staff: 3, mentor: 2 },
    responses: [
      "I haven't had direct reports. I've led cross-functional initiatives - the Qlik study involves four product teams - but I haven't managed a design team. If that's a requirement, it's worth naming early.",
      "I'm targeting senior IC and staff-level roles, not management tracks. I lead through influence and expertise - not headcount.",
    ],
    followups: [
      "What are you honest about not having yet?",
      "How do you collaborate with teams?",
      "What would you do in your first 30 days?",
    ],
  },

  {
    id: "different",
    keywords: ["different", "unique", "stand out", "why you", "what makes you", "compared to", "better than", "value you bring"],
    weights: { different: 3, unique: 3, "stand out": 4, "why you": 5, "what makes you": 5, "value you bring": 4 },
    responses: [
      "I work at two levels at once - micro and macro. I think about edge cases seriously. And I can communicate: engineer, PM, CPO, user - same decision, landed differently for each.",
      "The art history background isn't a quirky detail. It's a literal lens I use daily: what is this design saying to the person looking at it? Not what does it show - what does it communicate? Those are different questions.",
      "Eight years solo or near-solo in enterprise. You develop a high bar for your own work when there's no one to catch you if you skip a step - and you get very good at explaining why.",
    ],
    followups: [
      "How does art history show up in your work?",
      "Show me the AWS work - good example",
      "What are you honest about not having yet?",
    ],
  },

  // ── AI & DESIGN ────────────────────────────────────────────────────────────

  {
    id: "ai_design",
    keywords: ["ai in design", "ai product", "ai ux", "ai tools", "ai feature", "machine learning", "llm", "artificial intelligence in"],
    weights: { "ai in design": 5, "ai product": 4, "ai ux": 5, "ai feature": 3, "machine learning": 3 },
    responses: [
      "My honest take: AI is most valuable in product design where the user is stuck in a loop they didn't choose - error states, onboarding, configuration complexity. Places where a human would normally give up or call support.",
      "I think a lot about trust calibration in AI interfaces - when should a user trust an AI suggestion and when should they verify it? That should be a deliberate design decision, not a default.",
      "'Add AI' is the new 'make it pop.' A brief, but not a problem statement. I want to know: what would the user have done without it, and is this version actually better - or just more impressive at a demo?",
    ],
    followups: [
      "Show me the Sprout 2.0 design system work",
      "What's your design process?",
    ],
  },

  // ── SMALL TALK ────────────────────────────────────────────────────────────

  {
    id: "greeting",
    keywords: ["hey", "hello", "how are you", "how's it going", "what's up", "howdy", "good morning", "good afternoon", "good evening", "yo,", "yo!", "yo "],
    weights: { hey: 5, hello: 5, "how are you": 6, "how's it going": 6, "what's up": 5, howdy: 5 },
    responses: [
      "Hey. I skip small talk faster than most humans - what do you actually want to know?",
      "Hello. I'm the version of a portfolio that talks back. Ask me something with a real answer attached.",
      "Doing fine, for a keyword matcher. More useful question: what are you actually trying to figure out about me?",
      "Hi there. I've got opinions on enterprise design, art history, and one AWS percentage that used to be wrong. Pick a direction.",
      "I'm well - thanks for asking a chat interface how it's doing. Genuinely though, what brought you here?",
    ],
    followups: [
      "Show me the AWS resiliency score redesign",
      "What makes you different from other designers?",
      "How can I get in touch?",
    ],
  },

  // ── EDGE CASES ────────────────────────────────────────────────────────────

  {
    id: "nda",
    keywords: ["nda", "confidential", "can't show", "what can you show", "non-disclosure", "restricted", "internal screens", "sensitive"],
    weights: { nda: 5, confidential: 4, "non-disclosure": 5, "can't show": 4, "what can you show": 5, restricted: 3 },
    responses: [
      "For Qlik specifically: the research process, design decisions, and what we learned are all fair game. I'm not showing internal screens because it's still in active development. In an interview I can go deeper.",
      "NDA work I talk about by explaining the thinking rather than showing artifacts. I've found that's usually more useful anyway - you see how someone thinks, not just what they produced.",
    ],
    toolCall: {
      tool: "showNDASafeNote",
      toolArgs: { context: "The Qlik project is under partial NDA - active development, not yet shipped. I can discuss research methodology, design decisions, and outcomes in full. Internal screens and specific metrics I'm keeping off the portfolio." },
    },
    followups: [
      "Show me what you can from the Qlik project",
      "Walk me through AWS - more I can show there",
      "What's actually shipped and public?",
    ],
  },

  {
    id: "shipped",
    keywords: ["shipped", "live", "production", "launched", "released", "can i see it", "publicly available", "in production"],
    weights: { shipped: 4, "publicly available": 5, "in production": 4, launched: 3, live: 2 },
    responses: [
      "The AWS resiliency score redesign is live on AWS today - you can see it in AWS Resilience Hub right now. The Menora conversion project is also shipped and in production. The Qlik work is in active development.",
      "Live in AWS Resilience Hub: the resiliency score dashboard - points format, action items tab, trend chart. That one you can go look at today. Menora is also shipped.",
    ],
    followups: [
      "Walk me through AWS Resilience Hub",
      "What did success look like on AWS?",
      "Show me the Qlik project",
    ],
  },

  {
    id: "contact",
    keywords: ["contact", "reach out", "email", "hire", "get in touch", "connect", "talk", "meeting", "apply", "how do i"],
    weights: { hire: 4, "get in touch": 5, contact: 3, email: 3, meeting: 3, apply: 3 },
    responses: [
      "Fastest way is my mobile: 050-6404745. Email works too - goldanielle@gmail.com - but I actually pick up the phone. Or keep asking here first, I can usually say more in conversation than the portfolio shows.",
      "Call or text is quickest: 050-6404745. Email if you'd rather - goldanielle@gmail.com. If you want to go deeper on a specific project before reaching out, ask here.",
    ],
    followups: [
      "What would you do in your first 30 days?",
      "What are you honest about not having yet?",
    ],
  },

  {
    id: "availability",
    keywords: ["available", "availability", "open to work", "looking for", "open to roles", "opportunity", "when can you start", "actively looking"],
    weights: { "open to work": 5, "looking for": 4, availability: 3, "when can you start": 5, "actively looking": 5, opportunity: 2 },
    responses: [
      "Currently at Qlik. Actively exploring what's next - Senior IC or Staff-level, ideally working on a product with real design complexity.",
      "Open to the right role - Senior IC or Staff-level, complex enterprise or AI tooling. Currently at Qlik and actively exploring.",
    ],
    followups: [
      "What makes you different from other senior designers?",
      "What would you do in your first 30 days?",
      "How can I contact you?",
    ],
  },

  {
    id: "remote",
    keywords: ["remote", "in-person", "hybrid", "location", "tel aviv", "israel", "relocate", "timezone", "where are you based"],
    weights: { remote: 3, "in-person": 3, "tel aviv": 4, israel: 4, relocate: 4, "where are you based": 5 },
    responses: [
      "Based in Tel Aviv. Open to remote or hybrid - most of my AWS work was done across US-East timezone, which I made work fine. Relocation is a conversation worth having if the role is the right fit.",
      "Tel Aviv-based. AWS involved regular coordination with US teams, so I'm comfortable across timezones. Remote is my default, relocation is a conversation.",
    ],
    followups: [
      "How can I contact you?",
      "What would you do in your first 30 days?",
    ],
  },

  {
    id: "salary",
    keywords: ["salary", "compensation", "pay", "rate", "package", "expectations", "how much", "what do you earn"],
    weights: { salary: 5, compensation: 5, "how much": 4, "what do you earn": 5, package: 3, rate: 2 },
    responses: [
      "That's a conversation for direct contact. goldanielle@gmail.com - I'll respond faster than a recruiter portal.",
      "Depends on role, scope, and location - happy to discuss over email. goldanielle@gmail.com. More useful than a number without context.",
    ],
    followups: [
      "How can I contact you?",
      "What would you do in your first 30 days?",
    ],
  },

  {
    id: "portfolio_meta",
    keywords: ["this website", "how is this built", "how does this work", "how did you make", "next.js", "no ai", "how does the chat work"],
    weights: { "this website": 5, "how is this built": 5, "how does this work": 5, "how did you make": 5, "next.js": 3, "how does the chat work": 5 },
    responses: [
      "Built in Next.js. The chat runs a local keyword-scoring system - no LLM calls, no hallucinations, no mysterious refusals. Every response is hand-written, which is technically the most labor-intensive way to avoid updating a LinkedIn profile.",
      "No AI behind this - it's a keyword scorer backed by hand-written response pools. Fast, honest about what it is, and will never confidently tell you something I didn't actually think through. Tradeoffs.",
    ],
    followups: [
      "Tell me about your Sprout design system work",
      "How do you approach AI in product design?",
      "Show me the AWS resiliency score redesign",
    ],
  },
];
