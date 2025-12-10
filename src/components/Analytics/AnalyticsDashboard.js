import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../PortfolioLanding.css';
import './Analytics.css';

const AnalyticsDashboard = ({ projectMeta }) => {
  const [stats, setStats] = useState(null);
  const [allChannels, setAllChannels] = useState(null);
  const [allVideos, setAllVideos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const defaultProjectMeta = {
    title: 'YouTube Market Intelligence Platform',
    summary: 'Real-time market analysis for identifying high-opportunity YouTube niches with low saturation and high revenue potential.',
    status: 'Portfolio project',
    badges: ['Analytics', 'React', 'Node'],
    accent: 'blue'
  };

  const meta = { ...defaultProjectMeta, ...(projectMeta || {}) };
  const repoUrl = meta.githubUrl || 'https://github.com/GravviSoft/youtube-market-intelligence';

  useEffect(() => {
    // Fetch data once on page load
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Use environment-based server URL
      const serverUrl = process.env.REACT_APP_API_URL || 'http://localhost:4005';

      // Fetch summary stats
      const statsResponse = await axios.get(`${serverUrl}/analytics/stats`);
      setStats(statsResponse.data);

      // Fetch accurate channel and video counts from dedicated endpoints
      const allChannelsResponse = await axios.get(`${serverUrl}/allchannels`);
      setAllChannels(allChannelsResponse.data);

      const allVideosResponse = await axios.get(`${serverUrl}/allvideos`);
      setAllVideos(allVideosResponse.data);

    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set mock data for development
      setStats({
        totalChannels: 475258,
        totalVideos: 643277,
        highOpportunityCount: 1243,
        avgRevenue: 2847,
        newChannelsFourWeeks: 342,
        viralSmallChannels: 1150,
        lowSaturationCount: 847,
        channelsGrowth: 12.4,
        videosGrowth: 8.7,
        opportunitiesGrowth: 23.1,
        revenueGrowth: 5.3,
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics-website', label: 'Analytics Website' },
    { id: 'tableau', label: 'Tableau' },
    { id: 'r', label: 'R' },
    { id: 'conclusions', label: 'Conclusions' },
  ];

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <div className="project-meta-row">
            <Link className="back-link" to="/">← All projects</Link>
            <span className={`status-pill ${meta.accent || 'slate'}`}>{meta.status}</span>
          </div>
          <h1>{meta.title}</h1>
          <p>{meta.summary}</p>
          {meta.badges?.length ? (
            <div className="badge-row project-badges">
              {meta.badges.map((badge) => (
                <span className="pill" key={badge}>{badge}</span>
              ))}
            </div>
          ) : null}
          {/* Live Demo Link */}
          {meta.liveUrl && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <a
                href={meta.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--accent-blue)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A1.75 1.75 0 0 1 15 5.75v8.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25v-8.5A1.75 1.75 0 0 1 2.75 4H3V2.75A.75.75 0 0 1 3.75 2zm-1 5.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5h-11z"/>
                </svg>
                Live Demo
              </a>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <a className="repo-chip" href={repoUrl} target="_blank" rel="noreferrer">
            <span className="repo-logo" aria-hidden="true" />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent',
              color: activeTab === tab.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
              border: 'none',
              padding: '1rem 1.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: activeTab === tab.id ? '600' : '400',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-blue)' : '2px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          {/* Dynamic Overview Content */}
          {meta.overviewContent && (
            <div className="chart-container">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">{meta.overviewContent.title}</h3>
                  <p className="chart-subtitle">{meta.overviewContent.subtitle}</p>
                </div>
              </div>
              <div style={{ padding: '2rem', lineHeight: '1.8' }}>
                {meta.overviewContent.sections?.map((section, index) => (
                  <div key={index} style={{ marginBottom: '2rem' }}>
                    <h4 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)', fontSize: '1.125rem' }}>
                      {section.heading}
                    </h4>
                    <p style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                      {section.content}
                    </p>

                    {/* Render highlights if present */}
                    {section.highlights && (
                      <div style={{ margin: '1.5rem 0', padding: '1.5rem', background: 'var(--bg-elevated)', borderRadius: '8px' }}>
                        {section.highlights.map((highlight, hIndex) => (
                          <div key={hIndex} style={{ marginBottom: hIndex < section.highlights.length - 1 ? '1.5rem' : '0' }}>
                            <p style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
                              <strong>{highlight.label}:</strong> {highlight.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Render callout if present */}
                    {section.callout && (
                      <div style={{
                        margin: '1.5rem 0',
                        padding: '1.5rem',
                        background: section.calloutType === 'success'
                          ? 'rgba(16, 185, 129, 0.05)'
                          : 'rgba(59, 130, 246, 0.05)',
                        borderRadius: '8px',
                        borderLeft: section.calloutType === 'success'
                          ? '4px solid var(--accent-green)'
                          : '4px solid var(--accent-blue)'
                      }}>
                        <p style={{ margin: '0', fontSize: '1.0625rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                          {section.callout}
                        </p>
                      </div>
                    )}

                    {/* Render list if present */}
                    {section.list && (
                      <ul style={{ margin: '0', paddingLeft: '1.5rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                        {section.list.map((item, lIndex) => (
                          <li key={lIndex} style={{ marginBottom: '1rem' }}>
                            <strong>{item.label}:</strong> {item.description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics-website' && (
        <div>
          <div className="chart-container">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Analytics Website</h3>
                <p className="chart-subtitle">Real-time analytics dashboard built with React and WebSockets</p>
              </div>
            </div>
            <div style={{ padding: '2rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Content coming soon...</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tableau' && (
        <div>
          <div className="chart-container">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Tableau Visualizations</h3>
                <p className="chart-subtitle">Interactive data visualizations and dashboards</p>
              </div>
            </div>
            <div style={{ padding: '2rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Content coming soon...</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'r' && (
        <div>
          <div className="chart-container">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">R Statistical Analysis</h3>
                <p className="chart-subtitle">Advanced statistical analysis and modeling</p>
              </div>
            </div>
            <div style={{ padding: '2rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Content coming soon...</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'conclusions' && (
        <div>
          <div className="chart-container">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Conclusions</h3>
                <p className="chart-subtitle">Key insights and findings based on the data</p>
              </div>
            </div>
            <div style={{ padding: '2rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Analysis and conclusions based on data coming soon...</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div style={{
        marginTop: '4rem',
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-muted)',
        fontSize: '0.875rem',
      }}>
        <p>
          <span style={{ color: 'var(--accent-green)', fontWeight: '600' }}>● Live</span> Data snapshot • Tracking {allVideos?.totalVideos?.toLocaleString() || 0} videos • Tracking {allChannels?.totalChannels?.toLocaleString() || 0} channels
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          Full-stack analytics platform built with React, Node.js, PostgreSQL, Chart.js for data visualization, with Tableau & R for advanced analysis
        </p>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
