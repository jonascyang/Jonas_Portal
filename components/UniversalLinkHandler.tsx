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
      <div className="border border-border p-3">
        {twitterId ? (
          <TwitterTweetEmbed tweetId={twitterId} options={{ align: 'left' }} />
        ) : (
          <LinkCard url={url} label="Visit Tweet" />
        )}
      </div>
    );
  }

  if (embedMode && !iframeFailed) {
    return (
      <iframe
        src={url}
        title={label || 'Embedded content'}
        className="w-full h-[600px] border border-border"
        loading="lazy"
        onError={() => setIframeFailed(true)}
      />
    );
  }

  return <LinkCard url={url} label={label} />;
}
