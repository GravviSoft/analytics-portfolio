import React from 'react';
import { Link } from 'react-router-dom';
import portfolioProjects from '../constants/portfolioProjects';
import './PortfolioLanding.css';

const PortfolioLanding = () => {
  return (
    <div className="portfolio-landing">
      <section className="portfolio-hero">
        <p className="eyebrow">Portfolio</p>
        <h1>Choose a project to open its dashboard</h1>
        <p className="hero-copy">
          A curated set of 12 projects, each with its own dashboard-style walkthrough. Pick a card to
          dive into the live experience.
        </p>
        <div className="hero-actions">
          <Link className="primary-link" to="/projects/youtube-market-intelligence">Open current dashboard</Link>
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
              <span>View dashboard</span>
              <span className="arrow">→</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default PortfolioLanding;
