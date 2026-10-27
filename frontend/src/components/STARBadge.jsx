import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export const STARBadge = ({ starAnalysis = {} }) => {
  const { situation, task, action, result, recommendation } = starAnalysis;

  return (
    <div style={{
      background: 'var(--bg-tertiary)',
      padding: '16px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-color)',
      marginTop: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h5 style={{ fontSize: '0.9rem', fontWeight: '700' }}>STAR Behavioral Methodology Breakdown</h5>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Situation → Task → Action → Result</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: situation ? 'var(--accent-success)' : 'var(--text-muted)' }}>
          {situation ? <CheckCircle2 size={16} /> : <XCircle size={16} />} Situation
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: task ? 'var(--accent-success)' : 'var(--text-muted)' }}>
          {task ? <CheckCircle2 size={16} /> : <XCircle size={16} />} Task
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: action ? 'var(--accent-success)' : 'var(--text-muted)' }}>
          {action ? <CheckCircle2 size={16} /> : <XCircle size={16} />} Action
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: result ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
          {result ? <CheckCircle2 size={16} /> : <XCircle size={16} />} Result
        </div>
      </div>

      {recommendation && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
          💡 {recommendation}
        </p>
      )}
    </div>
  );
};
