import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { CaseStudy, caseStudyIcon } from '../../types/caseStudy';
import { stripHtml } from '../../utils/blog';

interface CaseStudyCardProps {
  item: CaseStudy;
  index?: number;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ item, index = 0 }) => {
  const Icon = caseStudyIcon(item.icon);
  const [imgOk, setImgOk] = useState(true);
  const snippet = stripHtml(item.overview || '').slice(0, 150);
  const preview = snippet.length >= 150 ? `${snippet}…` : snippet;
  const firstResult = item.results && item.results.length > 0 ? item.results[0] : null;
  const techs = item.technologies || [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
      viewport={{ once: true }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-xl dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="relative">
        {imgOk ? (
          <img
            src={item.thumbnailImageUrl}
            alt={item.title}
            loading="lazy"
            onError={() => setImgOk(false)}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className={`flex h-48 w-full items-center justify-center bg-gradient-to-r ${item.color}`}>
            <Icon className="h-12 w-12 text-white" aria-hidden="true" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {item.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r ${item.color} text-white`}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <h3 className="line-clamp-2 font-display text-lg font-bold leading-snug text-gray-900 dark:text-white">
            <Link to={`/case-studies/${item.slug}`} className="transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400">
              {item.title}
            </Link>
          </h3>
        </div>

        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          {item.client}
          {item.duration ? ` · ${item.duration}` : ''}
        </p>

        {preview && (
          <p className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">{preview}</p>
        )}

        {techs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {techs.slice(0, 4).map((t) => (
              <span key={t} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {t}
              </span>
            ))}
            {techs.length > 4 && (
              <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-800/30 dark:text-primary-300">
                +{techs.length - 4} more
              </span>
            )}
          </div>
        )}

        {firstResult && (
          <div className="mt-3 flex items-baseline gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">{firstResult.value}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{firstResult.label}</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="inline-flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
          </span>
          <Link
            to={`/case-studies/${item.slug}`}
            aria-label={`View case study: ${item.title}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:gap-2.5 hover:text-primary-700 dark:text-primary-400"
          >
            View Case Study <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default CaseStudyCard;
