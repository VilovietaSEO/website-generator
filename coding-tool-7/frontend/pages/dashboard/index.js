import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { getProjects } from '../../services/api/projectService';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/Dashboard.module.css';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch projects. Please try again later.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    router.push('/dashboard/projects/new');
  };

  const handleProjectClick = (projectId) => {
    router.push(`/dashboard/projects/${projectId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <DashboardLayout>
      <div className={styles.dashboardContainer}>
        <h1 className={styles.dashboardTitle}>Welcome, {user.name}</h1>
        <Button onClick={handleCreateProject}>Create New Project</Button>
        <div className={styles.projectsGrid}>
          {projects.map((project) => (
            <Card key={project.id} className={styles.projectCard} onClick={() => handleProjectClick(project.id)}>
              <h3>{project.name}</h3>
              <p>Status: {project.status}</p>
              <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
            </Card>
          ))}
        </div>
        {projects.length === 0 && (
          <p className={styles.noProjects}>You haven't created any projects yet. Click "Create New Project" to get started!</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;