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
      <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-6">
        <Link
          href="/"
          className="inline-block border border-border px-3 py-2 text-sm transition-colors hover:bg-text hover:text-background"
        >
          {'< Back to Home'}
        </Link>

        {update ? (
          <div className="space-y-4 border border-border p-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{update.title}</h1>
              <p className="text-xs text-text/60">
                {new Date(update.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <span className="text-xs border border-border px-2 py-1 inline-block">
                {update.type}
              </span>
            </div>

            {update.link ? (
              <UniversalLinkHandler
                url={update.link}
                embedMode={update.embedMode}
                label="Visit Source"
              />
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
