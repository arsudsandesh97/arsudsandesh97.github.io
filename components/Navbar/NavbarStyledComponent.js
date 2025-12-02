import styled from 'styled-components';

export const Nav = styled.div`
    background-color: ${({theme}) => theme.card_light + "80"};
    backdrop-filter: blur(10px);
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    position: sticky;
    top: 0;
    z-index: 10;
    @media (max-width: 960px) {
        transition: 0.8s all ease;
    }
    @media (max-width: 640px) {
        height: 60px;
    }
`;

export const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  z-index: 1;
  width: 100%;
  padding: 0 24px;
  max-width: 1200px;
  @media (max-width: 640px) {
      padding: 0 16px;
  }
`;

export const NavLogo = styled.div`
    width: 80%;    
    padding: 0 6px;
    display: flex;
    justify-content: start;
    align-items: center;
    text-decoration: none;
    @media (max-width: 640px) {
      padding: 0 0px;
      width: auto;
      flex: 1;
  }
`;

export const Span = styled.div`
    padding: 0 4px;
    font-weight: bold;
    font-size: 18px;
`;

export const NavItems = styled.ul`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content:center;
    gap: 32px;
    padding: 0 6px;
    list-style: none;

    @media screen and (max-width: 768px) {
      display: none;
    }
`;

export const NavLink = styled.a`
    color: ${({ theme }) => theme.text_primary};
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    position: relative;
    
    &:hover {
      color: ${({ theme }) => theme.primary};
      transform: scale(1.05);
    }

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -4px;
      left: 50%;
      background-color: ${({ theme }) => theme.primary};
      transition: all 0.3s ease-in-out;
      transform: translateX(-50%);
    }

    &:hover::after {
      width: 100%;
    }

    &.active {
      color: ${({ theme }) => theme.primary};
      &::after {
        width: 100%;
      }
    }
`;

export const GitHubButton = styled.a`
  border: 1.8px solid ${({ theme }) => theme.primary};
  justify-content: center;
  display: flex;
  align-items: center;
  height: 70%;
  border-radius: 20px;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  padding: 0 20px;
  font-weight: 500;
  text-decoration: none;
  font-size: 16px;
  transition: all 0.6s ease-in-out;
    :hover {
      background: ${({ theme }) => theme.primary};
      color: ${({ theme }) => theme.white};     
    }
    @media screen and (max-width: 768px) { 
      font-size: 14px;
      padding: 0 10px;
      
      .github-text {
        display: none !important;
      }
    }
`;

export const ButtonContainer = styled.div`
  width: 80%;  
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 0 6px;
  @media screen and (max-width: 768px) {
    display: flex;
    width: auto;
    justify-content: center;
  }
`;

export const MobileIcon = styled.div`
  display: none;
  /* 
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 60%);
    font-size: 1.5rem;
    cursor: pointer;
    color: ${({ theme }) => theme.text_primary};
  }
  */
`;

export const MobileMenu = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;
    position: absolute;
    top: 80px;
    right: 0;
    width: 100%;
    padding: 12px 40px 24px 40px;
    background: ${({ theme }) => theme.card_light + "99"};
    transition: all 0.6s ease-in-out;
    transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-100%)')};
    border-radius: 0 0 20px 20px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    opacity: ${({ isOpen }) => (isOpen ? '100%' : '0')};
    z-index: ${({ isOpen }) => (isOpen ? '1000' : '-1000')};
`;

export const MobileLink = styled.a`
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  position: relative;
  display: inline-block;

  &:hover {
    color: ${({ theme }) => theme.primary};
    transform: scale(1.05);
  }

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 50%;
    background-color: ${({ theme }) => theme.primary};
    transition: all 0.3s ease-in-out;
    transform: translateX(-50%);
  }

  &:hover::after {
    width: 100%;
  }

  &.active {
    color: ${({ theme }) => theme.primary};
    &::after {
      width: 100%;
    }
  }
`;

