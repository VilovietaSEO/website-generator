import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const SidebarContainer = styled.nav`
  width: 250px;
  height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
  position: fixed;
  left: 0;
  top: 0;
`;

const SidebarList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const SidebarItem = styled.li`
  margin-bottom: 10px;
`;

const SidebarLink = styled.a`
  text-decoration: none;
  color: #333;
  font-size: 16px;
  display: block;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e9ecef;
  }

  ${props => props.active && `
    background-color: #007bff;
    color: white;

    &:hover {
      background-color: #0056b3;
    }
  `}
`;

const Sidebar = () => {
  const router = useRouter();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/projects', label: 'Projects' },
    { href: '/dashboard/company-info', label: 'Company Info' },
    { href: '/dashboard/services', label: 'Services' },
    { href: '/dashboard/team-members', label: 'Team Members' },
    { href: '/dashboard/generate-content', label: 'Generate Content' },
    { href: '/dashboard/preview', label: 'Preview' },
  ];

  return (
    <SidebarContainer>
      <SidebarList>
        {menuItems.map((item) => (
          <SidebarItem key={item.href}>
            <Link href={item.href} passHref>
              <SidebarLink active={router.pathname === item.href}>
                {item.label}
              </SidebarLink>
            </Link>
          </SidebarItem>
        ))}
      </SidebarList>
    </SidebarContainer>
  );
};

export default Sidebar;