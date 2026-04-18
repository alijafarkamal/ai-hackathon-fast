import type { ProcessResponse, StudentProfile, RawEmail } from './types';

const BASE = 'http://localhost:8000';

export const api = {
  async process(
    emails: RawEmail[],
    profile: StudentProfile
  ): Promise<ProcessResponse> {
    const r = await fetch(`${BASE}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emails, profile }),
    });
    if (!r.ok) {
      const text = await r.text();
      throw new Error(text || `HTTP ${r.status}`);
    }
    const data = await r.json();
    if (data.error) {
      // Backend returned an error inside a 200 response
      console.error('[api] Backend error:', data.error);
      // Still return the data so UI can show partial results
    }
    return data;
  },

  async getDemoEmails(): Promise<{ emails: RawEmail[] }> {
    const r = await fetch(`${BASE}/demo-emails`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  },

  async getDemoProfile(): Promise<StudentProfile> {
    const r = await fetch(`${BASE}/demo-profile`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  },
};

/**
 * Parse emails from the ---EMAIL START--- / ---EMAIL END--- format.
 * Falls back to "From:" header-based parsing and finally single-email fallback.
 */
export function parseEmailsFromText(raw: string): RawEmail[] {
  if (!raw.trim()) return [];

  // Format 1: ---EMAIL START--- / ---EMAIL END--- delimited
  const startPattern = /---EMAIL\s*START---/gi;
  if (startPattern.test(raw)) {
    const blocks = raw.split(/---EMAIL\s*START---/gi).slice(1);
    return blocks.map((block, i) => {
      const body_block = block.split(/---EMAIL\s*END---/gi)[0] || block;
      const subj = body_block.match(/Subject:\s*(.+)/i)?.[1]?.trim() || `Email ${i + 1}`;
      const from = body_block.match(/From:\s*(.+)/i)?.[1]?.trim() || 'unknown@email.com';
      const bodyMatch = body_block.match(/Body:\s*([\s\S]*)/i);
      const body = bodyMatch ? bodyMatch[1].trim() : body_block.trim();
      return {
        id: `email_${String(i + 1).padStart(3, '0')}`,
        subject: subj,
        sender: from,
        body: body.slice(0, 5000),
        received_date: new Date().toISOString().split('T')[0],
      };
    }).filter(e => e.body.length > 5);
  }

  // Format 2: "From:" header-based parsing (standard email)
  const fromParts = raw.split(/\n(?=From:\s)/);
  if (fromParts.length > 1) {
    return fromParts.map((part, i) => {
      const subj = part.match(/Subject:\s*(.+)/i)?.[1]?.trim() || `Email ${i + 1}`;
      const from = part.match(/From:\s*(.+)/i)?.[1]?.trim() || 'unknown@email.com';
      const lines = part.split('\n').filter(l => !l.match(/^(From|To|Subject|Date|CC|BCC):/i));
      return {
        id: `email_${String(i + 1).padStart(3, '0')}`,
        subject: subj,
        sender: from,
        body: lines.join('\n').trim().slice(0, 5000),
        received_date: new Date().toISOString().split('T')[0],
      };
    }).filter(e => e.body.length > 5);
  }

  // Format 3: --- separator
  const dashParts = raw.split(/\n---\n/);
  if (dashParts.length > 1) {
    return dashParts.map((block, i) => {
      const lines = block.split('\n');
      const subj = lines.find(l => l.startsWith('Subject:'))?.replace('Subject:', '').trim() || `Email ${i + 1}`;
      const from = lines.find(l => l.startsWith('From:'))?.replace('From:', '').trim() || 'unknown@email.com';
      return {
        id: `email_${String(i + 1).padStart(3, '0')}`,
        subject: subj,
        sender: from,
        body: lines.slice(2).join('\n').trim().slice(0, 5000),
        received_date: new Date().toISOString().split('T')[0],
      };
    }).filter(e => e.body.length > 5);
  }

  // Fallback: single email
  return [{
    id: 'email_001',
    subject: raw.split('\n')[0].slice(0, 80) || 'Pasted Email',
    sender: 'unknown@email.com',
    body: raw.slice(0, 5000),
    received_date: new Date().toISOString().split('T')[0],
  }];
}

export function formatEmailsToText(emails: RawEmail[]): string {
  return emails.map(e =>
    `---EMAIL START---\nSubject: ${e.subject}\nFrom: ${e.sender}\nBody: ${e.body}\n---EMAIL END---`
  ).join('\n\n');
}
