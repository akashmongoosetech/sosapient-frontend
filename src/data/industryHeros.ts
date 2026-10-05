export type HeroVisualVariant =
  | 'dashboard'
  | 'pipeline'
  | 'chat'
  | 'leaderboard'
  | 'route'
  | 'cards'
  | 'shield'
  | 'docs'
  | 'network'
  | 'jobs'
  | 'message';

export interface HeroStat {
  label: string;
  value: string;
  sub: string;
}

export interface HeroFloat {
  title: string;
  subtitle: string;
  icon: string;
}

export interface IndustryHeroConfig {
  headline: string;
  description: string;
  trust: string[];
  visual: {
    variant: HeroVisualVariant;
    panelTitle: string;
    stats: HeroStat[];
    floats: HeroFloat[];
  };
}

export const INDUSTRY_HEROS: Record<string, IndustryHeroConfig> = {
  'healthcare-telehealth': {
    headline: 'Build Smarter Digital Healthcare Experiences',
    description:
      'Telemedicine platforms, patient portals and hospital systems that improve care access, cut front-desk load and keep sensitive data protected.',
    trust: ['Secure by Design', 'Clinician-Friendly Workflows', 'Scales Clinic to Hospital'],
    visual: {
      variant: 'dashboard',
      panelTitle: 'Care Operations · Live',
      stats: [
        { label: 'Appointments Today', value: '128', sub: '12 video visits' },
        { label: 'Avg. Wait Time', value: '9 min', sub: 'down from 34' },
        { label: 'Reminders Sent', value: '342', sub: '0 no-shows so far' },
      ],
      floats: [
        { title: 'AI Triage Assistant', subtitle: 'Active · 23 chats today', icon: 'Bot' },
        { title: 'Lab Reports Ready', subtitle: '14 released to portal', icon: 'ClipboardCheck' },
      ],
    },
  },
  'ecommerce-retail': {
    headline: 'Create Online Stores That Convert Browsers Into Buyers',
    description:
      'Fast storefronts, frictionless checkout, synced inventory and analytics — everything your retail brand needs to sell more online.',
    trust: ['Mobile-First Storefronts', 'Frictionless Checkout', 'Analytics Built In'],
    visual: {
      variant: 'cards',
      panelTitle: 'Storefront · Live',
      stats: [
        { label: 'Conversion Rate', value: '4.8%', sub: 'last 7 days' },
        { label: 'Avg. Order Value', value: '₹1,940', sub: '+12% MoM' },
        { label: 'Cart Recovery', value: '31%', sub: 'via reminders' },
      ],
      floats: [
        { title: 'New Order #8421', subtitle: 'Paid · Packing', icon: 'ShoppingCart' },
        { title: 'Low Stock Alert', subtitle: 'Runner X — 6 left', icon: 'Package' },
      ],
    },
  },
  'manufacturing-logistics': {
    headline: 'Digitize Your Factory Floor and Warehouse Operations',
    description:
      'Production tracking, barcode inventory and dispatch systems that give managers real-time visibility from raw material to loaded truck.',
    trust: ['Shop-Floor Simple Apps', 'Offline-Tolerant Sync', 'ERP Integrations'],
    visual: {
      variant: 'dashboard',
      panelTitle: 'Plant Overview · Shift B',
      stats: [
        { label: 'Line OEE', value: '87%', sub: 'target 85%' },
        { label: 'Units Today', value: '4,280', sub: 'across 3 lines' },
        { label: 'Downtime', value: '0.4 h', sub: 'planned only' },
      ],
      floats: [
        { title: 'Line 3 Running', subtitle: 'All stations nominal', icon: 'Factory' },
        { title: 'Dispatch Ready', subtitle: 'Truck 14 · 220 units', icon: 'Truck' },
      ],
    },
  },
  'education-edtech': {
    headline: 'Launch Engaging Online Learning Experiences',
    description:
      'Course platforms, live batches, mock tests and fee management that keep learners returning daily and institutes running smoothly.',
    trust: ['Engagement Mechanics', 'Live + Recorded', 'Parent Transparency'],
    visual: {
      variant: 'leaderboard',
      panelTitle: 'Batch Performance · NEET Sprint',
      stats: [
        { label: 'Avg. Completion', value: '78%', sub: '+21 pts vs video-only' },
        { label: 'Tests This Week', value: '1,940', sub: 'auto-evaluated' },
        { label: 'Live Now', value: '6', sub: 'batches in session' },
      ],
      floats: [
        { title: 'Doubt Solved', subtitle: 'Physics · 4 min response', icon: 'HelpCircle' },
        { title: 'Streak Reward', subtitle: '12-day learner streak', icon: 'Flame' },
      ],
    },
  },
  'artificial-intelligence-automation': {
    headline: 'Put Practical AI to Work Across Your Business',
    description:
      'Grounded chatbots, RAG assistants and workflow automation measured on hours saved — piloted in weeks, hardened for production.',
    trust: ['Grounded, Cited Answers', 'Human-in-the-Loop', 'Measured ROI'],
    visual: {
      variant: 'pipeline',
      panelTitle: 'Support Automation · Live',
      stats: [
        { label: 'Deflected Chats', value: '63%', sub: 'no human needed' },
        { label: 'Avg. Response', value: '4 s', sub: '24×7 coverage' },
        { label: 'Accuracy Sample', value: '97%', sub: 'weekly review' },
      ],
      floats: [
        { title: 'New Ticket → Resolved', subtitle: 'Refund policy · cited', icon: 'Bot' },
        { title: 'Lead Qualified', subtitle: 'Score 86 · sent to sales', icon: 'Users' },
      ],
    },
  },
  'cloud-devops': {
    headline: 'Ship Faster on Cloud Infrastructure That Just Works',
    description:
      'AWS setups, CI/CD pipelines, monitoring and cost control — so your team deploys any day without fear and never gets paged at 3 AM.',
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
        { title: 'Build #1241 Passing', subtitle: 'tests 214/214', icon: 'CheckCircle' },
        { title: 'Deploy Live', subtitle: 'rollback ready', icon: 'Rocket' },
      ],
    },
  },
  'cybersecurity': {
    headline: 'Build Secure Digital Systems With Confidence',
    description:
      'Security audits, authentication hardening and monitoring that close real vulnerabilities — and leave your team with practices that stick.',
    trust: ['Manual + Automated Review', 'Auth Done Right', 'Detect Before Damage'],
    visual: {
      variant: 'shield',
      panelTitle: 'Security Posture · Live',
      stats: [
        { label: 'Threats Blocked', value: '1,204', sub: 'last 30 days' },
        { label: 'Critical Open', value: '0', sub: 'remediated' },
        { label: 'MFA Coverage', value: '100%', sub: 'enforced' },
      ],
      floats: [
        { title: 'Nightly Scan Clean', subtitle: '0 new CVEs', icon: 'ShieldCheck' },
        { title: 'Secrets Rotated', subtitle: '12 keys · just now', icon: 'KeyRound' },
      ],
    },
  },
  'proptech-real-estate': {
    headline: 'Sell More Property With a Digital-First Sales Engine',
    description:
      'Listing portals, instant lead response, site-visit scheduling and builder CRM that turn inquiry chaos into predictable bookings.',
    trust: ['Every Lead Captured', 'Instant Response Bots', 'Broker Transparency'],
    visual: {
      variant: 'cards',
      panelTitle: 'Inventory · Skyline Heights',
      stats: [
        { label: 'Site Visits', value: '46', sub: 'booked this week' },
        { label: 'Response Time', value: '3 min', sub: 'median first touch' },
        { label: 'Bookings', value: '9', sub: 'this month' },
      ],
      floats: [
        { title: '3BHK · ₹85 L', subtitle: 'Site visit Sat 11 AM', icon: 'Building2' },
        { title: 'New Lead Qualified', subtitle: 'Budget ₹60–80 L', icon: 'Users' },
      ],
    },
  },
  'travel-hospitality-tourism': {
    headline: 'Fill More Rooms With Effortless Travel Booking',
    description:
      'Direct booking engines, package configurators and guest apps that cut OTA dependence and turn one-time travelers into repeat guests.',
    trust: ['Direct-Booking First', 'Live Availability', 'Guest Self-Service'],
    visual: {
      variant: 'route',
      panelTitle: 'Trip IR-2841 · Confirmed',
      stats: [
        { label: 'Direct Share', value: '58%', sub: 'vs 31% last year' },
        { label: 'Upsell Attach', value: '27%', sub: 'pre-arrival offers' },
        { label: 'Repeat Guests', value: '34%', sub: 'and climbing' },
      ],
      floats: [
        { title: 'Booking Confirmed', subtitle: 'Goa · 3 nights · paid', icon: 'Plane' },
        { title: 'Airport Pickup Set', subtitle: 'Arrives Fri 10:20', icon: 'CheckCircle' },
      ],
    },
  },
  'gaming-esports': {
    headline: 'Run Tournaments Your Players Will Remember',
    description:
      'Registrations, automated brackets, live standings and fan communities — engineered for hype moments and finals-day traffic spikes.',
    trust: ['Dispute-Free Rounds', 'Finals-Day Scale', 'Community That Sticks'],
    visual: {
      variant: 'leaderboard',
      panelTitle: 'Monsoon Cup · Grand Final',
      stats: [
        { label: 'Registered', value: '512', sub: 'slots full' },
        { label: 'Live Viewers', value: '18.2k', sub: 'and rising' },
        { label: 'Matches Done', value: '96', sub: '0 disputes open' },
      ],
      floats: [
        { title: 'Semifinal Live', subtitle: 'Map 3 · decider', icon: 'Gamepad2' },
        { title: 'Prize Locked', subtitle: '₹2 L · TDS ready', icon: 'Trophy' },
      ],
    },
  },
  'hrtech-workforce-management': {
    headline: 'Run Hiring to Payroll in One Connected System',
    description:
      'Applicant tracking, onboarding, attendance, appraisals and HR analytics that remove busywork and give leaders real workforce data.',
    trust: ['Employee Self-Service', 'Payroll-Grade Accuracy', 'Audit-Ready Records'],
    visual: {
      variant: 'dashboard',
      panelTitle: 'Workforce · March',
      stats: [
        { label: 'Attendance', value: '96%', sub: '412 present' },
        { label: 'Open Roles', value: '14', sub: '6 in final round' },
        { label: 'Reviews Due', value: '23', sub: 'cycle closes Fri' },
      ],
      floats: [
        { title: 'Offer Accepted', subtitle: 'Backend dev · joins 1st', icon: 'Users' },
        { title: 'Payroll Inputs Ready', subtitle: 'verified · 0 errors', icon: 'CheckCircle' },
      ],
    },
  },
  'professional-services-legaltech': {
    headline: 'Bring Order to Matters, Documents and Billing',
    description:
      'Matter tracking, document automation, effortless time capture and client portals that professionalize your entire practice.',
    trust: ['Matter-Level Access', 'Version Discipline', 'Time-to-Bill Flow'],
    visual: {
      variant: 'docs',
      panelTitle: 'Matter 2026-118 · Active',
      stats: [
        { label: 'Hours Captured', value: '312', sub: 'this month' },
        { label: 'Drafts Assembled', value: '47', sub: 'from templates' },
        { label: 'Deadlines Met', value: '100%', sub: 'trailing 90 days' },
      ],
      floats: [
        { title: 'Agreement v4 Reviewed', subtitle: '3 clauses flagged', icon: 'FileText' },
        { title: 'Filing Due Friday', subtitle: 'checklist 5/6', icon: 'Scale' },
      ],
    },
  },
  'media-entertainment': {
    headline: 'Turn Your Content Into Recurring Revenue',
    description:
      'Video platforms, subscriptions, creator payouts and fan engagement — an owned media business instead of rented reach.',
    trust: ['Buffer-Free Playback', 'Piracy Protection', 'Audience Data You Own'],
    visual: {
      variant: 'cards',
      panelTitle: 'Now Trending · Your Channel',
      stats: [
        { label: 'Watch Time', value: '84k h', sub: 'this month' },
        { label: 'Subscribers', value: '12,400', sub: '+9% MoM' },
        { label: 'Churn', value: '2.1%', sub: 'all-time low' },
      ],
      floats: [
        { title: 'Premiere Live', subtitle: '8.2k watching now', icon: 'Clapperboard' },
        { title: 'Payout Released', subtitle: 'March · 42 creators', icon: 'BadgeCheck' },
      ],
    },
  },
  'logistics-supply-chain': {
    headline: 'Track Every Shipment From Booking to POD',
    description:
      'Consignment tracking, transporter management and freight billing that keep customers informed and working capital moving.',
    trust: ['Milestone Visibility', 'Offline-Tolerant Apps', 'POD-Linked Billing'],
    visual: {
      variant: 'route',
      panelTitle: 'LR 88412 · In Transit',
      stats: [
        { label: 'On-Time %', value: '94%', sub: 'trailing 30 days' },
        { label: 'Active Trips', value: '186', sub: '12 delayed' },
        { label: 'POD Backlog', value: '0.4 d', sub: 'avg return time' },
      ],
      floats: [
        { title: 'Crossed Indore Hub', subtitle: 'ETA tomorrow 9 AM', icon: 'Truck' },
        { title: 'POD Captured', subtitle: 'photo + signature', icon: 'CheckCircle' },
      ],
    },
  },
  'custom-enterprise-web-apps': {
    headline: 'Replace Spreadsheets With Software That Fits',
    description:
      'Custom dashboards, approval workflows and admin panels built around your real processes — owned by your team, auditable by design.',
    trust: ['Role-Based Access', 'Integrates Your ERP', 'No Lock-In'],
    visual: {
      variant: 'dashboard',
      panelTitle: 'Operations · Live',
      stats: [
        { label: 'Pending Approvals', value: '6', sub: 'oldest 2 h' },
        { label: 'Active Users', value: '1,240', sub: 'across 8 depts' },
        { label: 'Reports Auto-Sent', value: '38', sub: 'this week' },
      ],
      floats: [
        { title: 'Budget Approved', subtitle: '₹4.2 L · 2-level', icon: 'CheckCircle' },
        { title: 'Sync Healthy', subtitle: 'ERP · 2 min ago', icon: 'Database' },
      ],
    },
  },
  'api-integration-performance-optimization': {
    headline: 'Connect Every System and Make It Fast',
    description:
      'Reliable third-party integrations, well-designed internal APIs and full-stack performance fixes — each improvement proven with before-and-after measurements you can verify.',
    trust: ['Retries & Fallbacks', 'Observed Everything', 'Measured Speedups'],
    visual: {
      variant: 'pipeline',
      panelTitle: 'Checkout API · Live',
      stats: [
        { label: 'p95 Latency', value: '84 ms', sub: 'was 1.9 s' },
        { label: 'Success Rate', value: '99.98%', sub: '7-day window' },
        { label: 'Webhooks DLQ', value: '0', sub: 'all replayed' },
      ],
      floats: [
        { title: 'Payment Webhook', subtitle: 'verified · 41 ms', icon: 'Plug' },
        { title: 'Cache Hit 94%', subtitle: 'saving 2.1M queries', icon: 'Database' },
      ],
    },
  },
  'business-process-automation': {
    headline: 'Turn Complex Workflows Into Intelligent Automation',
    description:
      'Lead routing, follow-up sequences, report generation and approvals on autopilot — logged, measured and always under your control.',
    trust: ['Humans Decide, Bots Chase', 'Every Run Logged', 'First Win in Weeks'],
    visual: {
      variant: 'pipeline',
      panelTitle: 'Lead Engine · Live',
      stats: [
        { label: 'Responded < 1 min', value: '92%', sub: 'of 1,140 leads' },
        { label: 'Follow-ups Sent', value: '3,806', sub: 'zero forgotten' },
        { label: 'Hours Returned', value: '126', sub: 'this month' },
      ],
      floats: [
        { title: 'Quote Follow-up #3', subtitle: 'opened · call task set', icon: 'Bot' },
        { title: 'MIS Delivered', subtitle: 'Mon 8 AM · auto', icon: 'FileText' },
      ],
    },
  },
};

export function getIndustryHero(slug: string): IndustryHeroConfig | undefined {
  return INDUSTRY_HEROS[slug];
}
