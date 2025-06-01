import React from 'react';
import { Button, Text } from '@fluentui/react-components';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '16px 0' }}>
      <Button size="small" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        前へ
      </Button>
      {pages.map(page => (
        <Button
          key={page}
          size="small"
          appearance={page === currentPage ? 'primary' : 'secondary'}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      <Button size="small" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        次へ
      </Button>
      <Text style={{ marginLeft: 8 }}>
        {currentPage} / {totalPages}
      </Text>
    </div>
  );
};
