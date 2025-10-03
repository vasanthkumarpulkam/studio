'use client';

import { Button } from './button';

type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;
  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={!canPrev}>First</Button>
      <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={!canPrev}>Prev</Button>
      <span className="text-sm">Page {page} of {totalPages}</span>
      <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={!canNext}>Next</Button>
      <Button variant="outline" size="sm" onClick={() => onPageChange(totalPages)} disabled={!canNext}>Last</Button>
    </div>
  );
}

