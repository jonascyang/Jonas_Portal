import Link from 'next/link';
import UniversalLinkHandler from '@/components/UniversalLinkHandler';
import { getUpdateById, type NotionPage } from '@/lib/notion';

const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID || '';
export const dynamic = 'force-dynamic';

export default async function UpdateDetail({
  params,
}: {
  params: { id: string };
}) {
  let update: NotionPage | null = null;

  if (!NOTION_PAGE_ID) {
    console.warn('NOTION_PAGE_ID environment variable is not set');
  } else {
    try {
      update = await getUpdateById(NOTION_PAGE_ID, params.id);
    } catch (error) {
      console.error('Failed to fetch Notion update:', error);
    }
  }

  return (
    <main className="min-h-screen bg-background text-text font-mono">
      <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-border px-3 py-2 text-sm transition-colors hover:bg-text hover:text-background"
          >
            <span aria-hidden>{'<'}</span>
            Back to Home
          </Link>
          {update ? (
            <span className="text-xs uppercase tracking-widest border border-border px-2 py-1">
              Update Log
            </span>
          ) : null}
        </div>

        {update ? (
          <div className="space-y-6">
            <div className="border border-border p-5 space-y-3">
              <h1 className="text-3xl font-bold">{update.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-text/60">
                <span>
                  {new Date(update.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="border border-border px-2 py-1 text-text">
                  {update.type}
                </span>
                {update.link ? (
                  <a
                    href={update.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-border px-2 py-1 text-text hover:bg-text hover:text-background transition-colors"
                  >
                    Open Source
                  </a>
                ) : null}
              </div>
            </div>

            {update.link ? (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest text-text/60">
                  Embedded View
                </p>
                <UniversalLinkHandler
                  url={update.link}
                  embedMode={update.embedMode}
                  label="Visit Source"
                />
              </div>
            ) : (
              <p className="text-text/60 text-sm">No external link provided.</p>
            )}
          </div>
        ) : (
          <div className="border border-border p-4 space-y-2">
            <p className="text-text/60 text-sm">Update not found.</p>
            <Link
              href="/"
              className="inline-block border border-border px-3 py-2 text-sm transition-colors hover:bg-text hover:text-background"
            >
              Return Home
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
