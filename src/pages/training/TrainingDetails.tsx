import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  Clock,
  Laptop,
  Play,
  GraduationCap,
  Tag,
  Award,
  Share2,
  Copy,
  AlertCircle
} from 'lucide-react';
import { siteUrl, absoluteUrl } from '../../utils/blog';
import { resolveImageUrl } from '../../utils/imageUrl';
import { Training } from '../../types/training';
import { TrainingCurriculum } from '../../components/training/TrainingCurriculum';
import { TrainingFAQ } from '../../components/training/TrainingFAQ';
import { EnrollmentForm } from '../../components/training/EnrollmentForm';
import BlogRichContent from '../../components/Blog/BlogRichContent';

function stripRichText(html: unknown): string {
  if (typeof html !== 'string') return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function isRichHtml(value: unknown): value is string {
  return typeof value === 'string' && value.includes('<') && value.includes('>');
}

const modeLabel: Record<string, string> = {
  Online: 'Online',
  Offline: 'Offline / In-person',
  Hybrid: 'Hybrid'
};

const levelColors: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  Intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  Advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
};

const TrainingDetails: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const handleEnroll = async (data: {
    candidateName: string;
    email: string;
    mobile: string;
    qualification: string;
    organization: string;
    message: string;
  }) => {
    if (!training) return;
    setEnrolling(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/training/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, trainingId: training._id })
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        setEnrollError(errBody.message || 'Enrollment failed');
        setEnrolling(false);
        return;
      }
      const result = await res.json();
      if (!result.success || !result.data) {
        setEnrollError(result?.message || 'Enrollment failed');
        setEnrolling(false);
        return;
      }
      const { enrollmentId, paymentRequired, redirectUrl } = result.data;
      setEnrolling(false);
      navigate(redirectUrl || `/training/payment/${enrollmentId}?status=${paymentRequired ? 'pending' : 'success'}`);
    } catch (e: any) {
      setEnrollError(e?.message || 'Enrollment failed');
      setEnrolling(false);
    }
  };

  useEffect(() => {
    const fetchTraining = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/trainings/public/${slug}`);
        const data = await res.json();
        if (!data?.success || !data.data) {
          throw new Error(data?.message || 'Training not found');
        }
        setTraining(data.data);
      } catch (e: any) {
        setError(e?.message || 'Error fetching training');
      } finally {
        setLoading(false);
      }
    };
    fetchTraining();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500 dark:text-gray-400">Loading training...</p>
        </div>
      </div>
    );
  }

  if (error || !training) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30 mx-auto mb-4">
            <svg className="h-6 w-6 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {error || 'Training not found'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            The training program you requested could not be found.
          </p>
          <button
            onClick={() => navigate('/training')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Training
          </button>
        </div>
      </div>
    );
  }

  const canonical = `${siteUrl()}/training/${training.slug}`;
  const imageUrl = absoluteUrl(training.featuredImage) || resolveImageUrl(training.featuredImage);
  const pageTitle = training.seo?.metaTitle?.trim()
    ? `${training.seo.metaTitle} | SoSapient Training`
    : `${training.title} | Training at SoSapient`;
  const metaDesc = training.seo?.metaDescription?.trim()
    || stripRichText(training.shortDescription).slice(0, 160)
    || `${training.title} — Professional training program at SoSapient`;
  const ogTitle = training.seo?.metaTitle?.trim() || training.title;
  const ogDesc = training.seo?.metaDescription?.trim() || metaDesc;
  const keywords = training.seo?.metaKeywords?.trim()
    || [...training.technologies, training.category, training.level].filter(Boolean).join(', ');
  const ogImage = absoluteUrl(training.seo?.metaTitle && training.featuredImage ? training.featuredImage : '')
    || resolveImageUrl(training.featuredImage)
    || 'https://sosapient.in/logo/Dlogo.png';

  const ModeIcon = training.trainingMode === 'Online' ? Laptop : training.trainingMode === 'Offline' ? Play : Play;
  const LevelIcon = GraduationCap;

  const shareTitle = `${training.title} at SoSapient`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // clipboard may be blocked; nothing else we can do
    }
  };

  const sharePage = async () => {
    const url = window.location.href;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: shareTitle, url });
        return;
      } catch {
        // user cancelled or share is unavailable — fall back to copying
      }
    }
    await copyLink();
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDesc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="SoSapient" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:alt" content={ogTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDesc} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={ogTitle} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: training.title,
            description: stripRichText(training.description).slice(0, 500) || metaDesc,
            provider: {
              '@type': 'Organization',
              name: 'SoSapient',
              url: 'https://sosapient.in/'
            },
            courseMode: training.trainingMode,
            educationalLevel: training.level,
            hasCourseInstance: {
              '@type': 'CourseInstance',
              offers: {
                '@type': 'Offer',
                price: training.paymentType === 'Paid' ? training.amount : 0,
                priceCurrency: training.currency || 'INR',
                availability: 'https://schema.org/InStock'
              }
            },
            datePublished: training.createdAt
          })}
        </script>
      </Helmet>

      {/* Banner */}
      {imageUrl && (
        <section className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={training.title}
            className="w-full h-64 object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 sm:p-8">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300 text-xs font-semibold uppercase tracking-wider mb-2 block">
              {training.category}
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
              {training.title}
            </h1>
            <p className="text-primary-100 dark:text-primary-200 text-lg max-w-xl">
              {training.shortDescription}
            </p>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs + back */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
            <a href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Home
            </a>
            <span className="text-gray-400">/</span>
            <a href="/training" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Training
            </a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white font-medium">{training.title}</span>
          </nav>
          <div className="flex justify-between items-start gap-4 sm:items-center mb-10">
            <button
              onClick={() => navigate('/training')}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Training
            </button>
            <div className="flex gap-2">
              <button
                onClick={copyLink}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                aria-label="Copy link"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={sharePage}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-3 mb-8">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${levelColors[training.level]}`}>
              <LevelIcon className="w-3.5 h-3.5" /> {training.level}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm">
              <ModeIcon className="w-3.5 h-3.5" /> {modeLabel[training.trainingMode]}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm">
              <Clock className="w-3.5 h-3.5" /> {training.duration}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm">
              <Tag className="w-3.5 h-3.5" />
              {training.paymentType === 'Paid'
                ? `${training.currency === 'INR' ? '₹' : ''}${training.amount.toLocaleString()}`
                : 'Free'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left column: content */}
            <div className="lg:col-span-8 space-y-10">
              {/* Full description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Overview</h2>
                {isRichHtml(training.description) ? (
                  <BlogRichContent html={training.description} label="Training description" />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {training.description}
                  </p>
                )}
              </div>

              {/* What You Will Learn */}
              {training.learningOutcomes && training.learningOutcomes.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What You Will Learn</h2>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                    {training.learningOutcomes.map((outcome, idx) => (
                      <li key={idx}>{outcome}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prerequisites */}
              {training.prerequisites && training.prerequisites.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Prerequisites</h2>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                    {training.prerequisites.map((pre, idx) => (
                      <li key={idx}>{pre}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Target Audience */}
              {training.targetAudience && training.targetAudience.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Who Should Enroll</h2>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                    {training.targetAudience.map((aud, idx) => (
                      <li key={idx}>{aud}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies */}
              {training.technologies && training.technologies.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Technologies Covered</h2>
                  <div className="flex flex-wrap gap-2">
                    {training.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Curriculum */}
              <TrainingCurriculum modules={training.curriculum} />

              {/* Trainer */}
              {(training.trainer && (training.trainer.name || training.trainer.designation || training.trainer.bio)) && (
                <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Trainer / Instructor</h2>
                  <div className="flex flex-col md:flex-row gap-6">
                    {training.trainer.image && (
                      <img
                        src={resolveImageUrl(training.trainer.image)}
                        alt={training.trainer.name || 'Trainer'}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {training.trainer.name || 'Instructor'}
                      </h3>
                      {training.trainer.designation && (
                        <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                          {training.trainer.designation}
                        </p>
                      )}
                      {training.trainer.bio && (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {training.trainer.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Certification */}
              {training.certification && training.certification.provided && (
                <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Award className="w-6 h-6 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {training.certification.name || 'Certification'}
                      </h3>
                      {training.certification.description && (
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mt-1">
                          {training.certification.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right column: Enrollment + FAQ */}
            <div className="lg:col-span-4 space-y-8">
              {enrollError && (
                <div className="rounded-lg p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-300">{enrollError}</p>
                  </div>
                </div>
              )}
              <EnrollmentForm training={training} onEnroll={handleEnroll} busy={enrolling} />
              <TrainingFAQ faqs={training.faqs} />
            </div>
          </div>
        </div>
      </section>

      {/* Related trainings */}
      {/* Fetch related trainings client-side from the public list */}
      <RelatedTrainingsSection currentSlug={training.slug} />
    </div>
  );
};

function RelatedTrainingsSection({ currentSlug }: { currentSlug: string }) {
  const [trainings, setTrainings] = useState<Array<{ _id: string; title: string; slug: string; featuredImage: string; shortDescription: string; category: string; duration: string; trainingMode: string; level: string; technologies: string[]; price: number; paymentType: 'Free' | 'Paid'; isFree: boolean; trainer: any; certification: any; createdAt: string }>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    const fetchRelated = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/trainings/public?limit=12`);
        const data = await res.json();
        if (!cancelled && data?.success) {
          const related = (data.data as Array<any>).filter((t: any) => t.slug !== currentSlug).slice(0, 3);
          setTrainings(related);
        }
      } catch {
        // fail silently
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchRelated();
    return () => { cancelled = true; };
  }, [currentSlug]);

  if (loading) return null;
  if (trainings.length === 0) return null;

  return (
    <section className="py-20 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Related Training Programs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainings.map((t) => (
            <div key={t._id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
              {t.featuredImage && (
                <div className="mb-3 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <img
                    src={resolveImageUrl(t.featuredImage)}
                    alt={t.title}
                    className="w-full h-32 object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                {t.title}
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300 rounded-full mb-3 block">
                {t.category}
              </span>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                <Clock className="w-3 h-3" /> {t.duration}
              </div>
              <a
                href={`/training/${t.slug}`}
                className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold text-center hover:shadow-lg transition-all duration-200"
              >
                View Details
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrainingDetails;
