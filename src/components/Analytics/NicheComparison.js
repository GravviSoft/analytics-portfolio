import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import './Analytics.css';

const NicheComparison = ({ nicheStats }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !nicheStats || nicheStats.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    // Sort by revenue and take top 15
    const topNiches = nicheStats
      .filter(n => n.niche && n.avg_revenue > 0)
      .sort((a, b) => b.avg_revenue - a.avg_revenue)
      .slice(0, 15);

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topNiches.map(n => n.niche),
        datasets: [
          {
            label: 'Avg Revenue',
            data: topNiches.map(n => n.avg_revenue),
            backgroundColor: '#3b82f6',
            borderColor: '#2563eb',
            borderWidth: 1,
            yAxisID: 'y',
          },
          {
            label: 'Avg Saturation',
            data: topNiches.map(n => n.avg_saturation * 100), // convert to percentage
            backgroundColor: '#ef4444',
            borderColor: '#dc2626',
            borderWidth: 1,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#94a3b8',
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            backgroundColor: '#1e293b',
            borderColor: '#334155',
            borderWidth: 1,
            titleColor: '#f1f5f9',
            bodyColor: '#f1f5f9',
            padding: 12,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  if (context.datasetIndex === 0) {
                    label += '$' + context.parsed.y.toLocaleString();
                  } else {
                    label += context.parsed.y.toFixed(1) + '%';
                  }
                }
                return label;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: '#334155',
            },
            ticks: {
              color: '#94a3b8',
              font: {
                size: 10,
              },
              maxRotation: 45,
              minRotation: 45,
            },
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Average Revenue ($)',
              color: '#3b82f6',
              font: {
                size: 12,
              },
            },
            grid: {
              color: '#334155',
            },
            ticks: {
              color: '#94a3b8',
              callback: function(value) {
                return '$' + value.toLocaleString();
              },
            },
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Average Saturation (%)',
              color: '#ef4444',
              font: {
                size: 12,
              },
            },
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              color: '#94a3b8',
              callback: function(value) {
                return value.toFixed(0) + '%';
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [nicheStats]);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Niche Performance Comparison</h3>
          <p className="chart-subtitle">
            Top 15 niches by average revenue vs saturation levels
          </p>
        </div>
      </div>
      <div style={{ height: '400px', position: 'relative' }}>
        <canvas ref={chartRef}></canvas>
      </div>
      <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '8px' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
          <strong style={{ color: 'var(--accent-purple)' }}>📊 Analysis:</strong> Look for niches with high revenue
          (blue bars) and low saturation (low red bars). These offer the best risk/reward ratio for new channels.
        </p>
      </div>
    </div>
  );
};

export default NicheComparison;
