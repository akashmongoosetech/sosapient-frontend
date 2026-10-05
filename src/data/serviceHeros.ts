import type { IndustryHeroConfig } from './industryHeros';

export const SERVICE_HEROS: Record<string, IndustryHeroConfig> = {
  'frontend-development': {
    headline: 'Build Fast, Modern Digital Experiences',
    description:
      'High-performance React and Next.js interfaces with clean component architecture — responsive, accessible and engineered to convert.',
    trust: ['React · Next.js · TypeScript', 'Core Web Vitals Focus', 'Mobile-First Builds'],
    visual: {
      variant: 'cards',
      panelTitle: 'Storefront UI · Preview',
      stats: [
        { label: 'Lighthouse Score', value: '98', sub: 'performance' },
        { label: 'Bundle Size', value: '182 kb', sub: 'gzipped, code-split' },
        { label: 'Largest Paint', value: '1.1 s', sub: 'on 4G' },
      ],
      floats: [
        { title: 'Component Shipped', subtitle: 'PricingTable.tsx merged', icon: 'Code' },
        { title: 'Preview Deployed', subtitle: 'every push, instantly', icon: 'Rocket' },
      ],
    },
  },
  'backend-development': {
    headline: 'APIs That Stay Fast When You Scale',
    description:
      'Secure Node.js APIs, solid data modeling and authentication done right — the dependable backbone your product grows on.',
    trust: ['Node.js · PostgreSQL · Redis', 'Auth Done Right', 'Documented APIs'],
    visual: {
      variant: 'pipeline',
      panelTitle: 'Order API · Live Trace',
      stats: [
        { label: 'POST /api/orders', value: '201', sub: 'validated + saved' },
        { label: 'Auth Middleware', value: '12 ms', sub: 'JWT verified' },
        { label: 'Response', value: '42 ms', sub: 'p95 this week' },
      ],
      floats: [
        { title: 'Deploy #312 Green', subtitle: 'migrations applied', icon: 'CheckCircle' },
        { title: 'Rate Limit Healthy', subtitle: '0 blocked legit users', icon: 'ShieldCheck' },
      ],
    },
  },
  'mobile-development': {
    headline: 'Apps People Keep on Their Home Screen',
    description:
      'Native-quality iOS and Android apps from one codebase — smooth animations, offline support and store-ready releases.',
    trust: ['iOS + Android, One Codebase', 'Offline-First Design', 'Store-Ready Releases'],
    visual: {
      variant: 'cards',
      panelTitle: 'Fitness App · Beta',
      stats: [
        { label: 'Store Rating', value: '4.8', sub: '12k reviews' },
        { label: 'Crash-Free', value: '99.9%', sub: 'last 90 days' },
        { label: 'Day-30 Retention', value: '41%', sub: '2× category avg' },
      ],
      floats: [
        { title: 'Push Campaign Sent', subtitle: '38% open rate', icon: 'Smartphone' },
        { title: 'Build Approved', subtitle: 'v2.4 live on both stores', icon: 'CheckCircle' },
      ],
    },
  },
  'cloud-devops': {
    headline: 'Infrastructure Your Team Deploys Without Fear',
    description:
      'AWS setups, CI/CD pipelines, monitoring and cost control — releases go out any day with one-click rollback.',
    trust: ['Zero-Downtime Deploys', 'Monitored Everything', 'Own Your Infra'],
    visual: {
      variant: 'dashboard',
      panelTitle: 'Production · ap-south-1',
      stats: [
        { label: 'Uptime 30d', value: '99.99%', sub: '0 incidents' },
        { label: 'Deploys', value: '342', sub: 'all green' },
        { label: 'p95 Latency', value: '180 ms', sub: '-42% this quarter' },
      ],
      floats: [
        { title: 'Build Passing', subtitle: 'tests 214/214', icon: 'CheckCircle' },
        { title: 'Backup Verified', subtitle: 'restore tested Sun', icon: 'Database' },
      ],
    },
  },
  'ui-ux-design': {
    headline: 'Interfaces Users Love at First Tap',
    description:
      'Research-backed UX, polished UI and complete design systems — from user interviews and wireframes through tested prototypes to developer-ready component libraries.',
    trust: ['Research-Backed UX', 'Design Systems', 'Developer-Ready Handoff'],
    visual: {
      variant: 'cards',
      panelTitle: 'Design System · v3',
      stats: [
        { label: 'Components', value: '240', sub: 'documented + tested' },
        { label: 'Prototype Frames', value: '86', sub: 'user-tested flows' },
        { label: 'Usability Score', value: '92', sub: 'task success rate' },
      ],
      floats: [
        { title: 'Wireframe → UI', subtitle: 'checkout flow approved', icon: 'Palette' },
        { title: 'Tokens Synced', subtitle: 'Figma → code, auto', icon: 'CheckCircle' },
      ],
    },
  },
  'security-testing': {
    headline: 'Ship Software You Can Defend With Confidence',
    description:
      'Security audits, penetration testing and hardened authentication — findings ranked by severity with fixes included.',
    trust: ['Manual + Automated Review', 'Auth Hardening', 'Fixes Included'],
    visual: {
      variant: 'shield',
      panelTitle: 'Audit Report · Week 2',
      stats: [
        { label: 'Critical Findings', value: '0', sub: 'remediated' },
        { label: 'High Findings', value: '2', sub: 'patched + verified' },
        { label: 'Dependencies Clean', value: '100%', sub: 'scanned in CI' },
      ],
      floats: [
        { title: 'Pen Test Passed', subtitle: 'no P1/P2 open', icon: 'ShieldCheck' },
        { title: 'MFA Enforced', subtitle: 'all admin accounts', icon: 'KeyRound' },
      ],
    },
  },
  'ai-development': {
    headline: 'Custom AI That Solves Real Business Problems',
    description:
      'LLM-powered features, intelligent search and document understanding — grounded in your data, measured on ROI.',
    trust: ['Grounded Models', 'Private By Default', 'Measured ROI'],
    visual: {
      variant: 'pipeline',
      panelTitle: 'Insight Engine · Live',
      stats: [
        { label: 'Ingest Documents', value: '12.4k', sub: 'indexed + embedded' },
        { label: 'Retrieve Context', value: '310 ms', sub: 'top-5 passages' },
        { label: 'Answer With Citations', value: '97%', sub: 'accuracy sampled' },
      ],
      floats: [
        { title: 'New Capability Live', subtitle: 'invoice Q&A shipped', icon: 'Brain' },
        { title: 'Cost Per Query', subtitle: '₹0.40 and falling', icon: 'Database' },
      ],
    },
  },
  'ai-automations': {
    headline: 'Turn Repetitive Work Into Silent Automation',
    description:
      'Trigger-based workflows connecting your apps, AI and team — leads answered, data synced, reports delivered automatically.',
    trust: ['Trigger → AI → Action', 'Human Checkpoints', 'Every Run Logged'],
    visual: {
      variant: 'pipeline',
      panelTitle: 'Lead Flow · Live',
      stats: [
        { label: 'New Lead Arrives', value: 'instant', sub: 'webhook received' },
        { label: 'AI Qualifies', value: '86 pts', sub: 'intent + budget fit' },
        { label: 'CRM + WhatsApp', value: 'sent', sub: 'rep notified in 40 s' },
      ],
      floats: [
        { title: '2,300 Runs', subtitle: '0 failures this week', icon: 'Workflow' },
        { title: 'Report Delivered', subtitle: 'Mon 8 AM, auto', icon: 'FileText' },
      ],
    },
  },
  'ai-solutions': {
    headline: 'The Right AI Strategy for Your Business',
    description:
      'From opportunity mapping to build-vs-buy decisions and pilot delivery — AI consulting that starts from ROI, not hype.',
    trust: ['ROI-First Roadmaps', 'Pilot in Weeks', 'Build-vs-Buy Clarity'],
    visual: {
      variant: 'dashboard',
      panelTitle: 'AI Program · Q1',
      stats: [
        { label: 'Hours Returned', value: '126', sub: 'this month' },
        { label: 'Active Pilots', value: '3', sub: '2 expanding' },
        { label: 'Payback Period', value: '4 mo', sub: 'measured' },
      ],
      floats: [
        { title: 'Pilot Approved', subtitle: 'support deflection next', icon: 'Brain' },
        { title: 'Review Passed', subtitle: 'accuracy 96%+', icon: 'CheckCircle' },
      ],
    },
  },
  'chatbot-development': {
    headline: 'Chatbots That Actually Resolve Conversations',
    description:
      'Grounded AI assistants for support, sales and lead capture — with citations, escalation and multilingual support.',
    trust: ['Grounded Answers', 'Human Escalation', 'WhatsApp + Web'],
    visual: {
      variant: 'chat',
      panelTitle: 'Support Assistant · Live',
      stats: [
        { label: 'Customer', value: 'Refund?', sub: 'order #5521' },
        { label: 'Assistant', value: 'Approved', sub: 'policy §4.2 cited' },
        { label: 'Customer', value: 'Thanks!', sub: 'resolved in 38 s' },
      ],
      floats: [
        { title: '63% Deflected', subtitle: 'no human needed', icon: 'Bot' },
        { title: 'Hindi Enabled', subtitle: 'Hinglish tested', icon: 'CheckCircle' },
      ],
    },
  },
  'rag-system-integration': {
    headline: 'Ask Your Documents Anything',
    description:
      'Private RAG systems over your PDFs, wikis and tickets — semantic search with cited, current answers your team trusts.',
    trust: ['Private & Permissioned', 'Cited Answers', 'Evaluated Retrieval'],
    visual: {
      variant: 'docs',
      panelTitle: 'Knowledge Base · Synced',
      stats: [
        { label: 'sop-dispatch-v9.pdf', value: 'indexed', sub: '214 chunks' },
        { label: 'support-tickets-2026', value: 'indexed', sub: '8,930 threads' },
        { label: 'Answer Latency p95', value: '2.1 s', sub: 'with citations' },
      ],
      floats: [
        { title: 'New Docs Synced', subtitle: '42 added overnight', icon: 'Database' },
        { title: 'Eval Suite Green', subtitle: 'faithfulness 0.97', icon: 'CheckCircle' },
      ],
    },
  },
  'business-solutions': {
    headline: 'Software That Runs Your Operations',
    description:
      'Bespoke business applications for ops, finance and leadership — approvals, dashboards and reporting in one trusted system.',
    trust: ['Fits Your Process', 'Role-Based Access', 'Own the Code'],
    visual: {
      variant: 'dashboard',
      panelTitle: 'Operations · Live',
      stats: [
        { label: 'Approvals Pending', value: '4', sub: 'oldest 1 h' },
        { label: 'Reports Auto-Sent', value: '26', sub: 'this week' },
        { label: 'Active Users', value: '380', sub: 'across 5 depts' },
      ],
      floats: [
        { title: 'Budget Approved', subtitle: '2-level · logged', icon: 'CheckCircle' },
        { title: 'Month Close Ready', subtitle: 'reconciled Sun', icon: 'Briefcase' },
      ],
    },
  },
  'custom-crm-development': {
    headline: 'A CRM Your Sales Team Will Actually Open',
    description:
      'Custom pipelines, follow-up automation and reporting shaped around how you sell — no per-seat bloat, no workarounds.',
    trust: ['Pipeline Your Way', 'Follow-up Automation', 'No Per-Seat Bloat'],
    visual: {
      variant: 'pipeline',
      panelTitle: 'Deal Flow · This Week',
      stats: [
        { label: 'New Leads', value: '148', sub: 'auto-captured' },
        { label: 'Qualified', value: '61', sub: 'scored + routed' },
        { label: 'Won', value: '19', sub: '₹23.4 L pipeline' },
      ],
      floats: [
        { title: 'Follow-up Sent', subtitle: 'sequence day 3', icon: 'Users' },
        { title: 'Forecast Updated', subtitle: 'AI-assisted', icon: 'Brain' },
      ],
    },
  },
  'erp-development': {
    headline: 'One ERP for Stock, Orders and Accounts',
    description:
      'Modular ERP for inventory, purchase, production and finance — consistent numbers from warehouse to balance sheet.',
    trust: ['Modular Rollout', 'Tally/SAP Friendly', 'Audit Trails'],
    visual: {
      variant: 'dashboard',
      panelTitle: 'Plant + Warehouse · Live',
      stats: [
        { label: 'Stock Accuracy', value: '98.2%', sub: 'cycle-counted' },
        { label: 'Order Cycle', value: '2.1 d', sub: 'was 5.4 d' },
        { label: 'Pending GRNs', value: '7', sub: 'all scheduled' },
      ],
      floats: [
        { title: 'Stock Synced', subtitle: '3 locations agree', icon: 'Database' },
        { title: 'Invoice Posted', subtitle: 'GST-ready', icon: 'CheckCircle' },
      ],
    },
  },
  'saas-product-development': {
    headline: 'From Idea to Revenue-Generating SaaS',
    description:
      'Multi-tenant architecture, subscriptions, onboarding and analytics — everything a SaaS needs to launch and scale.',
    trust: ['Multi-Tenant by Design', 'Subscriptions Built In', 'Launch in Phases'],
    visual: {
      variant: 'dashboard',
      panelTitle: 'Growth · March',
      stats: [
        { label: 'MRR', value: '₹8.2 L', sub: '+11% MoM' },
        { label: 'Churn', value: '2.4%', sub: 'improving' },
        { label: 'Trial → Paid', value: '22%', sub: 'onboarding v2' },
      ],
      floats: [
        { title: 'New Plan Live', subtitle: 'annual · 20% off', icon: 'Rocket' },
        { title: 'NPS 61', subtitle: '412 responses', icon: 'CheckCircle' },
      ],
    },
  },
  'digital-marketing': {
    headline: 'Marketing That Shows Up in Revenue',
    description:
      'SEO, content and performance campaigns tied to pipeline — rankings and traffic reported against leads, not vanity metrics.',
    trust: ['SEO + Content + Ads', 'Lead-Level Reporting', 'No Vanity Metrics'],
    visual: {
      variant: 'dashboard',
      panelTitle: 'Organic Growth · 90d',
      stats: [
        { label: 'Organic Traffic', value: '+64%', sub: 'vs prior period' },
        { label: 'Top-3 Keywords', value: '128', sub: '+41 new' },
        { label: 'Leads from SEO', value: '214', sub: 'this quarter' },
      ],
      floats: [
        { title: 'Featured Snippet Won', subtitle: 'pricing query', icon: 'Megaphone' },
        { title: 'Report Ready', subtitle: 'rankings + pipeline', icon: 'FileText' },
      ],
    },
  },
  'social-media-promotion': {
    headline: 'Social Channels That Grow Your Brand',
    description:
      'Content engines, short-form video and community management that turn followers into customers — reported honestly.',
    trust: ['Content Engines', 'Short-Form Video', 'Honest Reporting'],
    visual: {
      variant: 'leaderboard',
      panelTitle: 'Audience · This Month',
      stats: [
        { label: 'Instagram', value: '48.2k', sub: '+3.1k followers' },
        { label: 'LinkedIn', value: '12.6k', sub: 'B2B pipeline source' },
        { label: 'YouTube', value: '8.1k', sub: 'avg watch 62%' },
      ],
      floats: [
        { title: 'Reel Hit 210k Views', subtitle: 'product teardown', icon: 'Share2' },
        { title: 'Calendar Full', subtitle: 'next 30 days planned', icon: 'CheckCircle' },
      ],
    },
  },
};

export function getServiceHero(slug: string): IndustryHeroConfig | undefined {
  return SERVICE_HEROS[slug];
}
