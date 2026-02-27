import Link from "next/link";
import React from "react";

/* ================= TYPES ================= */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  /** Always safe to use */
  pageTitle?: string;

  /** Optional breadcrumb hierarchy */
  items?: BreadcrumbItem[];

  /** Optional back button */
  backUrl?: string;
}

/* ================= COMPONENT ================= */

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({
  pageTitle,
  items = [],
  backUrl,
}) => {
  /**
   * Determine current page title safely
   * Priority:
   * 1. pageTitle prop
   * 2. last breadcrumb item label
   */
  const currentTitle =
    pageTitle ?? items[items.length - 1]?.label ?? "";

  /**
   * Parents = all items except last
   */
  const parents =
    items.length > 0 ? items.slice(0, -1) : [];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">

      {/* ================= LEFT: BACK + TITLE ================= */}
      <div className="flex items-center gap-3">
        {backUrl && (
          <Link
            href={backUrl}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            ← Back
          </Link>
        )}

        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          {currentTitle}
        </h2>
      </div>

      {/* ================= RIGHT: BREADCRUMB ================= */}
      <nav>
        <ol className="flex items-center gap-1.5">

          {/* Home */}
          <li>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
            >
              Home
              <Chevron />
            </Link>
          </li>

          {/* Parents */}
          {parents.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href ?? "#"}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:underline"
              >
                {item.label}
                <Chevron />
              </Link>
            </li>
          ))}

          {/* Current Page */}
          {currentTitle && (
            <li className="text-sm text-gray-800 dark:text-white/90">
              {currentTitle}
            </li>
          )}
        </ol>
      </nav>
    </div>
  );
};

/* ================= ICON ================= */

const Chevron = () => (
  <svg
    className="stroke-current"
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PageBreadcrumb;