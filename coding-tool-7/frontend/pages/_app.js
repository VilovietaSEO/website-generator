import React from 'react';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from '../contexts/AuthContext';
import { ProjectProvider } from '../contexts/ProjectContext';
import GlobalStyle from '../styles/global';
import theme from '../styles/theme';
import ErrorBoundary from '../components/ErrorBoundary';
import Layout from '../components/Layout/DashboardLayout';

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <AuthProvider>
          <ProjectProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ProjectProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default MyApp;