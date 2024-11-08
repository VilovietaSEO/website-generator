import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  color: #333;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled.a`
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  &.active {
    font-weight: bold;
    background-color: #e0e0e0;
  }
`;

const Header = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (pathname) => router.pathname === pathname;

  return (
    <HeaderContainer>
      <Logo>Website Generator</Logo>
      <Nav>
        {user ? (
          <>
            <Link href="/dashboard" passHref>
              <NavLink className={isActive('/dashboard') ? 'active' : ''}>Dashboard</NavLink>
            </Link>
            <Link href="/dashboard/projects" passHref>
              <NavLink className={isActive('/dashboard/projects') ? 'active' : ''}>Projects</NavLink>
            </Link>
            <NavLink onClick={logout} href="#">Logout</NavLink>
          </>
        ) : (
          <>
            <Link href="/login" passHref>
              <NavLink className={isActive('/login') ? 'active' : ''}>Login</NavLink>
            </Link>
            <Link href="/register" passHref>
              <NavLink className={isActive('/register') ? 'active' : ''}>Register</NavLink>
            </Link>
          </>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header;