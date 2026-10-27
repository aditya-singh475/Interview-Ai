import React from 'react';

export const ScoreRadarChart = ({ scores = {} }) => {
  const { technical = 80, communication = 75, problemSolving = 85, behavioral = 78 } = scores;

  return (
    <div style={{
      background: 'var(--bg-card)',
      padding: '20px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Competency Scores Breakdown</h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
            <span>Technical Accuracy</span>
            <span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>{technical}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ width: `${technical}%`, height: '100%', background: 'var(--gradient-primary)', transition: 'width 0.6s ease' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
            <span>Communication & Clarity</span>
            <span style={{ fontWeight: '700', color: 'var(--accent-secondary)' }}>{communication}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ width: `${communication}%`, height: '100%', background: 'var(--gradient-secondary)', transition: 'width 0.6s ease' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
            <span>Problem Solving & Trade-offs</span>
            <span style={{ fontWeight: '700', color: 'var(--accent-success)' }}>{problemSolving}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ width: `${problemSolving}%`, height: '100%', background: 'var(--accent-success)', transition: 'width 0.6s ease' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
            <span>Behavioral Alignment</span>
            <span style={{ fontWeight: '700', color: 'var(--accent-tertiary)' }}>{behavioral}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ width: `${behavioral}%`, height: '100%', background: 'var(--accent-tertiary)', transition: 'width 0.6s ease' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
