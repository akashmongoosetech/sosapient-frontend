import React from 'react';
import './PencilLoader.css';

interface PencilLoaderProps {
  label?: string;
  className?: string;
}

const PencilLoader: React.FC<PencilLoaderProps> = ({ label = 'Loading...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="typewriter">
        <div className="slide"><i></i></div>
        <div className="paper"></div>
        <div className="keyboard"></div>
      </div>
      <div className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300 select-none">
        {label}
      </div>
    </div>
  );
};

export default PencilLoader;
