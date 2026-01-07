'use client';

import { useMemo, useState } from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed';

interface UniversalLinkHandlerProps {
  url?: string;
  embedMode?: boolean;
  label?: string;
}

function isTwitterUrl(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    return host === 'twitter.com' || host === 'x.com' || host === 'mobile.twitter.com';
  } catch {
    return false;
  }
}

function extractTweetId(url: string) {
  const match = url.match(/status\/(\d+)/);
  return match?.[1] ?? null;
}

function LinkCard({ url, label }: { url: string; label?: string }) {
  const displayText = label || url;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-border p-3 text-sm transition-colors hover:bg-text hover:text-background"
      aria-label={`Open ${url}`}
    >
      <span className="break-all">{displayText}</span>
    </a>
  );
}

export default function UniversalLinkHandler({
  url,
  embedMode = false,
  label,
}: UniversalLinkHandlerProps) {
  const [iframeFailed, setIframeFailed] = useState(false);

  const twitterId = useMemo(() => (url ? extractTweetId(url) : null), [url]);

  if (!url) return null;

  if (isTwitterUrl(url)) {
    return (
      <div className="border border-border bg-background p-3 md:p-4">
        {twitterId ? (
          <div className="max-w-xl mx-auto">
            <TwitterTweetEmbed tweetId={twitterId} options={{ align: 'left' }} />
          </div>
        ) : (
          <LinkCard url={url} label="Visit Tweet" />
        )}
      </div>
    );
  }

  if (embedMode && !iframeFailed) {
    return (
      <div className="border border-border bg-background">
        <div className="flex items-center justify-between border-b border-border px-3 py-2 text-xs uppercase tracking-widest">
          <span>Embedded</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:no-underline"
          >
            Open Original
          </a>
        </div>
        <iframe
          src={url}
          title={label || 'Embedded content'}
          className="w-full h-[560px]"
          loading="lazy"
          onError={() => setIframeFailed(true)}
        />
      </div>
    );
  }

  return <LinkCard url={url} label={label} />;
}
