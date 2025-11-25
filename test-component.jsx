import React from 'react';

// Test component with messy Tailwind classes
export const TestButton = () => {
  return (
    <button className={clsx(
    // Size
    "rounded-lg shadow-sm text-sm",
    // Layout
    "flex items-center justify-between",
    // Spacing
    "mt-4 px-6 py-3",
    // Border
    "border",
    // Background
    "bg-white",
    // Text
    "font-medium",
    // States
    "hover:shadow-md dark:bg-gray-800"
  )}>
      Click Me
    </button>
  );
};

// Another test with even more classes
export const TestCard = () => {
  return (
    <div className={clsx(
    // Size
    "w-full h-64 max-w-md rounded-xl shadow-lg hover:shadow-xl",
    // Layout
    "flex flex-col items-start justify-between",
    // Spacing
    "p-4 mx-auto",
    // Border
    "border border-gray-200",
    // Background
    "bg-white",
    // Text
    "text-gray-900",
    // Effects
    "transition-all duration-300",
    // States
    "dark:bg-gray-900 dark:text-white"
  )}>
      <h2>Test Card</h2>
      <p>This should be grouped</p>
    </div>
  );
};
