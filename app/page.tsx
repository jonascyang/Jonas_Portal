import Link from 'next/link';
import { Github, Twitter, Mail, Linkedin } from 'lucide-react';
import NotionRenderer from '@/components/NotionRenderer';
import { getLatestInsight, getUpdates, type NotionPage } from '@/lib/notion';

const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID || '';
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch data from Notion (with fallback for missing env var)
  let latestInsight: NotionPage | null = null;
  let updates: NotionPage[] = [];

  if (!NOTION_PAGE_ID) {
    console.warn('NOTION_PAGE_ID environment variable is not set');
  } else {
    try {
      [latestInsight, updates] = await Promise.all([
        getLatestInsight(NOTION_PAGE_ID),
        getUpdates(NOTION_PAGE_ID),
      ]);
    } catch (error) {
      console.error('Failed to fetch Notion data:', error);
    }
  }

  return (
    <main className="min-h-screen bg-background text-text font-mono">
      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-screen">
        {/* Left Column (60%) */}
        <section className="lg:col-span-3 border-r border-border">
          {/* About Me (50%) */}
          <div className="h-[50vh] border-b border-border p-6 md:p-8 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 border-b border-border pb-2">
              {'> About Me'}
            </h2>
            <div className="space-y-4">
              <p>
                I am a software engineer passionate about building elegant solutions
                to complex problems.
              </p>
              <p>
                Currently focused on frontend development, creating meaningful
                digital experiences.
              </p>
              <div className="flex gap-4 pt-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-border hover:bg-border/20 transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-border hover:bg-border/20 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="mailto:hello@example.com"
                  className="p-2 border border-border hover:bg-border/20 transition-colors"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-border hover:bg-border/20 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* My Insight (50%) */}
          <div className="h-[50vh] p-6 md:p-8 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 border-b border-border pb-2">
              {'> My Insight'}
            </h2>
            {latestInsight ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">{latestInsight.title}</h3>
                <p className="text-sm text-text/60">
                  {new Date(latestInsight.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                {latestInsight.content && (
                  <NotionRenderer recordMap={latestInsight.content} />
                )}
              </div>
            ) : (
              <p className="text-text/60">No insights available yet.</p>
            )}
          </div>
        </section>

        {/* Right Column (40%) */}
        <section className="lg:col-span-2 p-6 md:p-8 overflow-y-auto max-h-screen">
          <h2 className="text-lg font-bold mb-4 border-b border-border pb-2">
            {'> Latest Updates'}
          </h2>
          <div className="space-y-4">
            {updates.length > 0 ? (
              updates.map((update) => (
                <Link
                  key={update.id}
                  href={`/updates/${update.id}`}
                  className="group block border border-border p-4 space-y-3 transition-colors hover:bg-text hover:text-background"
                >
                  <h3 className="font-bold">{update.title}</h3>
                  <p className="text-xs text-text/60 group-hover:text-background/70">
                    {new Date(update.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <span className="text-xs border border-border px-2 py-1 inline-block group-hover:border-background">
                    {update.type}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-text/60">No updates available yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
