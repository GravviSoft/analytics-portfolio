import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../constants/globals';
import './Analytics.css';

const OpportunityFinder = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    maxSaturation: 0.5,
    minRevenue: 1000,
    maxCopycats: 50,
    dateRange: 2, // months
    niche: '',
  });

  useEffect(() => {
    fetchOpportunities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/analytics/opportunities`, {
        params: filters,
      });
      setOpportunities(response.data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateOpportunityScore = (channel) => {
    // Opportunity Score Formula:
    // (1 - saturation) * revenue_potential * recency_factor
    const saturationScore = channel.saturation_score || 0.5;
    const revenueScore = (channel.rev_sort || 0) / 10000; // normalize
    const recencyFactor = channel.days_old ? Math.max(0, 1 - channel.days_old / 60) : 0.5;

    const score = (1 - saturationScore) * revenueScore * recencyFactor * 100;
    return Math.min(100, Math.max(0, score)).toFixed(0);
  };

  const getSaturationBadge = (score) => {
    if (score < 0.3) return <span className="badge success">Low Saturation</span>;
    if (score < 0.6) return <span className="badge warning">Medium Saturation</span>;
    return <span className="badge danger">High Saturation</span>;
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="chart-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Finding opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <label className="filter-label">Max Saturation Score</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={filters.maxSaturation}
            onChange={(e) => handleFilterChange('maxSaturation', parseFloat(e.target.value))}
            className="filter-input"
          />
          <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>
            {filters.maxSaturation.toFixed(1)}
          </span>
        </div>

        <div className="filter-group">
          <label className="filter-label">Min Monthly Revenue</label>
          <input
            type="number"
            value={filters.minRevenue}
            onChange={(e) => handleFilterChange('minRevenue', parseInt(e.target.value))}
            className="filter-input"
            placeholder="1000"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Max Copycats</label>
          <input
            type="number"
            value={filters.maxCopycats}
            onChange={(e) => handleFilterChange('maxCopycats', parseInt(e.target.value))}
            className="filter-input"
            placeholder="50"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Date Range (months)</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', parseInt(e.target.value))}
            className="filter-input"
          >
            <option value={1}>Last 1 month</option>
            <option value={2}>Last 2 months</option>
            <option value={3}>Last 3 months</option>
            <option value={4}>Last 4 months</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Niche Category</label>
          <input
            type="text"
            value={filters.niche}
            onChange={(e) => handleFilterChange('niche', e.target.value)}
            className="filter-input"
            placeholder="e.g., gaming, finance"
          />
        </div>

        <div className="filter-group" style={{ marginTop: 'auto' }}>
          <button onClick={fetchOpportunities} className="btn btn-primary">
            🔍 Search
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="chart-container">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">High-Opportunity Channels</h3>
            <p className="chart-subtitle">
              Found {opportunities.length} channels matching your criteria
            </p>
          </div>
        </div>

        {opportunities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No opportunities found</h3>
            <p className="empty-state-description">
              Try adjusting your filters to see more results
            </p>
          </div>
        ) : (
          <table className="opportunity-table">
            <thead>
              <tr>
                <th>Score</th>
                <th>Channel</th>
                <th>Niche</th>
                <th>Saturation</th>
                <th>Copycats</th>
                <th>Revenue/Month</th>
                <th>First Upload</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((channel, index) => {
                const score = calculateOpportunityScore(channel);
                return (
                  <tr key={index}>
                    <td>
                      <div className={`score-badge ${getScoreBadgeClass(score)}`}>
                        {score}
                      </div>
                    </td>
                    <td>
                      <a
                        href={channel.channel_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}
                      >
                        {channel.channel_name}
                      </a>
                    </td>
                    <td>{channel.niche_category || channel.search_term || 'N/A'}</td>
                    <td>
                      {getSaturationBadge(channel.saturation_score || 0)}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {(channel.saturation_score || 0).toFixed(2)}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          channel.copycat_videos_found < 20 ? 'success' :
                          channel.copycat_videos_found < 50 ? 'warning' : 'danger'
                        }`}
                      >
                        {channel.copycat_videos_found || channel.top_vid_copycats || 0}
                      </span>
                    </td>
                    <td>
                      <strong>{channel.revenue_last_month || 'N/A'}</strong>
                    </td>
                    <td>
                      {channel.first_upload_date
                        ? new Date(channel.first_upload_date).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td>
                      <button className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>
                        📊 Analyze
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OpportunityFinder;
