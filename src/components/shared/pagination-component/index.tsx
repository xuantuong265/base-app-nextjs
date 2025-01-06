"use client";

import React from "react";
import { useRouter } from "next/router";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  hrefBuilder?: (page: number) => string;
  ellipsisThreshold?: number;
}

const PaginationComponent = ({
  currentPage,
  totalPages,
  onPageChange,
  hrefBuilder,
  ellipsisThreshold = 2,
}: PaginationProps) => {
  const router = useRouter();

  const pages = React.useMemo(() => {
    const result: (number | "ellipsis")[] = [];

    if (totalPages <= ellipsisThreshold * 2 + 3) {
      for (let i = 1; i <= totalPages; i++) result.push(i);
    } else {
      const left = Math.max(1, currentPage - ellipsisThreshold);
      const right = Math.min(totalPages, currentPage + ellipsisThreshold);

      if (left > 2) result.push(1, "ellipsis");
      else result.push(...Array.from({ length: left - 1 }, (_, i) => i + 1));

      result.push(
        ...Array.from({ length: right - left + 1 }, (_, i) => left + i)
      );

      if (right < totalPages - 1) result.push("ellipsis", totalPages);
      else
        result.push(
          ...Array.from({ length: totalPages - right }, (_, i) => right + 1 + i)
        );
    }

    return result;
  }, [totalPages, currentPage, ellipsisThreshold]);

  const handlePageChange = (page: number) => {
    if (hrefBuilder) {
      router.push(hrefBuilder(page), undefined, { shallow: true });
    }
    onPageChange?.(page);
  };

  return (
    <Pagination>
      <PaginationContent>
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink onClick={() => handlePageChange(page)}>
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
