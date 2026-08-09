// Intent-matching response library. Add new intents here — no code change needed.

export type ToolName =
  | "showFrameCarousel"
  | "showCaseStudyCard"
  | "showSkillsMap"
  | "showTimelineCard"
  | "showNDASafeNote";

export type Intent = {
  id: string;
  keywords: string[];
  weights?: Record<string, number>;
  responses: string[];
  tool?: ToolName;
  toolArgs?: Record<string, unknown>;
  followups: string[];
};

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const fallbackResponses: string[] = [
  "I can cover the case studies, research approach, working style, or career background. What's most relevant to what you're evaluating?",
  "That's a bit outside what I can answer here — try asking about a specific project, how I work, or what I'd do in the first 30 days.",
  "Not quite landing for me — try rephrasing, or pick one of the prompts below and I'll run with it.",
  "Not sure I caught that. I can tell you about Qlik, AWS, my research process, or the art history angle — whichever is most relevant.",
  "I'm set up to answer questions about work, process, and background. What are you trying to figure out?",
  "I have opinions on most things design-related, but I'm blanking on that one. Try something in the chips below.",
];

export const fallbackFollowups: string[] = [
  "Show me the Qlik project",
  "Walk me through AWS Resilience Hub",
  "How do you approach research?",
  "Show me your career timeline",
  "What are you honest about not having yet?",
];

