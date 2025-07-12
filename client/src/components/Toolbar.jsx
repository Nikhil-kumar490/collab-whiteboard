import React from 'react';

const TOOLS = ['pen', 'eraser', 'rect', 'circle', 'line', 'text'];

export default function Toolbar({ tool, setTool, color, setColor, strokeWidth, setStrokeWidth, onClear, onExport, onUndo }) {
  return (
    <div style={styles.toolbar}>
      {TOOLS.map(t => (
        <button
          key={t}
          onClick={() => setTool(t)}
          style={{ ...styles.btn, ...(tool === t ? styles.active : {}) }}
          title={t}
        >
          {toolIcon(t)}
        </button>
      ))}

      <div style={styles.divider} />

      <input type="color" value={color} onChange={e => setColor(e.target.value)} style={styles.colorPicker} title="Color" />

      <input
        type="range" min="1" max="20" value={strokeWidth}
        onChange={e => setStrokeWidth(Number(e.target.value))}
        style={{ width: 80 }} title="Stroke width"
      />

      <div style={styles.divider} />

      <button onClick={onUndo} style={styles.btn} title="Undo">↩</button>
      <button onClick={onClear} style={{ ...styles.btn, color: '#f87171' }} title="Clear">🗑</button>
      <button onClick={onExport} style={styles.btn} title="Export PNG">💾</button>
    </div>
  );
}

function toolIcon(t) {
  const icons = { pen: '✏️', eraser: '⬜', rect: '▭', circle: '○', line: '╱', text: 'T' };
  return icons[t] || t;
}

const styles = {
  toolbar: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: '#1e293b', padding: '8px 12px',
    borderBottom: '1px solid #334155', flexWrap: 'wrap'
  },
  btn: {
    background: '#334155', border: 'none', color: '#e2e8f0',
    borderRadius: 6, padding: '6px 10px', cursor: 'pointer', fontSize: 16
  },
  active: { background: '#6366f1' },
  divider: { width: 1, height: 28, background: '#475569', margin: '0 4px' },
  colorPicker: { width: 36, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', padding: 2 }
};

# feat-text-tool
