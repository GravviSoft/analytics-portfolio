import React from 'react';
import { useParams } from 'react-router-dom';
import AnalyticsDashboard from './Analytics/AnalyticsDashboard';
import portfolioProjects from '../constants/portfolioProjects';
import './PortfolioLanding.css';

const ProjectDashboardPage = () => {
  const { projectId } = useParams();
  const projectMeta = portfolioProjects.find((project) => project.slug === projectId);

  return <AnalyticsDashboard projectMeta={projectMeta} />;
};

export default ProjectDashboardPage;
