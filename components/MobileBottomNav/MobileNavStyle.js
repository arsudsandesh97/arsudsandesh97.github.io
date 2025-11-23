import styled from 'styled-components';

export const Nav = styled.div`
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 400px;
    height: 64px;
    background-color: ${({ theme }) => theme.card_light + "CC"};
    backdrop-filter: blur(12px);
    border: 1px solid ${({ theme }) => theme.primary + "30"};
    border-radius: 32px;
    z-index: 1000;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    padding: 0 16px;
  }
`;

export const NavItems = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const NavLink = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text_primary};
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  opacity: 0.7;
  gap: 4px;
  padding: 8px;
  border-radius: 12px;

  &:hover {
    color: ${({ theme }) => theme.primary};
    opacity: 1;
    transform: translateY(-2px);
  }

  &.active {
    color: ${({ theme }) => theme.primary};
    opacity: 1;
    background: ${({ theme }) => theme.primary + "15"};
  }

  svg {
    font-size: 20px;
    margin-bottom: 2px;
  }
`;
