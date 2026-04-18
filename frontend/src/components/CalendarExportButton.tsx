import { useState } from 'react';
import { Download, Calendar, CheckCircle2 } from 'lucide-react';

interface Props {
  sessionId: string;
}

export function CalendarExportButton({ sessionId }: Props) {
  const [downloaded, setDownloaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/export-ics?session_id=${sessionId}`);
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'opportunity-deadlines.ics';
      a.click();
      URL.revokeObjectURL(url);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch {
      alert('Calendar export failed. Check the backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleExport} disabled={loading}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px',
        borderRadius: 10, cursor: loading ? 'wait' : 'pointer',
        background: downloaded ? 'var(--color-success-glow)' : 'rgba(167,139,250,0.12)',
        border: `1px solid ${downloaded ? 'rgba(52,211,153,0.4)' : 'var(--color-violet-border)'}`,
        color: downloaded ? 'var(--color-success)' : 'var(--color-violet)',
        fontSize: 13, fontWeight: 600, transition: 'all 0.2s ease'
      }}>
      {downloaded ? <CheckCircle2 size={14} /> : loading ? <Download size={14} /> : <Calendar size={14} />}
      {downloaded ? 'Downloaded!' : loading ? 'Exporting...' : 'Export Deadlines to Calendar'}
    </button>
  );
}
