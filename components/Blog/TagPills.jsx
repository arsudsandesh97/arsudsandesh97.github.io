import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  max-width: 800px;
  margin-top: 20px;
`;

const Pill = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid ${({ theme, $active }) => $active ? theme.primary : theme.primary + '25'};
  background: ${({ theme, $active }) => $active ? theme.primary + '25' : 'transparent'};
  color: ${({ theme, $active }) => $active ? theme.primary : theme.text_secondary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primary + '15'};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
  
  &[aria-selected="true"] {
    background: ${({ theme }) => theme.primary + '25'};
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
  }
`;

const TagPills = ({ tags, selectedTag, onTagSelect }) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const pillsRef = useRef([]);

  if (!tags || tags.length === 0) return null;

  const allTags = ['All', ...tags];

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % allTags.length;
      setFocusedIndex(nextIndex);
      pillsRef.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + allTags.length) % allTags.length;
      setFocusedIndex(prevIndex);
      pillsRef.current[prevIndex]?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const tag = allTags[index];
      onTagSelect(tag === 'All' ? null : tag);
    }
  };

  return (
    <Container role="listbox" aria-label="Filter by tag">
      {allTags.map((tag, index) => {
        const isSelected = tag === 'All' ? !selectedTag : selectedTag === tag;
        return (
          <Pill
            key={tag}
            ref={el => pillsRef.current[index] = el}
            $active={isSelected}
            onClick={() => onTagSelect(tag === 'All' ? null : tag)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            aria-selected={isSelected}
            role="option"
            tabIndex={focusedIndex === index ? 0 : -1}
          >
            {tag}
          </Pill>
        );
      })}
    </Container>
  );
};

export default React.memo(TagPills);
