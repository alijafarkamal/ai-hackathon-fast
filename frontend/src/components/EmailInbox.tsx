import { useState, useRef } from 'react';
import { Mail, Sparkles, ChevronUp, ChevronDown, Upload, FileText, AlertTriangle } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onLoadDemo: () => void;
  onEmailsParsed?: (emails: any[]) => void;
}

export function EmailInbox({ value, onChange, onLoadDemo, onEmailsParsed }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emailCount = value.trim() ? (value.match(/---EMAIL START---/gi) || []).length : 0;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('http://localhost:8000/upload-emails', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
        throw new Error(err.detail || 'Upload failed');
      }

      const data = await res.json();
      // Convert parsed emails back to text format for display
      const text = data.emails.map((em: any) =>
        `---EMAIL START---\nSubject: ${em.subject}\nFrom: ${em.sender}\nBody: ${em.body}\n---EMAIL END---`
      ).join('\n\n');
      onChange(text);
      if (onEmailsParsed) onEmailsParsed(data.emails);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Make sure the backend is running.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
      borderRadius: 14, overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)'
    }}>
      {/* Card Header */}
      <div style={{
        padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--color-primary-glow)', border: '1px solid var(--color-primary-border)'
          }}>
            <Mail size={14} color="var(--color-primary)" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eaf0' }}>Email Inbox</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-faint)' }}>
              {emailCount > 0 ? `${emailCount} email${emailCount !== 1 ? 's' : ''} loaded` : 'Paste or upload emails'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={onLoadDemo} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 8,
            border: '1px solid var(--color-primary-border)',
            background: 'var(--color-primary-glow)', color: 'var(--color-primary)',
            fontSize: 11.5, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
          }}>
            <Sparkles size={11} /> Load Demo
          </button>

          {/* File Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.eml,.pdf"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="email-file-upload"
          />
          <label htmlFor="email-file-upload" style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: uploading ? 'rgba(251,191,36,0.08)' : 'rgba(255,255,255,0.05)',
            color: uploading ? 'var(--color-warning)' : 'var(--color-text-muted)',
            fontSize: 11.5, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
          }}>
            {uploading ? <FileText size={11} /> : <Upload size={11} />}
            {uploading ? 'Parsing...' : 'Upload File'}
          </label>

          <button onClick={() => setCollapsed(!collapsed)} style={{
            padding: '5px 7px', borderRadius: 8, border: '1px solid var(--color-border)',
            background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer'
          }}>
            {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Format hint */}
          <div style={{ padding: '8px 14px', background: 'rgba(96,165,250,0.04)', borderBottom: '1px solid var(--color-border)' }}>
            <code style={{ fontSize: 10.5, color: 'var(--color-text-faint)', display: 'block', lineHeight: 1.8 }}>
              Paste format: <span style={{ color: 'var(--color-primary)' }}>---EMAIL START---</span>{' '}
              Subject: ... {' | '}
              From: ... {' | '}
              Body: ... {' '}
              <span style={{ color: 'var(--color-primary)' }}>---EMAIL END---</span>
              <span style={{ color: 'var(--color-text-faint)', marginLeft: 12 }}>
                · Or upload .txt / .eml file above (smart format detection)
              </span>
            </code>
          </div>

          {uploadError && (
            <div style={{
              padding: '10px 16px', background: 'var(--color-danger-glow)',
              borderBottom: '1px solid rgba(248,113,113,0.2)',
              display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-danger)'
            }}>
              <AlertTriangle size={12} /> {uploadError}
            </div>
          )}

          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Paste emails here using the format above, or click Load Demo / Upload File..."
            style={{
              width: '100%', minHeight: 260, padding: '14px 16px', resize: 'vertical',
              background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--color-text)', fontSize: 12.5, fontFamily: 'monospace',
              lineHeight: 1.7, display: 'block', boxSizing: 'border-box'
            }}
          />

          {emailCount === 0 && value.trim() && (
            <div style={{ padding: '10px 16px', background: 'var(--color-warning-glow)', borderTop: '1px solid rgba(251,191,36,0.2)', fontSize: 12, color: 'var(--color-warning)' }}>
              ⚠️ No delimited emails found. The system will treat the entire text as one email — you can also use the Upload File button.
            </div>
          )}
          {emailCount > 0 && (
            <div style={{ padding: '10px 16px', background: 'var(--color-success-glow)', borderTop: '1px solid rgba(52,211,153,0.2)', fontSize: 12, color: 'var(--color-success)' }}>
              ✅ {emailCount} email{emailCount !== 1 ? 's' : ''} ready to scan
            </div>
          )}
        </>
      )}
    </div>
  );
}
