import React from 'react';
import { motion } from 'framer-motion';
import { resolveImageUrl } from '../../utils/imageUrl';
import { TrainingListItem } from '../../types/training';
import {
  Clock,
  Laptop,
  GraduationCap,
  Tag,
  Play,
  ArrowRight
} from 'lucide-react';

const modeIcon: Record<string, React.ElementType> = {
  Online: Laptop,
  Offline: Play,
  Hybrid: Play
};

const levelIcon: Record<string, React.ElementType> = {
  Beginner: GraduationCap,
  Intermediate: GraduationCap,
  Advanced: GraduationCap
};

interface TrainingCardProps {
  training: TrainingListItem;
}

export function TrainingCard({ training }: TrainingCardProps) {
  const imageUrl = resolveImageUrl(training.featuredImage);
  const priceLabel = training.paymentType === 'Paid' ? `₹${training.price}` : 'Free';
  const ModeIcon = modeIcon[training.trainingMode] || Play;
  const LevelIcon = levelIcon[training.level] || GraduationCap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      {imageUrl && (
        <div className="mb-4 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img
            src={imageUrl}
            alt={training.title}
            className="w-full h-40 object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
            {training.title}
          </h3>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300 rounded-full">
            {training.category}
          </span>
        </div>
        <a
          href={`/training/${training.slug}`}
          className="block h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
          aria-label={`View details for ${training.title}`}
        >
          <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </a>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm leading-relaxed">
        {training.shortDescription}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          <span>{training.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <ModeIcon className="w-3.5 h-3.5" />
          <span>{training.trainingMode}</span>
        </div>
        <div className="flex items-center gap-2">
          <LevelIcon className="w-3.5 h-3.5" />
          <span>{training.level}</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-3.5 h-3.5" />
          <span>{priceLabel}</span>
        </div>
      </div>

      {training.technologies && training.technologies.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Technologies covered
          </p>
          <div className="flex flex-wrap gap-1.5">
            {training.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      <a
        href={`/training/${training.slug}`}
        className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <span>View Details</span>
        <ArrowRight className="w-4 h-4" />
      </a>
    </motion.div>
  );
}
