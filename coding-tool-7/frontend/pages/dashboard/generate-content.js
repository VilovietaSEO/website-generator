import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/UI/Button';
import Spinner from '../../components/UI/Spinner';
import ToastNotification from '../../components/UI/ToastNotification';
import { contentGenerationService } from '../../services/api/contentGenerationService';

const GenerateContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const { projectId } = router.query;

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleGenerateContent = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await contentGenerationService.generateContent(projectId);
      setGeneratedContent(response.data);
    } catch (err) {
      setError('Failed to generate content. Please try again.');
      console.error('Content generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContent = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await contentGenerationService.saveGeneratedContent(projectId, generatedContent);
      router.push(`/dashboard/projects/${projectId}/preview`);
    } catch (err) {
      setError('Failed to save content. Please try again.');
      console.error('Content saving error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="generate-content-container">
        <h1>Generate Website Content</h1>
        {!generatedContent && (
          <Button onClick={handleGenerateContent} disabled={isLoading}>
            {isLoading ? <Spinner /> : 'Generate Content'}
          </Button>
        )}
        {generatedContent && (
          <div className="generated-content">
            <h2>Generated Content</h2>
            <div className="content-preview">
              {/* Display generated content here */}
              <pre>{JSON.stringify(generatedContent, null, 2)}</pre>
            </div>
            <Button onClick={handleSaveContent} disabled={isLoading}>
              {isLoading ? <Spinner /> : 'Save and Preview'}
            </Button>
          </div>
        )}
        {error && <ToastNotification message={error} type="error" />}
      </div>
      <style jsx>{`
        .generate-content-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .content-preview {
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 20px;
          margin-top: 20px;
          max-height: 400px;
          overflow-y: auto;
        }
        h1 {
          margin-bottom: 20px;
        }
        h2 {
          margin-top: 30px;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default GenerateContent;