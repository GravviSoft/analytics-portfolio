import React from 'react';
import { Link } from 'react-router-dom';
import portfolioProjects from '../constants/portfolioProjects';
import './PortfolioLanding.css';

const PortfolioLanding = () => {
  return (
    <div className="portfolio-landing">
      <section className="portfolio-hero">
        <p className="eyebrow">Portfolio</p>
        <h1>Explore Analytics Projects</h1>
        <p className="hero-copy">
          Interactive project pages showcasing technical skills in React, Node.js, Flask, PostgreSQL, Python, MongoDB, R, Tableau, Chart.js and more. Explore implementations, features, and real-world applications.

        </p>
        <div className="hero-actions">
          <a className="primary-link repo-chip" href="https://github.com/GravviSoft/analytics-portfolio" target="_blank" rel="noreferrer">
            <span className="repo-logo" aria-hidden="true" />
            <span>View on GitHub</span>
          </a>
          <Link className="ghost-link" to="/about">Skip to about me</Link>
        </div>
      </section>

      <section className="project-grid" aria-label="Portfolio projects">
        {portfolioProjects.map((project) => (
          <Link
            to={`/projects/${project.slug}`}
            key={project.slug}
            className="project-card"
            aria-label={`Open ${project.title}`}
          >
            <div className="project-card-header">
              <span className={`status-pill ${project.accent || 'slate'}`}>{project.status}</span>
              <h3>{project.title}</h3>
              <p className="project-summary">{project.summary}</p>
            </div>
            <div className="badge-row">
              {project.badges?.map((badge) => (
                <span className="pill" key={badge}>{badge}</span>
              ))}
            </div>
            <div className="project-card-footer">
              <span>Explore Project</span>
              <span className="arrow">→</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default PortfolioLanding;
