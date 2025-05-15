
import React from 'react';
import { Library } from '@/lib/type';

interface Props {
  libraries: Library[];
}

export const ComparisonTable: React.FC<Props> = ({ libraries }) => {
  const attributes = [
    { label: 'Version', key: 'version' },
    { label: 'Category', key: 'category' },
    { label: 'License', key: 'license' },
    { label: 'Cost', key: 'cost' },
    { label: 'Size', key: 'size' },
    { label: 'Stars', key: 'stars' },
    { label: 'Last Updated', key: 'lastUpdated' },
  ];

  const formatValue = (key: string, value: unknown): string => {
    if (!value) return 'N/A';

    if (key === 'lastUpdated') {
      try {
        if (
          typeof value === 'object' &&
          value !== null &&
          'toDate' in value &&
          typeof (value as { toDate: () => Date }).toDate === 'function'
        ) {
          return (value as { toDate: () => Date }).toDate().toLocaleDateString();
        }
      } catch {
        return 'Invalid Date';
      }
    }

    return typeof value === 'string' || typeof value === 'number'
      ? value.toString()
      : 'N/A';
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full table-auto border border-gray-200 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-left">
            <th className="p-3 font-semibold">Attribute</th>
            {libraries.map((lib) => (
              <th key={lib.id} className="p-3 font-semibold">
                {lib.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attributes.map(({ label, key }) => (
            <tr key={key} className="border-t border-gray-200 dark:border-gray-700">
              <td className="p-3 font-medium">{label}</td>
              {libraries.map((lib) => (
                <td key={lib.id + key} className="p-3">
                  {formatValue(key, lib[key as keyof Library])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
