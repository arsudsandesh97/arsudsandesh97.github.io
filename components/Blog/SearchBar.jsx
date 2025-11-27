import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search as SearchIcon } from '@mui/icons-material';

const Wrapper = styled.div`
  position: relative;
  max-width: 500px;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 50px 16px 20px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.primary + '25'};
  background: ${({ theme }) => theme.card_light + '50'};
  color: ${({ theme }) => theme.text_primary};
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.card_light};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.primary + '15'};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary + '80'};
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.text_secondary};
  pointer-events: none;
`;

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);
  
  // Custom debounce implementation if hook doesn't exist
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 250);

    return () => clearTimeout(timer);
  }, [value, onSearch]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <Wrapper>
      <label htmlFor="blog-search" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
        Search articles
      </label>
      <Input
        id="blog-search"
        type="text"
        placeholder="Search articles..."
        value={value}
        onChange={handleChange}
        aria-controls="blog-grid"
      />
      <IconWrapper>
        <SearchIcon />
      </IconWrapper>
    </Wrapper>
  );
};

export default React.memo(SearchBar);
