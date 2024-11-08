import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <DashboardContainer>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div style={{ flexGrow: 1 }}>
        <Header toggleSidebar={toggleSidebar} />
        <MainContent>{children}</MainContent>
        <Footer />
      </div>
    </DashboardContainer>
  );
};

export default DashboardLayout;