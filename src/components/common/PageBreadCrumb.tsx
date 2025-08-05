'use client'

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  pageTitle: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle }) => {
  const pathname = usePathname()
  const path = pathname.split("/").filter(Boolean)
  
  return (
    <div className="flex flex-wrap items-center justify-start gap-3 mb-6">
      <nav>
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              href="/"
            >
              Home
              <ChevronRight />
            </Link>
          </li>

          {path.map((segment, index) => {
            const href = '/' + path.slice(0, index + 1).join('/');
            const isLast = index === path.length - 1;

            return (
              <li key={index}>
                {isLast ? (
                  <span className="text-sm text-gray-800 dark:text-white/90 capitalize">
                    {pageTitle || segment}
                  </span>
                ) : (
                  <Link
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 capitalize"
                    href={href}
                  >
                    {segment}
                    <ChevronRight/>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
