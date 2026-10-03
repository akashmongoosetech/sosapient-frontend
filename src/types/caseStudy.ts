import {
  Code, Palette, Database, Bot, Cloud, Smartphone, Globe, Shield,
  BarChart3, ShoppingCart, Users, Settings, Zap, Server, Monitor, Layers,
  TrendingUp, Target, Star, Briefcase,
  type LucideIcon
} from 'lucide-react';

export interface CaseStudyResult {
  icon: string;
  label: string;
  value: string;
}

export interface CaseStudySEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface CaseStudy {
  _id: string;
  title: string;
  slug: string;
  client: string;
  category: string;
  duration: string;
  icon: string;
  color: string;
  thumbnailImageUrl: string;
  overview: string;
  challenge: string;
  solution: string;
  results: CaseStudyResult[];
  technologies: string[];
  seo: CaseStudySEO;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStudyListResponse {
  success: boolean;
  data: CaseStudy[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Central icon registry: stored value -> component. Unknown names fall back safely.
export const CASE_STUDY_ICONS: Record<string, LucideIcon> = {
  Code, Palette, Database, Bot, Cloud, Smartphone, Globe, Shield,
  BarChart3, ShoppingCart, Users, Settings, Zap, Server, Monitor, Layers,
  TrendingUp, Target, Star, Briefcase
};

export const CASE_STUDY_ICON_NAMES = Object.keys(CASE_STUDY_ICONS);

export const caseStudyIcon = (name: string): LucideIcon =>
  CASE_STUDY_ICONS[name] || Star;

// Controlled gradient allowlist (full literals so Tailwind content scanning keeps them).
export const CASE_STUDY_GRADIENTS = [
  'from-blue-500 to-purple-500',
  'from-cyan-500 to-blue-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-pink-500 to-purple-500',
  'from-indigo-500 to-violet-500',
  'from-yellow-500 to-orange-500',
];

// Seed suggestions only — custom categories are free text.
export const CASE_STUDY_CATEGORY_SUGGESTIONS = [
  'Web Development',
  'App Development',
  'Business Solutions',
  'AI Automation',
  'Custom Software',
  'Digital Marketing',
];

export const emptyCaseStudySeo = (): CaseStudySEO => ({
  metaTitle: '',
  metaDescription: '',
  keywords: []
});
