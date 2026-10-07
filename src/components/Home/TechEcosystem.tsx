import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Sparkles,
  Workflow,
  Database,
  Cloud,
  ShieldCheck,
  TestTube2,
  Smartphone,
  Server,
  CreditCard,
  Wrench,
} from 'lucide-react';

import { TECHNOLOGIES } from './TechStack';
import { SectionHead, fadeUp } from './shared';

/* =========================================================
   TECHNOLOGY GROUPS
   Keep these names synchronized with TECHNOLOGIES in
   ./TechStack.tsx.
   ========================================================= */

const TECH_GROUPS = [
  {
    label: 'Frontend',
    icon: Layers,
    description: 'Modern interfaces, web apps and scalable design systems.',
    items: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Tailwind CSS',
      'HTML5',
      'CSS3',
      'Angular',
      'Vue.js',
      'Bootstrap',
      'Material UI',
      'Shadcn UI',
      'Framer Motion',
      'GSAP',
    ],
  },

  {
    label: 'Backend',
    icon: Server,
    description: 'Scalable APIs, services and server-side applications.',
    items: [
      'Node.js',
      'Express.js',
      'Python',
      'FastAPI',
      'PHP',
      'REST API',
      'GraphQL',
    ],
  },

  {
    label: 'Mobile',
    icon: Smartphone,
    description: 'Cross-platform mobile applications and native experiences.',
    items: [
      'React Native',
      'Expo',
      'Flutter',
      'Android',
    ],
  },

  {
    label: 'Databases',
    icon: Database,
    description: 'Reliable data storage, querying and real-time systems.',
    items: [
      'MongoDB',
      'PostgreSQL',
      'MySQL',
      'Supabase',
      'Redis',
      'Firebase',
      'SQL',
    ],
  },

  {
    label: 'AI & LLM',
    icon: Sparkles,
    description: 'Generative AI, LLM applications, RAG and intelligent systems.',
    items: [
      'OpenAI',
      'Google Gemini',
      'Anthropic Claude',
      'LangChain',
      'LlamaIndex',
      'Hugging Face',
      'RAG',
      'Vector Database',
      'AI Agents',
      'Prompt Engineering',
    ],
  },

  {
    label: 'Automation',
    icon: Workflow,
    description: 'Business workflows, integrations and intelligent automation.',
    items: [
      'n8n',
      'Make',
      'Zapier',
      'Webhooks',
      'API Automation',
      'Workflow Automation',
      'AI Automation',
    ],
  },

  {
    label: 'Cloud & DevOps',
    icon: Cloud,
    description: 'Deployment, infrastructure, containers and production systems.',
    items: [
      'AWS',
      'Docker',
      'Vercel',
      'Netlify',
      'GitHub Actions',
      'Linux',
      'Nginx',
      'Render',
      'CI/CD',
    ],
  },

  {
    label: 'Authentication & Security',
    icon: ShieldCheck,
    description: 'Secure authentication, authorization and application protection.',
    items: [
      'JWT',
      'OAuth',
      'RBAC',
      'Auth0',
      'Clerk',
      'Firebase Auth',
      'HTTPS',
      'API Security',
    ],
  },

  {
    label: 'Testing & API',
    icon: TestTube2,
    description: 'Reliable software through testing and API validation.',
    items: [
      'Jest',
      'React Testing Library',
      'Cypress',
      'Postman',
      'Playwright',
      'Unit Testing',
      'Integration Testing',
      'E2E Testing',
    ],
  },

  {
    label: 'Payments',
    icon: CreditCard,
    description: 'Secure payment integrations for modern applications.',
    items: [
      'Razorpay',
      'Stripe',
      'Payment Gateway',
    ],
  },

  {
    label: 'AI Creative Tools',
    icon: Sparkles,
    description: 'AI-powered voice, image, video and creative workflows.',
    items: [
      'ElevenLabs',
      'Recraft',
      'Runway',
      'GPT Images',
      'AI Voice',
      'AI Image Generation',
      'AI Video Generation',
    ],
  },

  {
    label: 'Tools & Engineering',
    icon: Wrench,
    description: 'Development tools and engineering workflows used in production.',
    items: [
      'Git',
      'GitHub',
      'VS Code',
      'Linux',
      'npm',
      'Vite',
      'ESLint',
      'Prettier',
    ],
  },
];

