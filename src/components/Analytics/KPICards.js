import React from 'react';
import './Analytics.css';

const KPICards = ({ stats }) => {
  const kpis = [
    {
      label: 'Videos Analyzed',
      value: stats?.totalVideos?.toLocaleString() || '0',
      icon: '🎬',
      color: 'purple',
      change: stats?.videosGrowth || null,
    },
    {
      label: 'Total Channels Tracked',
      value: stats?.totalChannels?.toLocaleString() || '0',
      icon: '📺',
      color: 'blue',
      change: stats?.channelsGrowth || null,
    },
    {
      label: 'High Opportunity Niches',
      value: stats?.highOpportunityCount?.toLocaleString() || '0',
      icon: '🎯',
      color: 'green',
      change: stats?.opportunitiesGrowth || null,
    },
    {
      label: 'Avg Revenue Potential',
      value: stats?.avgRevenue ? `$${stats.avgRevenue.toLocaleString()}` : '$0',
      icon: '💰',
      color: 'green',
      change: stats?.revenueGrowth || null,
    },
    {
      label: 'New Channels (4 weeks)',
      value: stats?.newChannelsFourWeeks?.toLocaleString() || '0',
      icon: '⚡',
      color: 'blue',
      change: null,
      viralInfo: stats?.viralSmallChannels || 0,
    },
    {
      label: 'Low Saturation Niches',
      value: stats?.lowSaturationCount?.toLocaleString() || '0',
      icon: '🔓',
      color: 'purple',
      change: null,
    },
  ];

  return (
    <div className="kpi-grid">
      {kpis.map((kpi, index) => (
        <div key={index} className={`kpi-card ${kpi.color}`}>
          <div className="kpi-icon">{kpi.icon}</div>
          <div className="kpi-label">{kpi.label}</div>
          <div className="kpi-value">{kpi.value}</div>
          {kpi.change && (
            <div className={`kpi-change ${kpi.change > 0 ? 'positive' : 'negative'}`}>
              <span>{kpi.change > 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(kpi.change)}%</span>
              <span style={{ color: 'var(--text-muted)' }}>vs last week</span>
            </div>
          )}
          {kpi.viralInfo !== undefined && (
            <div className="kpi-change positive" style={{ marginTop: '0.5rem' }}>
              {kpi.viralInfo > 0 && (
                <>
                  <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>🚀</span>
                  <span>{kpi.viralInfo.toLocaleString()}</span>
                </>
              )}
              <span style={{ color: 'var(--accent-blue)', fontWeight: '500' }}>Views &gt; 100k</span>
              <span style={{ color: 'var(--text-muted)' }}>+</span>
              <span style={{ color: 'var(--accent-purple)', fontWeight: '500' }}>Subs &lt; 100k</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default KPICards;
