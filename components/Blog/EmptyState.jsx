import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.text_secondary};
  background: ${({ theme }) => theme.card_light + '20'};
  border-radius: 20px;
  border: 1px dashed ${({ theme }) => theme.text_secondary + '40'};
  margin-top: 40px;
  
  h3 {
    font-size: 20px;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.text_primary};
  }
  
  p {
    font-size: 16px;
  }
`;

const EmptyState = ({ message, subMessage }) => {
  return (
    <Container>
      <h3>{message || 'No posts found'}</h3>
      <p>
        {subMessage || 'Try adjusting your search or filters'}
      </p>
    </Container>
  );
};

export default React.memo(EmptyState);
