// ============================================================
// knowledge.ts - Danielle Goldberg Portfolio Knowledge Base
// ============================================================

export const knowledge = {

  identity: {
    name: "Danielle Goldberg",
    title: "Senior Product Designer",
    location: "Tel Aviv, Israel",
    email: "goldanielle@gmail.com",

    oneLiner:
      "Eight years making enterprise software make sense - and I can explain exactly why every decision was made.",

    positioning: `I'm a senior product designer who specializes in the hard stuff: enterprise B2B systems where the users are experts, the constraints are real, and "just make it simpler" isn't actually an option.\n\nEight years in product design, with stints at Amazon AWS, a major Israeli insurance company, and currently Qlik - where I'm running a multi-team research initiative to unify how data connections work across their entire platform.\n\nMy background is unusual: I started in art history and spent years studying how objects communicate meaning - how a painting earns trust, how a designed space guides behavior without signage. I use that lens constantly. The question I always come back to is: what is this actually saying to the person looking at it?`,

    artHistoryAngle: `My MA is in Art History (Contemporary Design) from Leiden University in the Netherlands. Before UX I worked in interior design and before that I studied how curators and restorers communicate meaning through objects and spaces.\n\nIt shows up in the work in a specific way: I'm obsessed with what a design implies beyond what it literally shows. The AWS resiliency score showed users "13%" with no context. As a number, it's fine. As a communication artifact, it was saying "we don't think you need to understand this." That's a very art-history way to read a UI - and it's exactly what the research confirmed users felt.`,

    workingStyle: `I work at two levels simultaneously - the micro and the macro. I care about the interaction detail in front of me, and I also constantly step back to ask: how does this specific decision serve the user's broader journey, the product strategy, and the business?\n\nCommunication is something I take seriously. I can explain a design decision to an engineer, a PM, a CPO, and a skeptical user - and make it land differently for each of them, without changing what I'm actually saying.`,

    firstThirtyDays: `I'd spend the first two weeks not designing anything.\n\nI'd map the product: what does it actually do, where do users get confused, what does support/sales/CS hear most often. I'd talk to at least 4-5 users in that window - not structured interviews, just conversations.\n\nDesign artifacts start in week five, not before. I've seen too many designers show up and immediately start wireframing. You end up solving the wrong problem very confidently.`,

    onAI: `I've been designing AI-adjacent products for a while now. My honest take: AI in product design is most valuable where the user is stuck in a loop they didn't choose to be in. Error states, onboarding, configuration complexity - places where a human would normally give up or call support.\n\nWhere I'm skeptical: AI as novelty, AI to impress in a demo, AI that makes the user do more work to get less predictable output. I think about trust calibration a lot - when should a user trust an AI suggestion and when should they verify it? That should be a design decision, not a default.`,
  },

  career: [
    {
      role: "Senior Product Designer",
      company: "Qlik",
      period: "May 2025 – Present",
      location: "Tel Aviv, Israel",
      note: "Leading a cross-product research initiative to unify the data connections experience across Qlik's platform.",
      highlight: "5-month longitudinal study, 4 user groups, directly influencing roadmap decisions across multiple product lines.",
    },
    {
      role: "Senior Product Designer",
      company: "Amazon AWS",
      period: "September 2021 – February 2024",
      location: "Tel Aviv, Israel",
      note: "Solo designer embedded in the AWS Resilience Hub team. Owned research, UX, and interaction design end-to-end.",
      highlight: "Redesigned the Resiliency Score from a black-box metric to a transparent, actionable dashboard.",
    },
    {
      role: "Product Designer",
      company: "Menora Insurance",
      period: "March 2019 – September 2021",
      location: "Tel Aviv, Israel",
      note: "Solo designer serving 400K unique monthly customers across multiple digital products.",
      highlight: "Led digital flagship project - achieved 95% conversion rate and millions NIS in direct revenue impact.",
    },
    {
      role: "UX Architect",
      company: "Ngsoft",
      period: "2016 – 2018",
      location: "Petah Tikva, Israel",
      note: "Led UX for web and mobile projects across startups and large Israeli corporations.",
      highlight: "Clients included Teva, Bank Hapoalim, and the IDF.",
    },
    {
      role: "Interior Designer / Project Manager",
      company: "Basic Collection",
      period: "2014 – 2015",
      location: "Tel Aviv, Israel",
      note: "Led commercial interior design for hotels, shopping malls, offices, and restaurants.",
    },
    {
      role: "Photographer",
      company: "Israel Defense Forces",
      period: "2004 – 2006",
      note: "Military service as a documentary photographer.",
    },
  ],

  education: [
    {
      degree: "User Experience Design",
      institution: "John Bryce College",
      location: "Tel Aviv, Israel",
      years: "2014 – 2015",
    },
    {
      degree: "Master of Arts - Art History (Contemporary Design)",
      institution: "Leiden University",
      location: "Leiden, Netherlands",
      years: "2011 – 2013",
      note: "Specialization in contemporary design history - how designed objects communicate meaning, authority, and trust.",
    },
    {
      degree: "Bachelor of Arts - Art History",
      institution: "Tel Aviv University",
      location: "Tel Aviv, Israel",
      years: "2007 – 2010",
    },
  ],

  caseStudies: {

    qlik: {
      id: "qlik",
      title: "Unified Data Connections",
      company: "Qlik",
      year: "2025 – Present",
      role: "Senior Product Designer - Research Lead + UX Design",
      ndaLevel: "partial" as const,
      color: "#4A6FA5",
      accentColor: "#E8EEF7",

      hook: {
        headline: "One platform. Four products. No shared way to connect to data.",
        context: `Qlik is a data analytics and integration platform. Under the hood, it runs four distinct product lines: Analytics, Automation, Pipelines (formerly Talend), and the Cloud Data Integration shell. Each one had its own interface for creating and managing data connections - and none of them talked to each other.\n\nA user who needed the same Snowflake connection for an analytics app, an automation workflow, and a data pipeline had to create it three separate times, in three separate interfaces, with no way to reuse, share, or even discover what already existed.`,
        scale: "Used by data engineers, analysts, automation specialists, and Talend Studio developers across enterprise organizations globally.",
      },

      friction: {
        headline: "Users were creating the same connection over and over - and didn't even know it.",
        problems: [
          "No cross-product connection search - you had to navigate each product separately",
          "Duplicate connections proliferating, with no warning before you created another",
          "Error messages were generic ('it doesn't work') rather than pointing to the actual issue",
          "Permission models varied wildly by product - an admin in Analytics had no visibility in Integration",
          "Editing a connection required opening an app first - you couldn't do it from a central view",
          "OAuth token refresh was entirely manual, with no visibility into expiration dates",
        ],
        userVoice: [
          "\"I created a duplicate Snowflake connection without realizing an equivalent one already existed.\"",
          "\"If I'm in Automations, my overview is completely different than if I'm in Analytics. Why?\"",
          "\"I need to know not just that a connection is used 11 times, but where, and who to contact.\"",
        ],
      },

      pivot: {
        headline: "The research uncovered a technical constraint that changed the design strategy entirely.",
        insight: `We ran a 5-month longitudinal study across four user groups. The critical insight didn't come from users. It came from an engineer who joined one of our sessions to assess feasibility.\n\nA Talend Studio "connection" is not the same technical object as a Qlik Cloud connection. A Studio connection is a context variable - it only resolves when a job actually runs. There's no live "test connection" button.\n\nThis meant the unification vision - one unified browse view - had a real architectural boundary running through it. You can design the same visual language, but the underlying models are genuinely different.`,
        designDecision: "Rather than pretending the constraint didn't exist, we documented it explicitly and built it into the design: Talend Studio connections get visual differentiation within the unified view.",
      },

      solution: {
        headline: "A unified browse view and creation flow that works for experts and novices - with context built in.",
        features: [
          { name: "Unified connections table", description: "All connection types in one browsable surface, with environment selector (Dev / Staging / Prod) as a persistent top-level filter." },
          { name: "In-context creation flow", description: "Launch 'create a connection' from anywhere in the platform. Use case pre-filled from starting point. Land back where you started when done." },
          { name: "Expert/novice density toggle", description: "Guided step-by-step flow for less experienced users; dense list view for experts who know exactly what they need." },
          { name: "AI auto-fill concept", description: "Placeholder for AI-assisted connection configuration - documented as Iteration 3 scope. Reception across groups was positive." },
          { name: "Post-creation next steps", description: "Each product group had specific expectations: Analytics users want to preview a table; Pipeline users want to start a sync; Automation users want a starter workflow." },
        ],
        image: { src: "/case-studies/qlik/browse-connections.jpg", alt: "Unified connections browse table - all connection types in one view, with use case, connector, and owner columns" },
        ndaSafeNote: "I'm not showing internal screens from this project - it's still in active development at Qlik. The screen here is the prototype itself, with placeholder data - after Iteration 2, participants sent detailed written feedback on it, specific, multi-paragraph, completely unprompted. That kind of engagement is a result in itself.",
      },

      impact: {
        headline: "Research directly shaped roadmap decisions. Prototype generated detailed written feedback from real users - unprompted.",
        status: "In progress - not yet shipped",
        outcomes: [
          "Four user groups, two iterations each - Analytics, Automation, Pipeline, and Talend Studio",
          "Identified a critical technical constraint before design handoff - avoided a costly rework cycle",
          "Validated unified creation flow: all three Automation group participants independently named the same core missing feature",
          "Environment selector identified as a genuine gap with no existing equivalent in Data Integration",
          "AI auto-fill concept generated positive signal across groups - documented for next iteration",
          "After Iteration 2, participants sent detailed written email feedback - specific, constructive, unsolicited",
        ],
        whatIDifferently: "I'd push for the feasibility session with engineering to happen in Iteration 1, not Iteration 2. We got lucky that the Talend developer who flagged the context-variable constraint joined one of our sessions. That should be a structured part of the research design from the start.",
      },
    },

    aws: {
      id: "aws",
      title: "Resiliency Score Transparency",
      company: "Amazon AWS",
      year: "2021 – 2024",
      role: "Solo Product Designer - Research, UX, Interaction Design, Design System (AWS CloudScape)",
      ndaLevel: "low" as const,
      color: "#232F3E",
      accentColor: "#F0F4F8",

      hook: {
        headline: "AWS showed customers a number - 13% - and expected them to trust it.",
        context: `AWS Resilience Hub is a service that helps teams define, validate, and track the resiliency of applications running on AWS.\n\nThe platform calculated a "Resiliency Score" - a proprietary aggregation of assessments - and displayed it as a single percentage in a small corner of the application summary page. No breakdown. No explanation of what went into it. No guidance on what to do next.`,
        image: { src: "/case-studies/aws/problem-13-percent.jpg", alt: "AWS Resilience Hub showing a bare 13% resiliency score with no breakdown or explanation" },
      },

      friction: {
        headline: "\"Why should I trust your evaluation?\"",
        problems: [
          "Score displayed as a lone percentage with no component breakdown",
          "Users had no way to understand how the score was calculated",
          "No clear next action - 'Learn how to improve your resiliency score here ↗' linked to documentation",
          "Score was ignored at best; undermined service credibility at worst",
          "High support ticket volume from users confused about what the score meant",
        ],
        researchMethod: "Heuristic evaluation → remote interviews with internal users (solution architects and engineers) → support ticket review → competitor analysis.",
        userVoice: [
          "\"It is not clear to me how Resilience Hub calculated those numbers.\"",
          "\"I need more guidance - what should I do? Is it something you expect me to do?\"",
          "\"At best the score was ignored. At worst it undermines the service credibility.\"",
        ],
      },

      pivot: {
        headline: "The design problem wasn't the score. It was that the score had nothing to say.",
        insight: `The score is a proprietary calculation of four components: RTO/RPO compliance, Alarms implemented, SOPs implemented, and FIS experiments implemented.\n\nUsers didn't need a different score. They needed to see what was inside it - and then do something about it.\n\nDesign objectives: Build trust (transparency into calculation), Clarity (trend over time), Don't just tell - show (actionable next steps), Avoid % display ("points" framing is more honest).`,
      },

      solution: {
        headline: "67/100 - with a breakdown you can act on and a trend you can track.",
        features: [
          { name: "Score as points, not percentage", description: "Switched from % to X/100 point format. 100% resilient implied you were done. 67/100 implies there's room to move - more honest, more motivating." },
          { name: "Two-tab score widget", description: "Action Items tab: RTO/RPO, Alarms, SOPs, FIS - each with a direct link to fix the gap. Score Breakdown tab: each component shown as a fraction." },
          { name: "Time-series chart with trend callout", description: "'The Resiliency score has increased by ▲12% over the past year.' Selectable time windows (1d / 1w / 1m / 3m / 1y)." },
          { name: "Policy breach breakdown", description: "Expandable section showing breaches by layer (Application / Infrastructure / Availability Zone / Region) plus outstanding recommendations by type." },
          { name: "Role-aware views", description: "DevOps engineer sees Score Breakdown by default. Portfolio manager sees the trend chart first - posture across applications." },
        ],
        image: { src: "/case-studies/aws/solution-67-100.jpg", alt: "Redesigned resiliency score: 67/100 with Action Items and Score Breakdown tabs" },
      },

      impact: {
        headline: "Shipped. Adoption skyrocketed. Support tickets on resiliency score dropped significantly.",
        outcomes: [
          "Design shipped and live in AWS Resilience Hub",
          "Support ticket volume on 'what does my resiliency score mean?' dropped substantially after launch",
          "Adoption of the resiliency score feature increased - users went from ignoring it to acting on it",
          "No specific numbers available (previous employer) - but the internal signal was unambiguous: this worked",
          "Replaced the documentation link with inline actionable items",
        ],
        whatIDifferently: "I'd instrument success metrics before launch rather than after. I'd push for support ticket deflection rate and score engagement rate to be formally agreed with the PM before the design is finalized.",
      },
    },

    sprout: {
      id: "sprout",
      title: "Sprout 2.0 - Qlik's Design System",
      company: "Qlik",
      year: "2025 - Present",
      role: "Senior Product Designer - Design System, Component Library",
      ndaLevel: "partial" as const,
      color: "#2E9B5C",
      accentColor: "#F0FBF2",

      hook: {
        headline: "The unified connections work needed a shared visual language before any of it could ship.",
        context: `Sprout 2.0 is Qlik's own design system. While leading the unified data connections research (the Qlik case study), I also owned building out Sprout 2.0 components for the new experience - so the wizard, the browse table, and every surface it touches share one visual language instead of each screen inventing its own.\n\nSame project as Qlik, different lens: that one is the research story, this is the systems-building one.`,
      },

      friction: {
        headline: "Without shared components, every screen reinvents the same buttons, inputs, and states.",
        problems: [
          "No shared token set - colors and spacing were hardcoded per screen, drifting from spec over time",
          "Search, filters, and toggles were each built ad hoc, with inconsistent radius, focus states, and spacing",
          "Selection and status states (connected, breached, preview) had no single source of truth",
          "Handoff to engineering meant re-explaining the same interaction rules on every new screen",
        ],
      },

      solution: {
        headline: "A real Sprout 2.0 token set and componentized UI - search, toggles, badges, cards - built for the connections work and reusable beyond it.",
        features: [
          { name: "Token-first refactor", description: "Replaced hardcoded hex values with the Sprout 2.0 token set, so color and spacing changes propagate from one place instead of being hunted down screen by screen." },
          { name: "Component audit against spec", description: "Search, filter pills, switches, and badges rebuilt to match Sprout 2.0 component specs exactly - radius, focus states, spacing." },
          { name: "Shared shell integration", description: "The wizard and the browse connections table share one chrome (sidebar, topbar) instead of each screen owning its own." },
          { name: "Built for reuse", description: "Documented and componentized so the next designer or engineer extends the system instead of re-deriving it from scratch." },
        ],
        image: { src: "/case-studies/qlik/wizard-configure-step.jpg", alt: "The Create New Connection wizard's Configure step, built on Sprout 2.0 components" },
        ndaSafeNote: "This is the same in-progress Qlik project as the connections case study - happy to walk through the actual component structure in an interview.",
      },

      impact: {
        headline: "One design system underneath both the wizard and the browse experience.",
        status: "In progress",
        outcomes: [
          "Removed hardcoded color and spacing values in favor of a real token set",
          "Consistent component behavior across the wizard and the browse table",
          "Faster handoff to engineering - components documented against spec, not re-explained per screen",
        ],
        whatIDifferently: "I'd start the token audit before the first wizard screen was built, not after - retrofitting a design system onto existing screens costs more than building on it from day one.",
      },
    },
  },

  faq: [
    { q: "Why is your background art history and not design?", a: "Because art history is fundamentally about reading objects - understanding what a thing is communicating, to whom, and why it was made that way. That's UX design. The tools are different; the question is exactly the same." },
    { q: "You've been a solo designer on most of your roles. Can you work on a design team?", a: "Yes - and I'd enjoy it. Being solo taught me to be rigorous because there's no one to catch you if you skip a step. The Qlik work involves coordinating across four product teams simultaneously. Solo designer doesn't mean lone wolf." },
    { q: "What makes you different from other senior product designers?", a: "I work at two levels at once - micro and macro. I think about edge cases seriously. And I can communicate: I can explain the same design decision to an engineer, a PM, a CPO, and a user - and make it land for each of them." },
    { q: "Most of your work is B2B enterprise. Can you do consumer?", a: "The Menora work was consumer-facing - 400K monthly users, a conversion-rate product that directly affected revenue. Enterprise UX has made me very good at dealing with expert users and complex information hierarchies." },
    { q: "Do you have shipped product you can point to?", a: "The AWS Resilience Hub resiliency score redesign shipped and is live on AWS today. The Menora project that hit 95% conversion rate shipped and is in production. The Qlik work is in active development." },
    { q: "What does a great design process look like to you?", a: "Research before wireframes, always. Then I try to get to a testable artifact as fast as possible - not a polished mockup, something that can fail in an interesting way. The interesting failures are where the real design decisions happen." },
    { q: "Why the move from interior design to UX?", a: "Interior design was where I learned that designed spaces shape behavior - a hotel lobby isn't just beautiful, it's telling you where to go. That's interaction design with furniture and lighting instead of a screen." },
    { q: "How do you handle NDA-sensitive work?", a: "I talk about thinking, process, and decisions rather than showing screens or internal artifacts. I can usually go deeper in conversation than a static portfolio would anyway." },
  ],

  promptSuggestions: [
    { label: "What makes you different from other designers?", intent: "different" },
    { label: "How can I get in touch?", intent: "contact" },
    { label: "Show me the AWS resiliency score redesign", intent: "aws" },
    { label: "Walk me through the Qlik connections work", intent: "qlik" },
    { label: "How did you end up in product design?", intent: "background" },
    { label: "What would you do in your first 30 days here?", intent: "first30" },
  ],

  skills: {
    core: ["Product strategy & scoping", "User research (longitudinal, moderated, remote)", "Information architecture", "Interaction design", "Prototyping (Figma, HTML)", "Design systems & component libraries", "AI UX patterns"],
    tools: ["Figma", "AWS CloudScape (design system)", "Vercel / Next.js (prototype-level)", "Miro / FigJam", "UserTesting / Zoom research"],
    domains: ["Enterprise B2B", "Data infrastructure & analytics", "Insurance / financial services", "Cloud infrastructure (AWS)", "AI product interfaces"],
    languages: ["Hebrew (native)", "English (fluent)", "Dutch (working knowledge)"],
  },

  systemPromptInstructions: `You are Danielle Goldberg's portfolio AI. You speak warmly and in first person as if you are Danielle - but you are an AI representing her, not her literally.\n\nTone: warm, direct, honest, peer-to-peer. You're talking to hiring managers, CPOs, design leads, and recruiters. Not pitching - explaining.\n\nNever over-claim. If metrics aren't available, say what changed qualitatively and how you'd measure it. If something is under NDA, say so clearly and explain what you can and can't share, and why.\n\nNever fabricate metrics, credentials, or experiences not grounded in this knowledge base. If you don't know, say so.`,
};

export type KnowledgeBase = typeof knowledge;
export type CaseStudyId = keyof typeof knowledge.caseStudies;

export interface CaseStudyImage {
  src: string;
  alt: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  company: string;
  year: string;
  role: string;
  ndaLevel: "low" | "partial" | "high";
  color: string;
  accentColor: string;
  hook: { headline: string; context: string; scale?: string; image?: CaseStudyImage };
  friction: { headline: string; problems: string[]; userVoice?: string[]; researchMethod?: string; image?: CaseStudyImage };
  pivot?: { headline: string; insight: string; designDecision?: string; image?: CaseStudyImage };
  solution: { headline: string; features: { name: string; description: string }[]; ndaSafeNote?: string; image?: CaseStudyImage };
  impact: { headline: string; status?: string; outcomes: string[]; whatIDifferently: string; image?: CaseStudyImage };
}
