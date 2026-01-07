'use client';

import { NotionRenderer as ReactNotionRenderer } from 'react-notion-x';
import '@/styles/notion.css';

interface NotionRendererProps {
  recordMap: any;
  className?: string;
}

export default function NotionRenderer({ recordMap, className = '' }: NotionRendererProps) {
  return (
    <div className={`notion-renderer ${className}`}>
      <ReactNotionRenderer
        recordMap={recordMap}
        fullPage={false}
        disableHeader
        showCollectionViewDropdown={false}
      />
    </div>
  );
}
