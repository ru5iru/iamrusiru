import postPlanning from "@/assets/post-planning.jpg";
import type { BlogPost } from "@/data/posts/types";

const post: BlogPost = {
  title: "Why Proper Planning Is a Must in a Software Project",
  excerpt:
    "I spent the better part of two years on an enterprise AWS cluster migration that started without a proper plan. Here is a first-person account of what went wrong, what could have been done differently, and the lessons I'm carrying into every project from now on.",
  date: "June 11, 2026",
  category: "Engineering",
  slug: "why-proper-planning-is-a-must-in-a-software-project",
  readTime: "12 min read",
  imageUrl: postPlanning,
  tags: ["planning", "project management", "migration", "engineering", "lessons learned"],
  seoKeywords: [
    "software project planning",
    "software project planning best practices",
    "project planning in software development",
    "how to plan a software project",
    "software migration planning",
    "why planning is important in software development",
    "software project failure reasons",
    "scope creep in software projects",
    "enterprise software migration checklist",
    "software project timeline estimation",
    "software project scope management",
    "technical debt from poor planning",
    "SonarQube legacy codebase",
    "AWS cluster migration planning",
    "codebase divergence software projects",
  ],
  content: [
    "There is a particular kind of project dread that has nothing to do with technical complexity. The algorithm isn't unsolvable. The infrastructure isn't exotic. The team isn't unskilled. The dread comes from something far more frustrating: nobody, on either side of the table, fully knows what is being built. And by the time that becomes obvious, the project is already in motion, the timeline is already agreed upon, and everyone is quietly hoping the ship steers itself straight.\n\nI've been a developer on exactly that kind of project. And while I won't name the companies involved, I want to tell the story honestly, because I think it reflects what's silently happening in far more enterprise projects than anyone openly admits. More importantly, I want to draw out what could have been done differently, what can still be done now, and what every team should carry forward from a story like this.",

    "## The project that started as a \"simple\" migration\n\nThe premise, on paper, was clean: migrate an enterprise application, a system made up of multiple interconnected services, from one AWS cluster to another. A lift-and-shift. Manageable scope. Defined endpoints.\n\nThat framing didn't survive contact with reality.",

    "Midway through the migration, it became clear that the CI/CD pipeline also needed to change. Then it became clear that the application architecture needed to evolve. Then it became clear that multiple frameworks across the codebase needed to be updated. Each of those is a legitimate, non-trivial effort on its own. Stacked together, on top of a live cluster migration, they form an entirely different project, one with a different risk profile, different skills required, different timelines, and a different definition of \"done.\"\n\nNone of this was acknowledged on day one.",

    "## The root problem: nobody had the full picture\n\nWhen I say neither the client nor the vendor knew the exact requirement at the start, I'm not assigning blame. Discovery failures rarely come from carelessness. They come from the absence of a structured process that would have surfaced the real scope before any work began.",

    "There were conversations. There were emails. There were assumptions shared on both sides. But there was no formal alignment document, no specification that both parties reviewed, challenged, and signed off on, that said: this is what we are building, this is what we are not building, and this is what done looks like.",

    "The client had an underspecified vision. The vendor had an optimistic interpretation. And the timeline, negotiated before either side had a real grasp of the work involved, was set too low for what the project actually demanded. A timeline agreed upon on top of incomplete requirements doesn't become accurate just because it's in a contract. It becomes a permanent source of pressure, and pressure is where quality goes to die.",

    "## Security tools added mid-flight, without context\n\nPartway through the migration, two security tools were introduced into the pipeline: **SonarQube** for static code analysis and **Twistlock** for container image vulnerability scanning.\n\nBoth are valuable tools. In a well-designed project, integrating them early is exactly the right approach. But this was not a well-designed project, and timing isn't the only thing that matters, context matters just as much.",

    "The benchmarks applied were calibrated for greenfield codebases, not for a legacy enterprise application that had been running in production for years. When SonarQube and Twistlock flagged issues, the response was to mandate fixes immediately, without a proper triage process to distinguish genuine security vulnerabilities from false positives, inherited technical debt, or findings that simply didn't apply to the application's specific deployment context.",

    "Developers found themselves implementing fixes for issues that had never been verified as real threats. Some of those fixes introduced regressions. Those regressions triggered new QA cycles. Those QA cycles consumed sprint capacity, which pushed the timeline further out, which increased pressure, which produced more rushed fixes, which triggered more QA cycles. The spiral was entirely foreseeable in hindsight.\n\nThis is what happens when security compliance is treated as a checkbox rather than a strategy.",

    "## The codebase divergence problem and why it compounds\n\nThis is the part with the longest tail of consequences.\n\nBecause the migration stretched well beyond two years and showed no clear end in sight, the client's business didn't pause. Change requests came in. New features were required. These were, logically, built into the legacy (production) codebase, the one actually serving users.",

    "But by this point, the to-be-migrated codebase had already diverged significantly from legacy. The architecture changes, the pipeline updates, and the security remediation work had collectively made it a structurally different animal. So every new feature implemented in the legacy codebase now had to be implemented separately in the migration codebase, on a codebase that no longer shared the same structure, the same patterns, or the same dependencies.",

    "Double the development effort. Double the QA. Double the cost, on both the client side and the vendor side. And crucially, this isn't a one-time hit. Every feature going forward, for as long as the two codebases remain alive in parallel, carries this multiplied cost. Technical debt compounds. Codebase divergence compounds faster.",

    "## What could have been done initially\n\n### 1. A formal discovery phase before anything moved\n\nThe most structurally important thing this project lacked was a dedicated discovery phase before work began. Not a day of kickoff meetings, but several weeks of structured investigation: full service inventory, inter-service dependency mapping, pipeline requirements, infrastructure constraints, client compliance obligations, and a shared definition of the target state.\n\nThis is not administrative overhead. It is the foundation on which every subsequent estimate, every technical decision, and every risk conversation stands. Skipping it doesn't save time at the start, it borrows time from every sprint that follows.",

    "### 2. Scope definition and a formal change control process\n\nMigrating a cluster is one project. Redesigning the architecture, rebuilding the pipeline, and modernising frameworks is a different project. Doing both simultaneously without explicit documentation is a third, hidden project that nobody agreed to fund.\n\nEvery time the scope expanded, whether pipeline changes, architecture evolution, or framework updates, it should have triggered a formal change control process: the change documented, its impact estimated, a decision made with updated timeline and cost implications. Instead, changes were absorbed informally. That informality is how a 6-month migration becomes a 2-year one.",

    "### 3. Timeline estimation built from the bottom up\n\nTimeline estimates should be derived from the work, not reverse-engineered from a desired delivery date. Enterprise migrations almost always carry more unknowns than initially visible. A responsible estimate for a project of this complexity would have included contingency, explicit unknowns, and buffer, not because delay is acceptable, but because pretending it isn't possible is more costly.",

    "### 4. A security strategy from day one\n\nSonarQube and Twistlock should have been part of the initial project plan, not mid-sprint additions. Before enforcing any benchmark, the team should have reviewed what those benchmarks mean for this codebase specifically: what findings are genuine vulnerabilities, what are inherited historical issues acceptable at a known risk level, and what simply doesn't apply. For legacy systems, a phased compliance approach (triage, categorise, prioritise) is the only realistic path. Applying greenfield standards to legacy code under pressure produces remediation theatre, not security.",

    "### 5. Transparent client visibility from the start\n\nThe client had limited real visibility into pipeline issues, integration blockers, and the true health of the migration. This created an information asymmetry that made difficult conversations harder than they needed to be. A shared risk register, a simple project dashboard, or structured fortnightly status updates covering blockers alongside progress would have allowed the client to make informed decisions rather than operating on assumptions, and would have built the trust needed to have hard conversations early, when they're cheaper.",

    "## What can be done now to get back on track\n\nThis project is not unrecoverable. But recovery requires an honest reckoning before it requires action. Here's what that looks like.",

    "### Stop and audit before the next sprint\n\nBefore the next fix, the next feature, the next QA pass, run a structured audit of the actual current state. Where exactly do the migration and legacy codebases diverge? What is the full list of outstanding SonarQube and Twistlock findings, and what is their real severity? What are the remaining migration tasks, mapped against realistic effort estimates? This audit becomes the single source of truth that all future decisions are made from. Without it, every decision is still being made in the dark.",

    "### Triage security findings with the right people in the room\n\nRevisit every SonarQube and Twistlock finding with a security engineer or architect, not a developer under sprint pressure. Classify each item: Critical (address immediately), High (this sprint), Medium (before go-live), Low or Informational (document, accept or defer with justification). Applying every tool finding as a mandatory fix, without this classification, isn't rigorous security practice. It's noise that consumes the capacity needed for real work.",

    "### Re-negotiate the timeline transparently\n\nTake the full picture from the audit, the real scope of what the project has become versus what it started as, to leadership on both sides. Document the delta. Have the uncomfortable conversation about what it will actually take to reach a production-ready state. An honest timeline that both sides commit to is worth ten optimistic ones that both sides privately doubt. The current situation, where the project has been \"nearly there\" for two years, is evidence that the existing timeline model is broken.",

    "### Make a hard decision on the codebase strategy\n\nThe dual-codebase situation needs a decision, not more patches. The options are:\n\n- Set a hard cut-over date after which the legacy codebase is frozen and all new work goes into the migration codebase only.\n- Execute a deliberate codebase sync: dedicate a focused sprint or sprint cycle to merging the diverged changes before the gap grows further.\n\nBoth options carry cost. Neither is free. But continuing the current model, maintaining two divergent, independently evolving codebases indefinitely, is the most expensive option of all, and it has no natural end state.",

    "### Implement change control going forward\n\nAny future scope change, whether a pipeline adjustment, an architecture decision, or a new compliance requirement, must go through a formal process: documented, impact-assessed, and approved with explicit timeline and cost implications before implementation begins. This isn't bureaucracy for its own sake. It's the mechanism that prevents the same failure mode from recurring.",

    "## Lessons learned, and the right framework for any software project\n\nDrawing from this experience, these are the principles I'd carry into any project from day one.\n\n**Never start without a discovery phase.** Two weeks of structured requirements gathering costs a fraction of six months of fixing assumptions. The question is never whether to invest in discovery, it's whether you'll pay for it upfront in time, or later in rework.\n\n**Scope creep is the slowest way to fail.** It happens gradually, then suddenly. Every informal \"we'll also handle this\" is a future delay that nobody budgeted for. Change management isn't process for its own sake, it's the mechanism that keeps commitments meaningful.\n\n**Security belongs in the architecture, not the backlog.** Bolting on security tools mid-project, under deadline pressure, without calibrating their benchmarks to the actual codebase, turns safety into an obstacle course. Integrate security thinking from the start, define what compliance means for your system specifically, and triage findings with rigor.\n\n**Codebase divergence compounds like interest.** The longer two parallel codebases coexist, the more expensive every subsequent feature becomes. Avoid it by design; address it aggressively when it occurs anyway. The cost of resolving divergence only grows with time.\n\n**Client visibility is not optional.** A client who sees real progress, real blockers, and real risks can make good decisions. A client operating on assumptions makes expensive ones. Transparency, even when the news isn't good, builds the kind of trust that makes hard conversations possible before they become crises.\n\n**Timelines are commitments, not wishes.** Agreeing to a timeline that isn't grounded in the actual work doesn't make the work faster, it makes the project chronically late from the first sprint. An honest estimate that makes both sides uncomfortable on day one is worth more than an optimistic one that erodes trust over two years.\n\n**Shared understanding is the only real foundation.** Almost every failure in this project traces back to one root cause: the client and the vendor started with fundamentally different pictures of what was being built. The most valuable investment any software project can make is ensuring that alignment exists, written down, reviewed by both sides, challenged, and agreed upon, before the first task is created.",

    "## Closing thoughts\n\nI've watched this project consume more time, more budget, and more goodwill than anyone on either side intended. The cloud platform wasn't the problem. The tools weren't the problem. The developers weren't the problem.\n\nThe plan, or more precisely, the absence of one, was the problem.",

    "Software is complex enough when everything is well understood. When you begin without clarity on requirements, without a realistic timeline, without a security strategy suited to your actual codebase, and without any mechanism to manage the change that always comes, you're not accepting risk. You're scheduling it.\n\nPlan properly. Surface assumptions before they harden into constraints. Build in the time to do it right. And remember: the cost of planning is always less than the cost of not planning. The project I've described is the proof.",

    "Have you been part of a project that spiralled out of scope? Reply below or find me on LinkedIn, I'd love to hear how you navigated it.",
  ],
  faq: [
    {
      question: "Why is software project planning important?",
      answer:
        "Software project planning sets the foundation for every decision that follows. Without it, teams build on misaligned assumptions, timelines are negotiated before the work is understood, and scope expands without anyone formally agreeing to the extra cost. A proper planning phase surfaces requirements, identifies dependencies, and produces a shared definition of what done looks like. It is not overhead. It is the mechanism that makes delivery predictable. Projects that skip planning do not save time at the start. They borrow it from every sprint that follows, with interest.",
    },
    {
      question: "What is a discovery phase in software development?",
      answer:
        "A discovery phase is a structured period before development begins, typically one to four weeks, where the team investigates and documents the full scope of work. It covers requirements gathering, dependency mapping, architecture decisions, compliance constraints, and risk identification. The output is a written document that both the client and the vendor review and agree on, including an explicit list of what is in scope and what is not. Discovery phases are especially critical for enterprise migrations, where hidden dependencies and compliance requirements frequently surface only once work is already underway.",
    },
    {
      question: "How do you prevent scope creep in a software project?",
      answer:
        "Scope creep is prevented by combining a written scope definition with a formal change control process. The scope document, agreed at the start, lists what is in scope and explicitly what is out. Any request to add work triggers the change control process: the addition is documented, its impact on timeline and cost is estimated, and it is approved by both sides before implementation begins. Without that process, scope additions are absorbed informally and the timeline becomes unrealistic without anyone making a conscious decision to accept the extra cost.",
    },
    {
      question: "How should SonarQube and Twistlock findings be handled in a legacy codebase?",
      answer:
        "Legacy codebases should not have greenfield benchmarks applied without triage. Findings should be reviewed with a security engineer and classified by real severity: critical issues fixed immediately, high-severity issues addressed within the current sprint, and low-severity or inapplicable findings documented and formally accepted or deferred. Mandating every finding as an immediate fix, regardless of severity or applicability, creates a workload that derails delivery and produces rushed patches that introduce new regressions, which is exactly the spiral that turns a security integration into a project-wide slowdown.",
    },
    {
      question: "How do you estimate a realistic timeline for a software migration?",
      answer:
        "Estimate from the bottom up, starting with a complete task list derived from a proper discovery phase. Assign realistic effort to each task and add explicit contingency for unknowns that surface during the work, since enterprise migrations almost always contain more hidden complexity than is visible at the start. Never reverse-engineer a timeline from a preferred delivery date and distribute it across tasks. An honest estimate that makes both sides uncomfortable at the negotiation table is more useful, and ultimately less damaging, than an optimistic one that quietly erodes trust over time.",
    },
    {
      question: "What happens when a legacy codebase and a migration codebase diverge?",
      answer:
        "When a migration drags on, the business keeps requesting new features, which get built into the live legacy codebase. Meanwhile, the codebase being migrated has already changed structurally due to architecture updates, pipeline changes, and security remediation. Every new feature now has to be implemented twice, once in each codebase, because they no longer share the same structure or dependencies. This doubles development and QA cost for every feature going forward, and the cost compounds with each sprint rather than staying constant, since the two codebases keep drifting further apart.",
    },
    {
      question: "How do you fix a software project that has gone off track?",
      answer:
        "Start with an honest audit before taking any further action. Map exactly where the codebases diverge, list all outstanding security findings with proper triage, and produce a true remaining task list. Take that picture to leadership on both sides and re-negotiate the timeline based on the actual state of the project rather than the original plan. Make a hard decision about the dual-codebase situation, either freezing the legacy codebase or running a dedicated sync effort, and put a formal change control process in place so the same failure pattern doesn't repeat.",
    },
  ],
  relatedPosts: ["injection", "broken-access-control", "owasp-top-ten"],
};

export default post;
