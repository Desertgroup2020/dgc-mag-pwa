/* eslint-disable react/require-default-props */
/* eslint-disable react/no-array-index-key */
import React from "react";
import { Button } from "../ui/button";
import styles from './style.module.scss';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  // eslint-disable-next-line no-unused-vars
  onPageChange: (page: number) => void;
}

const TypographyButton: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    typographyClassName?: string;
    disabled?: boolean;
}> = ({children,onClick,className, typographyClassName, disabled}) => {
    return (
        <Button onClick={onClick} disabled={disabled} className={`pagination-button ${className || ''}`}>
            <p className={typographyClassName}>
                {children}
            </p>
        </Button>
    )
};

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  const PAGE_DIFFERENCE = 7;
  
  const renderPagination = () => {
    const maxPageButtons = PAGE_DIFFERENCE;
    const totalPagesInRange = Math.min(totalPages, maxPageButtons);
  
    let startPage = Math.max(1, currentPage - Math.floor(totalPagesInRange / 2));
    const endPage = Math.min(totalPages, startPage + totalPagesInRange - 1);
  
    // Handle special cases when the endPage exceeds totalPages
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - totalPagesInRange + 1);
    }
  
    const pageButtons = [];
  
    if (startPage > 1) {
      pageButtons.push(
        <TypographyButton onClick={() => onPageChange(1)}>
          1
        </TypographyButton>
      );
  
      if (startPage > 2) {
        pageButtons.push(<span key="ellipsis-start">...</span>);
      }
    }
    
    for (let i = startPage; i <= endPage; i+=1) {
      if (i === currentPage) {
        pageButtons.push(
          <TypographyButton key={i.toString()} disabled>
            {i}
          </TypographyButton>
        );
      } else {
        pageButtons.push(
          <TypographyButton key={i.toString()} onClick={() => onPageChange(i)}>
            {i}
          </TypographyButton>
        );
      }
    }
  
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(<span key="ellipsis-end">...</span>);
      }
  
      pageButtons.push(
        <TypographyButton
          key={totalPages.toString()}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </TypographyButton>
      );
    }
  
    return (
      // eslint-disable-next-line react/jsx-no-useless-fragment
      <>
        {pageButtons}
      </>
    );
  };
  
  const onPrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const onNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={styles.main_pagination}>
      <TypographyButton onClick={onPrevClick} disabled={isFirstPage}>
        {"<"}
      </TypographyButton>
      {renderPagination()}
      <TypographyButton onClick={onNextClick} disabled={isLastPage}>
        {">"}
      </TypographyButton>
    </div>
  );
};

export default Pagination;
