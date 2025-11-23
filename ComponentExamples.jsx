import React from 'react';
import { clsx } from 'clsx';

// BEFORE: Component with ungrouped Tailwind classes
export const ButtonBefore = ({ children, variant = 'primary', disabled = false }) => {
  return (
    <button
      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-95 transform"
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// AFTER: Component with grouped Tailwind classes
export const ButtonAfter = ({ children, variant = 'primary', disabled = false }) => {
  return (
    <button
      className={clsx(
        // Size
        "h-10 text-sm",
        // Layout
        "inline-flex items-center justify-center",
        // Spacing
        "px-4 py-2",
        // Border
        "rounded-md ring-offset-background",
        // Background
        "bg-primary hover:bg-primary/90",
        // Text
        "font-medium text-primary-foreground",
        // Effects
        "shadow-sm transition-colors transform active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // Others
        "disabled:pointer-events-none disabled:opacity-50"
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Complex Form Example - BEFORE
export const FormFieldBefore = ({ label, error, ...props }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        {label}
      </label>
      <input
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-900"
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

// Complex Form Example - AFTER
export const FormFieldAfter = ({ label, error, ...props }) => {
  return (
    <div className="w-full">
      <label
        className={clsx(
          // Layout
          "block",
          // Spacing
          "mb-1",
          // Text
          "text-sm font-medium text-gray-700 dark:text-gray-200"
        )}
      >
        {label}
      </label>
      <input
        className={clsx(
          // Size
          "w-full sm:text-sm",
          // Layout
          "block",
          // Spacing
          "mt-1 px-3 py-2",
          // Border
          "rounded-md border-gray-300 dark:border-gray-600",
          // Background
          "bg-white dark:bg-gray-800 disabled:bg-gray-50 dark:disabled:bg-gray-900",
          // Text
          "text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
          // Effects
          "shadow-sm focus:border-indigo-500 focus:ring-indigo-500",
          // Others
          "disabled:cursor-not-allowed"
        )}
        {...props}
      />
      {error && (
        <p
          className={clsx(
            // Spacing
            "mt-2",
            // Text
            "text-sm text-red-600 dark:text-red-400"
          )}
        >
          {error}
        </p>
      )}
    </div>
  );
};

// Card Component Example
export const Card = ({ children, className }) => {
  return (
    <div
      className={clsx(
        // Layout
        "relative overflow-hidden",
        // Spacing
        "p-6",
        // Border
        "rounded-lg border border-gray-200 dark:border-gray-700",
        // Background
        "bg-white dark:bg-gray-800",
        // Effects
        "shadow-sm hover:shadow-lg transition-shadow duration-200",
        className
      )}
    >
      {children}
    </div>
  );
};

// Navigation Component with Complex States
export const NavLink = ({ href, children, isActive = false }) => {
  return (
    <a
      href={href}
      className={clsx(
        // Layout
        "relative inline-flex items-center",
        // Spacing
        "px-3 py-2",
        // Border
        "rounded-md",
        // Text
        "text-sm font-medium",
        // States & Variants
        isActive
          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50"
          : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400",
        // Effects
        "transition-colors duration-150",
        // Responsive
        "md:px-4 md:py-2 lg:text-base"
      )}
    >
      {children}
    </a>
  );
};

// Table Cell with Responsive Classes
export const TableCell = ({ children, align = 'left' }) => {
  return (
    <td
      className={clsx(
        // Size
        "text-sm lg:text-base",
        // Layout
        align === 'center' && "text-center",
        align === 'right' && "text-right",
        // Spacing
        "px-3 py-4 sm:px-6",
        // Border
        "border-b border-gray-200 dark:border-gray-700",
        // Text
        "text-gray-900 dark:text-gray-100",
        // Responsive
        "hidden sm:table-cell"
      )}
    >
      {children}
    </td>
  );
};