export const intents: Intent[] = [
  // ── CASE STUDIES ─────────────────────────────────────────────────────────

  {
    id: "qlik",
    keywords: ["qlik", "data catalog", "data connection", "data governance", "connections", "unified connections", "platform"],
    weights: { qlik: 4, "data catalog": 3, "data connection": 3, "data governance": 2, "unified connections": 4 },
    responses: [
      "Qlik is the most complex problem I've worked on — four product lines, no shared way to manage the same data connection. Here's the full story:",
      "The Qlik project starts with a question users were asking without knowing how to ask it: why do I have to connect to the same database three times?",
      "That project is where I learned that 'unify the experience' is easy to say and genuinely hard when the technical objects underneath aren't the same thing.",
    ],
    tool: "showFrameCarousel",
    toolArgs: { project: "qlik" },
    followups: [
      "What was the biggest friction at Qlik?",
      "How did you handle the NDA parts?",
      "Walk me through AWS next",
      "What would you do differently on Qlik?",
    ],
  },

  {
    id: "aws",
    keywords: ["aws", "amazon", "resilience hub", "resiliency", "resiliency score", "disaster recovery", "cloud resilience", "resilience"],
    weights: { aws: 4, amazon: 3, "resilience hub": 5, "resiliency score": 5, resiliency: 3, "resilience hub": 4 },
    responses: [
      "AWS Resilience Hub showed customers a number — 13% — and expected them to act on it. They didn't, because the number had nothing to say.",
      "The resiliency score problem was a trust problem before it was a UI problem. Walk through it here.",
      "That one's my clearest example of a design problem that looked like a display issue but was actually a communication problem — the score wasn't wrong, it just had nothing to say.",
    ],
    tool: "showFrameCarousel",
    toolArgs: { project: "aws" },
    followups: [
      "What did the redesign actually change?",
      "How did you measure success on AWS?",
      "Show me the Qlik project next",
      "Walk me through the Sprout work",
    ],
  },

  {
    id: "sprout",
    keywords: ["sprout", "component library", "design system", "figma library", "ai agent", "ai component", "design tokens"],
    weights: { sprout: 5, "component library": 3, "design system": 2, "ai agent": 3, "figma library": 3 },
    responses: [
      "Sprout AI needed a component library specifically for their agent's UI — so the whole team could build consistent interactions without solving the same problems independently.",
      "Design systems work is often invisible when it's working well. This one's about making sure the AI agent looks and feels like the same thing wherever it shows up in the product.",
      "The Sprout work is about removing myself from being the bottleneck — if I'm the only one who knows how the agent is supposed to behave, that doesn't scale.",
    ],
    tool: "showFrameCarousel",
    toolArgs: { project: "sprout" },
    followups: [
      "What components did you design?",
      "How does this relate to the AWS or Qlik work?",
      "Show me your full skills breakdown",
    ],
  },

  // ── PROCESS & METHODS ───────────────────────────────────────────────────

  {
    id: "research",
    keywords: ["research", "user research", "interview", "study", "testing", "longitudinal", "moderated", "usability", "discovery"],
    weights: { "user research": 3, longitudinal: 4, interview: 2, research: 2, discovery: 2 },
    responses: [
      "I default to talking to users earlier than most teams want me to — not structured interviews, just conversations where I listen for what surprises me.",
      "Research for me is less about proving a hypothesis and more about finding the thing I didn't know to ask. That usually happens in the second half of an interview, not the first.",
      "The Qlik study is probably the best example — five months, four user groups, two iteration cycles. The critical insight didn't come from a user question. It came from an engineer who joined one session.",
    ],
    followups: [
      "Show me the Qlik project — good example of this",
      "What's your process for synthesizing findings?",
      "How do you do research when you're solo?",
      "What would you do in your first 30 days?",
    ],
  },

  {
    id: "process",
    keywords: ["process", "workflow", "how do you work", "design process", "method", "approach", "wireframe", "prototype", "iteration", "how you design"],
    weights: { "design process": 4, "how do you work": 4, prototype: 2, wireframe: 2, iteration: 2, process: 2 },
    responses: [
      "Research before wireframes, always. Then get to a testable artifact as fast as possible — not a polished mockup, something that can fail in an interesting way. The interesting failures are where the real design decisions happen.",
      "I work at two levels simultaneously — the micro and the macro. I care about the interaction detail in front of me, and also constantly step back to ask how this specific decision serves the broader journey.",
      "I try to document decisions as I make them — so I can explain 'why this and not that' in a design review. The thing you didn't build is often as important as the thing you did.",
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
    keywords: ["art history", "background", "leiden", "education", "degree", "academic", "transition", "how did you get into", "art", "museum", "interior design"],
    weights: { "art history": 5, leiden: 4, museum: 2, background: 1, education: 1, "interior design": 3 },
    responses: [
      "Art history is fundamentally about reading objects — understanding what a thing is communicating, to whom, and why it was made that way. That's UX design. The tools are different; the question is exactly the same.",
      "The clearest example: the AWS resiliency score showed users '13%' with no context. As a number, it's fine. As a communication artifact, it's saying 'we don't think you need to understand this.' That's a very art-history way to read a UI — and the research confirmed that's how users felt.",
      "MA in Art History from Leiden, then interior design, then UX. There are more direct routes into product design. I chose the scenic one — and it turns out reading how objects communicate to people is the whole job, just with a different set of objects.",
    ],
    followups: [
      "How does this show up in your actual work?",
      "Walk me through AWS — good example of this lens",
      "Show me your career timeline",
      "What's your research approach?",
    ],
  },

  {
    id: "timeline",
    keywords: ["career", "timeline", "years", "where have you worked", "companies", "resume", "cv", "experience history", "previous jobs"],
    weights: { timeline: 3, career: 2, resume: 4, cv: 4, "years of experience": 3, "where have you worked": 4 },
    responses: [
      "Eight years in product design — enterprise B2B the whole way. AWS for two and a half years, Menora Insurance before that, Qlik now.",
      "The arc: military photographer → art history MA → interior design → UX architecture → senior product design. Each step built the same skill from a different angle.",
    ],
    tool: "showTimelineCard",
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
      "Mobile-first consumer product is something I haven't owned end-to-end. The Menora work touched it — 400K monthly users — but the design constraints were enterprise-shaped even in a consumer context.",
      "I haven't shipped something that failed publicly. That sounds like a flex — it's actually a gap. I've never had to run a post-mortem on a feature that missed in production, and I'm curious what that teaches you that success doesn't.",
    ],
    followups: [
      "What makes you different from other senior designers?",
      "What would you do in your first 30 days?",
      "Show me your career timeline",
    ],
  },

  {
    id: "first30",
    keywords: ["first 30", "first 60", "first 90", "onboarding", "starting", "day one", "first weeks", "joining", "first month", "when you join"],
    weights: { "first 30": 5, "first 60": 4, "first 90": 4, "day one": 4, onboarding: 2, joining: 2, "first month": 4 },
    responses: [
      "I'd spend the first two weeks not designing anything. Map the product, understand where users get confused, talk to CS and support. Design artifacts start in week five — not before.",
      "Concretely: 4-5 user conversations in the first two weeks, not structured interviews — just conversations. Talk to CS, sales, support. Understand what the product is actually being used for before assuming I know what it should be.",
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
      "I'm comfortable in AWS CloudScape — their design system — which matters more than it sounds. Building to a mature design system with real constraints is a different skill from starting from scratch.",
    ],
    tool: "showSkillsMap",
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
      "Enterprise is where 'just make it simpler' isn't an option. The complexity is real — the challenge is figuring out which complexity is inherent to the domain and which the product added unnecessarily.",
    ],
    followups: [
      "Show me the Qlik project — strong enterprise example",
      "Walk me through AWS Resilience Hub",
      "Can you do consumer product too?",
    ],
  },

  {
    id: "consumer",
    keywords: ["consumer", "b2c", "mobile", "everyday", "general user", "menora", "insurance", "non-enterprise"],
    weights: { consumer: 4, b2c: 4, menora: 5, insurance: 4, mobile: 2 },
    responses: [
      "The Menora work was consumer-facing — 400K monthly users, a conversion-rate product that directly affected revenue in NIS. Enterprise UX taught me complex hierarchies; Menora showed I can think in funnels and conversion too.",
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
      "I can explain a design decision to an engineer, a PM, a CPO, and a skeptical user — and make it land differently for each of them without changing what I'm actually saying. That's the skill I'm most confident in.",
      "At AWS I was solo embedded in an engineering team. You learn fast that design credibility comes from showing your work — not just the output, but the thinking behind why you didn't do the other thing.",
      "The Qlik work involves coordinating across four product teams simultaneously. Solo designer doesn't mean lone wolf — it means you become very explicit about your thinking because there's no one to catch you if you skip a step.",
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
      "I haven't had direct reports. I've led cross-functional initiatives — the Qlik study involves four product teams — but I haven't managed a design team. If that's a requirement, it's worth naming early.",
      "I'm targeting senior IC and staff-level roles, not management tracks. I lead through influence and expertise — not headcount.",
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
      "I work at two levels at once — micro and macro. I think about edge cases seriously. And I can communicate: engineer, PM, CPO, user — same decision, landed differently for each.",
      "The art history background isn't a quirky detail. It's a literal lens I use daily: what is this design saying to the person looking at it? Not what does it show — what does it communicate? Those are different questions.",
      "Eight years solo or near-solo in enterprise. You develop a high bar for your own work when there's no one to catch you if you skip a step — and you get very good at explaining why.",
    ],
    followups: [
      "How does art history show up in your work?",
      "Show me the AWS work — good example",
      "What are you honest about not having yet?",
    ],
  },

  // ── AI & DESIGN ────────────────────────────────────────────────────────────

  {
    id: "ai_design",
    keywords: ["ai in design", "ai product", "ai ux", "ai tools", "ai feature", "machine learning", "llm", "artificial intelligence in"],
    weights: { "ai in design": 5, "ai product": 4, "ai ux": 5, "ai feature": 3, "machine learning": 3 },
    responses: [
      "My honest take: AI is most valuable in product design where the user is stuck in a loop they didn't choose — error states, onboarding, configuration complexity. Places where a human would normally give up or call support.",
      "I think a lot about trust calibration in AI interfaces — when should a user trust an AI suggestion and when should they verify it? That should be a deliberate design decision, not a default.",
      "'Add AI' is the new 'make it pop.' A brief, but not a problem statement. I want to know: what would the user have done without it, and is this version actually better — or just more impressive at a demo?",
    ],
    followups: [
      "Show me the Sprout AI component library",
      "How does this show up in your actual work?",
      "What's your design process?",
    ],
  },

  // ── EDGE CASES ────────────────────────────────────────────────────────────

  {
    id: "nda",
    keywords: ["nda", "confidential", "can't show", "what can you show", "non-disclosure", "restricted", "internal screens", "sensitive"],
    weights: { nda: 5, confidential: 4, "non-disclosure": 5, "can't show": 4, "what can you show": 5, restricted: 3 },
    responses: [
      "For Qlik specifically: the research process, design decisions, and what we learned are all fair game. I'm not showing internal screens because it's still in active development. In an interview I can go deeper.",
      "NDA work I talk about by explaining the thinking rather than showing artifacts. I've found that's usually more useful anyway — you see how someone thinks, not just what they produced.",
    ],
    tool: "showNDASafeNote",
    toolArgs: { context: "The Qlik project is under partial NDA — active development, not yet shipped. I can discuss research methodology, design decisions, and outcomes in full. Internal screens and specific metrics I'm keeping off the portfolio." },
    followups: [
      "Show me what you can from the Qlik project",
      "Walk me through AWS — more I can show there",
      "How do you handle NDA work in interviews?",
    ],
  },

  {
    id: "shipped",
    keywords: ["shipped", "live", "production", "launched", "released", "can i see it", "publicly available", "in production"],
    weights: { shipped: 4, "publicly available": 5, "in production": 4, launched: 3, live: 2 },
    responses: [
      "The AWS resiliency score redesign is live on AWS today — you can see it in AWS Resilience Hub right now. The Menora conversion project is also shipped and in production. The Qlik work is in active development.",
      "Live in AWS Resilience Hub: the resiliency score dashboard — points format, action items tab, trend chart. That one you can go look at today. Menora is also shipped.",
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
      "goldanielle@gmail.com — I respond faster than a recruiter portal. Or keep asking here and I can go deeper than a CV would.",
      "Best way to reach me is goldanielle@gmail.com. If you want to go deeper on a specific project first, ask here — I can usually say more in conversation than the portfolio shows.",
    ],
    followups: [
      "What roles are you open to?",
      "What would you do in your first 30 days?",
      "What are you honest about not having yet?",
    ],
  },

  {
    id: "availability",
    keywords: ["available", "availability", "open to work", "looking for", "open to roles", "opportunity", "when can you start", "actively looking"],
    weights: { "open to work": 5, "looking for": 4, availability: 3, "when can you start": 5, "actively looking": 5, opportunity: 2 },
    responses: [
      "Currently at Qlik. Actively exploring what's next — Senior IC or Staff-level, ideally working on a product with real design complexity.",
      "Open to the right role — Senior IC or Staff-level, complex enterprise or AI tooling. Currently at Qlik and actively exploring.",
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
      "Based in Tel Aviv. Open to remote or hybrid — most of my AWS work was done across US-East timezone, which I made work fine. Relocation is a conversation worth having if the role is the right fit.",
      "Tel Aviv-based. AWS involved regular coordination with US teams, so I'm comfortable across timezones. Remote is my default, relocation is a conversation.",
    ],
    followups: [
      "What roles are you open to?",
      "How can I contact you?",
    ],
  },

  {
    id: "salary",
    keywords: ["salary", "compensation", "pay", "rate", "package", "expectations", "how much", "what do you earn"],
    weights: { salary: 5, compensation: 5, "how much": 4, "what do you earn": 5, package: 3, rate: 2 },
    responses: [
      "That's a conversation for direct contact. goldanielle@gmail.com — I'll respond faster than a recruiter portal.",
      "Depends on role, scope, and location — happy to discuss over email. goldanielle@gmail.com. More useful than a number without context.",
    ],
    followups: [
      "What roles are you open to?",
      "How can I contact you?",
    ],
  },

  {
    id: "portfolio_meta",
    keywords: ["this website", "how is this built", "how does this work", "how did you make", "next.js", "no ai", "how does the chat work"],
    weights: { "this website": 5, "how is this built": 5, "how does this work": 5, "how did you make": 5, "next.js": 3, "how does the chat work": 5 },
    responses: [
      "Built in Next.js. The chat runs a local keyword-scoring system — no LLM calls, no hallucinations, no mysterious refusals. Every response is hand-written, which is technically the most labor-intensive way to avoid updating a LinkedIn profile.",
      "No AI behind this — it's a keyword scorer backed by hand-written response pools. Fast, honest about what it is, and will never confidently tell you something I didn't actually think through. Tradeoffs.",
    ],
    followups: [
      "Tell me about your Sprout design system work",
      "How do you approach AI in product design?",
      "Show me the case studies",
    ],
  },
];