/* =========================================================
   HELPER
   Finds technology safely from TechStack.tsx.

   It supports small naming differences such as:
   "Tailwind" vs "Tailwind CSS"
   ========================================================= */

function normalizeName(name: string) {
  return name
    .toLowerCase()
    .replace(/\.js/g, '')
    .replace(/\s+/g, '')
    .replace(/[-_]/g, '');
}

function getTechnology(name: string) {
  const normalized = normalizeName(name);

  return TECHNOLOGIES.find(
    (technology) =>
      normalizeName(technology.name) === normalized
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

const TechEcosystem: React.FC = () => {
  /*
   * Only render technologies that actually exist inside
   * TECHNOLOGIES from TechStack.tsx.
   */
  const groups = useMemo(() => {
    return TECH_GROUPS
      .map((group) => ({
        ...group,
        items: group.items
          .map((name) => getTechnology(name))
          .filter(Boolean),
      }))
      .filter((group) => group.items.length > 0);
  }, []);

  /*
   * Collect all available technologies for the orbit.
   */
  const availableTechnologies = useMemo(() => {
    const unique = new Map<string, (typeof TECHNOLOGIES)[number]>();

    groups.forEach((group) => {
      group.items.forEach((technology) => {
        if (technology) {
          unique.set(technology.name, technology);
        }
      });
    });

    return Array.from(unique.values());
  }, [groups]);

  /*
   * Keep the orbit visually balanced.
   */
  const orbitTechnologies = availableTechnologies.slice(0, 20);

  const outerRing = orbitTechnologies.slice(0, 10);
  const innerRing = orbitTechnologies.slice(10, 20);

  const totalShown = availableTechnologies.length;
  const totalAvailable = TECHNOLOGIES.length;

  return (
    <section
      id="technology-stack"
      className="relative overflow-hidden bg-gray-950 py-16 sm:py-20 lg:py-24"
    >
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-600/10 blur-3xl sm:h-[560px] sm:w-[560px]" />

        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ===================================================
            HEADER
            =================================================== */}

        <SectionHead
          inverse
          eyebrow="Technology Ecosystem"
          title="Modern technology. One connected ecosystem."
          sub="From frontend experiences and scalable backends to AI, automation, cloud infrastructure and production engineering — we build with technologies that work together."
        />

        {/* ===================================================
            MAIN GRID
            =================================================== */}

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* =================================================
              ORBIT
              ================================================= */}

          <motion.div
            {...fadeUp}
            className="relative mx-auto aspect-square w-full max-w-[480px]"
            role="img"
            aria-label="Technology ecosystem orbit"
          >

            {/* Outer orbit */}

            <div
              className="
                absolute inset-0
                animate-[spin_48s_linear_infinite]
                rounded-full
                border border-dashed border-white/10
                motion-reduce:animate-none
              "
              aria-hidden="true"
            >
              {outerRing.map((technology, index) => {
                const angle =
                  (index / Math.max(outerRing.length, 1)) *
                  Math.PI *
                  2;

                return (
                  <span
                    key={technology.name}
                    className="
                      absolute
                      flex
                      h-11
                      w-11
                      -translate-x-1/2
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/10
                      bg-gray-900
                      p-2
                      shadow-xl
                      animate-[spin_48s_linear_infinite_reverse]
                      motion-reduce:animate-none
                      sm:h-12
                      sm:w-12
                    "
                    style={{
                      left: `${50 + 50 * Math.cos(angle)}%`,
                      top: `${50 + 50 * Math.sin(angle)}%`,
                    }}
                    title={technology.name}
                  >
                    <img
                      src={technology.logo}
                      alt={technology.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain"
                    />
                  </span>
                );
              })}
            </div>

            {/* Inner orbit */}

            <div
              className="
                absolute
                inset-[16%]
                animate-[spin_62s_linear_infinite_reverse]
                rounded-full
                border
                border-dashed
                border-white/10
                motion-reduce:animate-none
              "
              aria-hidden="true"
            >
              {innerRing.map((technology, index) => {
                const angle =
                  (index / Math.max(innerRing.length, 1)) *
                  Math.PI *
                  2;

                return (
                  <span
                    key={technology.name}
                    className="
                      absolute
                      flex
                      h-9
                      w-9
                      -translate-x-1/2
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-white/10
                      bg-gray-900
                      p-1.5
                      shadow-lg
                      animate-[spin_62s_linear_infinite]
                      motion-reduce:animate-none
                      sm:h-11
                      sm:w-11
                    "
                    style={{
                      left: `${50 + 50 * Math.cos(angle)}%`,
                      top: `${50 + 50 * Math.sin(angle)}%`,
                    }}
                    title={technology.name}
                  >
                    <img
                      src={technology.logo}
                      alt={technology.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain"
                    />
                  </span>
                );
              })}
            </div>

            {/* Decorative rings */}

            <div
              className="absolute inset-[29%] rounded-full border border-white/5"
              aria-hidden="true"
            />

            <div
              className="absolute inset-[34%] rounded-full border border-white/5"
              aria-hidden="true"
            />

            {/* Center */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                flex
                h-28
                w-28
                -translate-x-1/2
                -translate-y-1/2
                flex-col
                items-center
                justify-center
                rounded-3xl
                border
                border-white/10
                bg-gradient-to-br
                from-primary-600
                to-secondary-600
                text-white
                shadow-2xl
                shadow-primary-900/30
                sm:h-32
                sm:w-32
              "
            >
              <Layers
                className="h-7 w-7 sm:h-8 sm:w-8"
                aria-hidden="true"
              />

              <span className="mt-1 text-xs font-bold sm:text-sm">
                Full Stack
              </span>

              <span className="text-[10px] text-white/70 sm:text-xs">
                Ecosystem
              </span>
            </div>
          </motion.div>

          {/* =================================================
              TECHNOLOGY GROUPS
              ================================================= */}

          <div className="flex flex-col gap-3">

            {groups.map((group, groupIndex) => {
              const Icon = group.icon;

              return (
                <motion.div
                  key={group.label}
                  {...fadeUp}
                  transition={{
                    duration: 0.5,
                    delay: groupIndex * 0.05,
                  }}
                  className="
                    group
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    p-4
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:border-white/20
                    hover:bg-white/[0.07]
                  "
                >
                  {/* Group heading */}

                  <div className="flex items-start gap-3">

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-violet-500/10
                        text-violet-300
                      "
                    >
                      <Icon
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-widest text-violet-300">
                        {group.label}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {group.description}
                      </p>
                    </div>

                  </div>

                  {/* Technologies */}

                  <div className="mt-3 flex flex-wrap gap-2">

                    {group.items.map((technology) => {
                      if (!technology) return null;

                      return (
                        <span
                          key={technology.name}
                          className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-white/5
                            bg-white/[0.07]
                            py-1.5
                            pl-1.5
                            pr-3
                            text-xs
                            font-semibold
                            text-white
                            transition-all
                            duration-200
                            hover:border-white/15
                            hover:bg-white/10
                          "
                          title={technology.name}
                        >
                          <span
                            className="
                              flex
                              h-6
                              w-6
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-white
                              p-1
                            "
                          >
                            <img
                              src={technology.logo}
                              alt={`${technology.name} logo`}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-contain"
                            />
                          </span>

                          {technology.name}
                        </span>
                      );
                    })}

                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ===================================================
            BOTTOM STATS
            =================================================== */}

        <motion.div
          {...fadeUp}
          className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center">
            <p className="text-2xl font-bold text-white">
              {groups.length}+
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Technology Domains
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center">
            <p className="text-2xl font-bold text-white">
              {totalShown}+
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Technologies
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center">
            <p className="text-2xl font-bold text-white">
              AI
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Native Integrations
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center">
            <p className="text-2xl font-bold text-white">
              360°
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Product Engineering
            </p>
          </div>
        </motion.div>

        {/* ===================================================
            FOOTER NOTE
            =================================================== */}

        <motion.p
          {...fadeUp}
          className="mt-6 text-center text-xs text-gray-500"
        >
          Our technology stack evolves with the product — from
          frontend and backend engineering to AI, automation,
          cloud, security and DevOps.
        </motion.p>

        {/* Prevent unused-variable warning when TechStack contains
            technologies that are not currently mapped above. */}
        {totalAvailable > totalShown && (
          <span className="sr-only">
            Additional technologies available in the complete
            technology catalog.
          </span>
        )}
      </div>
    </section>
  );
};

export default TechEcosystem;
