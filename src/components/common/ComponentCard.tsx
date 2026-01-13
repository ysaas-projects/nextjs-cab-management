import React from "react";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  action?: React.ReactNode; 
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  action,
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-6 py-5">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>

        {/* Right Action */}
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>

      {/* Body */}
      <div className="border-t border-gray-100 dark:border-gray-800 p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};

export default ComponentCard;
