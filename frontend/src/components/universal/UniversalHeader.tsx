import React from "react";

type UniversalHeaderProps = {
  title: string;
  subtitle?: string;
  additionalInfo: string;
  metaInfo?: Array<{ label: string; value: string }>;
  actions?: React.ReactNode;
};

const UniversalHeader: React.FC<UniversalHeaderProps> = ({
  title,
  subtitle,
  additionalInfo,
  metaInfo = [],
  actions,
}) => {
  return (
    <div className="w-full flex space-x-3 h-40 p-4">
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-gray-700 dark:text-gray-300">{subtitle}</p>
        )}
        <p className="text-gray-600 dark:text-gray-400">{additionalInfo}</p>
      </div>
      <div className="space-y-1">
        {metaInfo.map((meta, index) => (
          <p key={index} className="text-sm text-gray-500 dark:text-gray-300">
            {meta.label}: {meta.value}
          </p>
        ))}
      </div>
      {actions && <div className="mt-2">{actions}</div>}
    </div>
  );
};

export default UniversalHeader;
