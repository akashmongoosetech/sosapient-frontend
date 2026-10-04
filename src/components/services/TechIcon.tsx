import React from 'react';
import {
  Cloud, Server, Smartphone, Image as ImageIcon, Brush, PenTool, StickyNote,
  FlaskConical, Brain, Cpu, Sparkles, Zap, Bot, GitBranch, ArrowLeftRight,
  Webhook, AppWindow, Network, Cog, Megaphone, RefreshCw, Calculator, Boxes,
  BadgeCheck, FileSpreadsheet, LayoutDashboard, Flag, Triangle, Waves, KeyRound,
  Mail, Lock, Bell, Database, Layers, Building2, Briefcase, Settings, MapPin, Search,
  Globe, ThumbsUp, Camera, Calendar, DollarSign, TrendingUp, Activity,
  BarChart3, FileText, FileUp, Users, type LucideIcon
} from 'lucide-react';
import { BRAND_ICONS } from './brandIcons.generated';

// Semantic lucide fallbacks for techs without an official brand mark
// (standards, platforms, and feature-level items).
const FALLBACKS: Record<string, LucideIcon> = {
  'REST API': ArrowLeftRight,
  'REST APIs': ArrowLeftRight,
  'APIs': ArrowLeftRight,
  'Webhooks': Webhook,
  'React Native': Smartphone,
  'SwiftUI': AppWindow,
  'Adobe XD': PenTool,
  'Photoshop': ImageIcon,
  'Illustrator': Brush,
  'FigJam': StickyNote,
  'Playwright': FlaskConical,
  'OAuth': KeyRound,
  'AWS': Cloud,
  'Azure': Server,
  'OpenAI': Brain,
  'OpenAI Embeddings': Sparkles,
  'Llama': Cpu,
  'LlamaIndex': Network,
  'Pinecone': Triangle,
  'Weaviate': Waves,
  'pgvector': Database,
  'Pipedream': Zap,
  'Botpress': Bot,
  'Dashboards': LayoutDashboard,
  'Admin Dashboards': LayoutDashboard,
  'Role-Based Access': Lock,
  'Role-Based Permissions': Lock,
  'Audit Logs': FileText,
  'CSV Import/Export': FileUp,
  'CSV Export': FileSpreadsheet,
  'Email Alerts': Bell,
  'Email Automation': Mail,
  'Email Sync': RefreshCw,
  'Pipelines': GitBranch,
  'Automation Rules': Cog,
  'Notifications': Bell,
  'Meta/Google Ads Leads': Megaphone,
  'Ledger': Calculator,
  'Inventory': Boxes,
  'Approvals': BadgeCheck,
  'Reports': BarChart3,
  'Product Analytics': BarChart3,
  'Multi-tenancy': Building2,
  'Feature Flags': Flag,
  'SEO Audits': Search,
  'Technical SEO': Settings,
  'On-Page SEO': FileText,
  'Local SEO': MapPin,
  'AEO': Sparkles,
  'GEO': Globe,
  'Content Strategy': PenTool,
  'Analytics': BarChart3,
  'Conversion Optimization': TrendingUp,
  'Facebook Marketing': ThumbsUp,
  'Instagram Marketing': Camera,
  'LinkedIn Marketing': Briefcase,
  'Content Calendars': Calendar,
  'Paid Social Campaigns': DollarSign,
  'Community Management': Users,
  'Social Analytics': Activity,
};

interface TechIconProps {
  name: string;
  className?: string;
}

/**
 * Official brand mark in brand color on a light tile, with a semantic
 * lucide fallback. No external images, no network at runtime.
 */
const TechIcon: React.FC<TechIconProps> = ({ name, className = 'h-5 w-5' }) => {
  const brand = BRAND_ICONS[name];
  if (brand) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white"
      >
        <svg viewBox="0 0 24 24" role="img" className={className} fill={`#${brand.hex}`}>
          <path d={brand.path} />
        </svg>
      </span>
    );
  }
  const Fallback = FALLBACKS[name] || Layers;
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
    >
      <Fallback className={className} />
    </span>
  );
};

export default TechIcon;
