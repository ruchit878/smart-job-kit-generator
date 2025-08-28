 'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import DashboardButton from '@/components/DashboardButton';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

type QAPair = { q: string; a: string };

const API_URL = process.env.NEXT_PUBLIC_API_BASE;
const QA_POST_PATH = 'generate-question-answers';

export default function QAPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [reportId, setReportId] = useState<string | null>(null);
  const [raw, setRaw] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const jobTitle = typeof window !== 'undefined' ? localStorage.getItem('job_title') || '' : '';
  const companyName = typeof window !== 'undefined' ? localStorage.getItem('company_name') || '' : '';

  useEffect(() => {
    const getReportId = () => {
      if (typeof window === 'undefined') return null;
      const url = new URL(window.location.href);
      return url.searchParams.get('report_id') || localStorage.getItem('report_id');
    };

    const id = getReportId();
    if (!id) {
      setError('Missing report_id.');
      setLoading(false);
      return;
    }
    setReportId(id);
    void loadQA(id);
  }, []);

  const loadQA = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}${QA_POST_PATH}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ report_id: String(id) }),
        cache: 'no-store',
      });

      if (!res.ok) throw new Error(`Failed to generate Q&A (HTTP ${res.status})`);
      const data = await res.json();
      setRaw(String(data?.question_answers || ''));
    } catch (e: any) {
      setError(e?.message || 'Failed to load Q&A');
    } finally {
      setLoading(false);
    }
  };

  const parsed = useMemo(() => parseQAText(raw), [raw]);

  const handleCopyAll = async () => {
    const md = toMarkdown(parsed);
    await navigator.clipboard.writeText(md);
    alert('All Q&A copied to clipboard.');
  };

  const handleDownload = () => {
    const md = toMarkdown(parsed);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeTitle = (jobTitle || 'Interview').replace(/[^\w\-]+/g, '_');
    a.href = url;
    a.download = `${safeTitle}_QA_${reportId || 'report'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = async () => {
    if (reportId) await loadQA(reportId);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <main className="px-4 py-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Interview Q&amp;A</h1>
          <p className="text-sm text-muted-foreground">Build. Prepare. Perform. Get Hired.</p>
        </div>
        <div className="flex gap-2">
          <DashboardButton />
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <section className="max-w-5xl mx-auto p-0">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              {jobTitle ? ` ${jobTitle}` : ''} {companyName ? `@ ${companyName}` : ''}
            </h2>
            {reportId && <p className="text-sm text-muted-foreground">Report ID #{reportId}</p>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRegenerate} className="text-sm">Regenerate</Button>
            <Button onClick={handleCopyAll} className="text-sm">Copy All</Button>
            <Button onClick={handleDownload} className="text-sm">Download .md</Button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground font-medium">Generating Q&amp;A...</p>
            <div className="w-full max-w-3xl space-y-4 mt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 border rounded-xl bg-background shadow-sm animate-pulse">
                  <div className="h-4 w-3/5 bg-muted rounded mb-3" />
                  <div className="h-3 w-11/12 bg-muted rounded mb-2" />
                  <div className="h-3 w-4/5 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="p-6 border rounded-xl bg-red-50 text-red-800">{error}</div>
        ) : parsed.length === 0 ? (
          <div className="p-6 border rounded-xl bg-yellow-50 text-yellow-800">No Q&amp;A found from the API.</div>
        ) : (
          <div className="space-y-4">
            {parsed.map((item, idx) => (<QACard key={idx} index={idx + 1} q={item.q} a={item.a} />))}
          </div>
        )}
      </section>
    </main>
  );
}

function QACard({ index, q, a }: { index: number; q: string; a: string }) {
  const copyOne = async () => {
    const block = `Q${index}: ${q}\n\n${a}\n`;
    await navigator.clipboard.writeText(block);
    alert(`Copied Q${index} to clipboard.`);
  };

  return (
    <div className="p-5 border rounded-xl bg-background shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold">Q{index}: {q}</h3>
        <Button variant="outline" size="sm" onClick={copyOne} className="text-xs">Copy</Button>
      </div>
      <div className="mt-2 text-sm whitespace-pre-wrap leading-6">{a}</div>
    </div>
  );
}

function parseQAText(text: string): Array<{ q: string; a: string }> {
  if (!text) return [];
  const trimmed = text.trim();
  const blocks = trimmed.split(/\n---\n/g);
  const result: Array<{ q: string; a: string }> = [];
  for (const block of blocks) {
    const qMatch = block.match(/Q\d+:\s*([\s\S]*?)(?=\nA\d+:|$)/i);
    const aMatch = block.match(/A\d+:\s*([\s\S]*)/i);
    if (qMatch && aMatch) result.push({ q: qMatch[1].trim(), a: aMatch[1].trim() });
  }
  if (result.length === 0) {
    const re = /Q\d+:\s*([\s\S]*?)\nA\d+:\s*([\s\S]*?)(?=\nQ\d+:|$)/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(trimmed)) !== null) result.push({ q: m[1].trim(), a: m[2].trim() });
  }
  return result;
}

function toMarkdown(items: Array<{ q: string; a: string }>): string {
  if (!items.length) return '';
  return items.map((item, i) => `### Q${i + 1}: ${item.q}\n\n${item.a}\n\n${i < items.length - 1 ? '---\n' : ''}`).join('\n');
}
