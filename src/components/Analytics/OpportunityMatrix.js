import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import './Analytics.css';

const OpportunityMatrix = ({ channels }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !channels || channels.length === 0) return;

    // Destroy previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    // Prepare data for scatter plot
    const data = channels.map(channel => ({
      x: channel.saturation_score || 0.5, // saturation (0-1)
      y: channel.rev_sort || 0, // revenue
      label: channel.channel_name,
      niche: channel.niche_category || channel.search_term,
      copycats: channel.copycat_videos_found || 0,
    }));

    // Color by niche
    const niches = [...new Set(data.map(d => d.niche).filter(Boolean))];
    const colors = [
      '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
      '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1',
    ];
    const nicheColorMap = {};
    niches.forEach((niche, i) => {
      nicheColorMap[niche] = colors[i % colors.length];
    });

    chartInstance.current = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: niches.map(niche => ({
          label: niche || 'Unknown',
          data: data.filter(d => d.niche === niche),
          backgroundColor: nicheColorMap[niche] + '80', // 50% opacity
          borderColor: nicheColorMap[niche],
          borderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false,
          },
          legend: {
            display: true,
            position: 'right',
            labels: {
              color: '#94a3b8',
              font: {
                size: 11,
              },
              boxWidth: 10,
              boxHeight: 10,
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
                const point = context.raw;
                return [
                  `Channel: ${point.label}`,
                  `Saturation: ${(point.x * 100).toFixed(1)}%`,
                  `Revenue: $${point.y?.toLocaleString() || 0}`,
                  `Copycats: ${point.copycats}`,
                ];
              },
            },
          },
        },
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Saturation Score (lower = better) →',
              color: '#94a3b8',
              font: {
                size: 12,
              },
            },
            min: 0,
            max: 1,
            grid: {
              color: '#334155',
            },
            ticks: {
              color: '#94a3b8',
              callback: function(value) {
                return (value * 100).toFixed(0) + '%';
              },
            },
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: '↑ Revenue Potential ($)',
              color: '#94a3b8',
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
        },
      },
    });

    // Draw quadrant lines and labels
    const drawQuadrants = () => {
      const chart = chartInstance.current;
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      const xMid = (chartArea.left + chartArea.right) / 2;
      const yMid = (chartArea.top + chartArea.bottom) / 2;

      // Vertical line
      ctx.save();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(xMid, chartArea.top);
      ctx.lineTo(xMid, chartArea.bottom);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(chartArea.left, yMid);
      ctx.lineTo(chartArea.right, yMid);
      ctx.stroke();
      ctx.restore();

      // Quadrant labels
      ctx.save();
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';

      // Top-left: Sweet Spot (low saturation, high revenue)
      ctx.fillStyle = '#10b981';
      ctx.fillText('🎯 SWEET SPOT', chartArea.left + (xMid - chartArea.left) / 2, chartArea.top + 20);

      // Top-right: High Competition
      ctx.fillStyle = '#ef4444';
      ctx.fillText('⚠️ High Competition', chartArea.right - (chartArea.right - xMid) / 2, chartArea.top + 20);

      // Bottom-left: Low Value
      ctx.fillStyle = '#64748b';
      ctx.fillText('Low Value', chartArea.left + (xMid - chartArea.left) / 2, chartArea.bottom - 10);

      // Bottom-right: Saturated Low Value
      ctx.fillStyle = '#64748b';
      ctx.fillText('Avoid', chartArea.right - (chartArea.right - xMid) / 2, chartArea.bottom - 10);

      ctx.restore();
    };

    // Add plugin to draw quadrants
    chartInstance.current.options.plugins.annotation = {
      afterDraw: drawQuadrants,
    };

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [channels]);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Market Opportunity Matrix</h3>
          <p className="chart-subtitle">
            Visual analysis of {channels?.length || 0} channels by saturation and revenue potential
          </p>
        </div>
      </div>
      <div style={{ height: '500px', position: 'relative' }}>
        <canvas ref={chartRef}></canvas>
      </div>
      <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
          <strong style={{ color: 'var(--accent-green)' }}>💡 Pro Tip:</strong> Focus on channels in the top-left
          quadrant (low saturation + high revenue). These represent the best opportunities for quick market entry.
        </p>
      </div>
    </div>
  );
};

export default OpportunityMatrix;
