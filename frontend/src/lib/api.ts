import type { ProcessResponse, StudentProfile } from './types';

const BASE = 'http://localhost:8000';

export const api = {
  async process(
    emails: Array<{ id: string; subject: string; sender: string; body: string }>,
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
    return r.json();
  },

  async getDemoEmails(): Promise<{ emails: Array<{ id: string; subject: string; sender: string; body: string }> }> {
    const r = await fetch(`${BASE}/demo-emails`);
    return r.json();
  },

  async getDemoProfile(): Promise<StudentProfile> {
    const r = await fetch(`${BASE}/demo-profile`);
    return r.json();
  },
};

export function parseEmailsFromText(raw: string): Array<{ id: string; subject: string; sender: string; body: string }> {
  return raw
    .split(/\n---\n/)
    .map((block, i) => block.trim())
    .filter(Boolean)
    .map((block, i) => {
      const lines = block.split('\n');
      const subjectLine = lines.find(l => l.startsWith('Subject:')) || '';
      const fromLine = lines.find(l => l.startsWith('From:')) || '';
      const bodyStart = lines.findIndex(l => l.trim() === '') + 1;
      return {
        id: `email_${String(i + 1).padStart(3, '0')}`,
        subject: subjectLine.replace('Subject:', '').trim(),
        sender: fromLine.replace('From:', '').trim(),
        body: lines.slice(bodyStart > 0 ? bodyStart : 2).join('\n').trim(),
      };
    });
}

export function formatEmailsToText(emails: Array<{ subject: string; sender: string; body: string }>): string {
  return emails
    .map(e => `Subject: ${e.subject}\nFrom: ${e.sender}\n\n${e.body}`)
    .join('\n---\n');
}
