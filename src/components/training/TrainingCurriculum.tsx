import { ChevronRight } from 'lucide-react';
import { TrainingCurriculumModule } from '../../types/training';

interface TrainingCurriculumProps {
  modules: TrainingCurriculumModule[];
}

export function TrainingCurriculum({ modules }: TrainingCurriculumProps) {
  if (!modules || modules.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Curriculum / Course Modules
      </h2>
      <div className="space-y-2">
        {modules.map((module, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 text-sm font-semibold">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                {module.title}
              </h4>
              {module.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  {module.description}
                </p>
              )}
            </div>
            {module.hours > 0 && (
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {module.hours} hrs
              </span>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
