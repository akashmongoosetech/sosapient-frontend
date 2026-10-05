import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code, Server, Smartphone, Cloud, Palette, ShieldCheck, Brain, Workflow,
  Lightbulb, Bot, Database, Briefcase, Users, Factory, Rocket, ArrowRight,
  Megaphone, Share2, HeartPulse, ShoppingCart, GraduationCap, Building2,
  Plane, Gamepad2, Scale, Clapperboard, Truck, AppWindow, Plug,
  ClipboardCheck, Package, HelpCircle, Flame, CheckCircle, KeyRound,
  Trophy, FileText, BadgeCheck, Send, Mail, MapPin,
  type LucideIcon
} from 'lucide-react';
import type { Service } from '../../data/services';
import { primaryTech } from '../../data/services';

export const serviceIcons: Record<string, LucideIcon> = {
  Code, Server, Smartphone, Cloud, Palette, ShieldCheck, Brain, Workflow,
  Lightbulb, Bot, Database, Briefcase, Users, Factory, Rocket, Megaphone, Share2,
  HeartPulse, ShoppingCart, GraduationCap, Building2, Plane, Gamepad2, Scale,
  Clapperboard, Truck, AppWindow, Plug, ClipboardCheck, Package, HelpCircle,
  Flame, CheckCircle, KeyRound, Trophy, FileText, BadgeCheck, Send, Mail, MapPin
};

export const serviceIcon = (name: string): LucideIcon => serviceIcons[name] || Briefcase;

const BADGE_TONES = [
  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
];

export const techBadgeTone = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return BADGE_TONES[hash % BADGE_TONES.length];
};

export const techInitials = (name: string): string => {
  const words = name.replace(/[^A-Za-z0-9.+# ]/g, '').split(/[\s.]+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

interface ServiceCardProps {
  service: Service;
  index?: number;
  compact?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index = 0, compact = false }) => {
  const Icon = serviceIcon(service.icon);
  const { shown, extra } = primaryTech(service, 4);
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
      viewport={{ once: true }}
      className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-shadow hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
    >
      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${service.gradient} text-white`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
        <Link to={`/services/${service.slug}`} className="transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400">
          {service.name}
        </Link>
      </h3>
      <p className={`mt-2 text-gray-600 dark:text-gray-300 ${compact ? 'line-clamp-2 text-sm' : 'line-clamp-3 text-[15px]'}`}>
        {service.shortDescription}
      </p>
      <div className="mt-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Technologies
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {shown.map((t) => (
            <span
              key={t}
              title={t}
              className="inline-flex max-w-full items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            >
              <span className="truncate">{t}</span>
            </span>
          ))}
          {extra > 0 && (
            <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-800/30 dark:text-primary-300">
              +{extra} more
            </span>
          )}
        </div>
      </div>
      <Link
        to={`/services/${service.slug}`}
        aria-label={`Explore ${service.name}`}
        className="mt-4 inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-primary-600 hover:gap-2.5 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
      >
        Explore {service.shortName} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </motion.article>
  );
};

export default ServiceCard;
