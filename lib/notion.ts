import { NotionAPI } from 'notion-client';

// Get Notion page ID from environment variable
const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID || '';

const notion = new NotionAPI({
  authToken: process.env.NOTION_TOKEN || undefined,
});

export interface NotionPage {
  id: string;
  title: string;
  date: string;
  type: 'Insight' | 'Update';
  published: boolean;
  content: any;
}

export async function getNotionData(pageId: string) {
  try {
    const recordMap = await notion.getPage(pageId);

    // Extract blocks from the page
    const blocks = Object.values(recordMap.block);

    // Filter for published items and extract metadata
    const items: NotionPage[] = [];

    // Get the collection view blocks (database content)
    const collectionViews = blocks.filter(
      (block: any) => block?.value?.type === 'collection_view'
    );

    for (const view of collectionViews) {
      const viewValue = (view as any).value;
      const viewId = viewValue.id;
      const collectionId = viewValue.collection_id;

      if (recordMap.collection && recordMap.collection[collectionId]) {
        const collection = recordMap.collection[collectionId];
        const schema = collection.value.schema;

        // Get all rows in the collection
        const collectionRows = (recordMap as any).collection_view?.[viewId]?.format?.collection_pointer;
        if (recordMap.block) {
          for (const [blockId, block] of Object.entries(recordMap.block)) {
            const blockValue = (block as any).value;
            if (blockValue?.type === 'page' && blockValue?.parent_id === collectionId) {
              // Extract properties from the block
              const properties = blockValue.properties || {};

              // Check if published
              const published = properties['Published']?.[0]?.[0] === 'Yes';

              // Get type
              const typeRaw = properties['Type']?.[0]?.[0] || '';
              const type = typeRaw.includes('Insight') ? 'Insight' : 'Update';

              // Get title and date
              const title = properties['title']?.[0]?.[0] || 'Untitled';
              const date = properties['Date']?.[0]?.[1]?.[0]?.[0] || new Date().toISOString();

              if (published) {
                items.push({
                  id: blockId,
                  title,
                  date,
                  type,
                  published,
                  content: recordMap,
                });
              }
            }
          }
        }
      }
    }

    return items;
  } catch (error) {
    console.error('Error fetching Notion data:', error);
    return [];
  }
}

export async function getInsights(pageId: string): Promise<NotionPage[]> {
  const items = await getNotionData(pageId);
  return items.filter(item => item.type === 'Insight');
}

export async function getUpdates(pageId: string): Promise<NotionPage[]> {
  const items = await getNotionData(pageId);
  return items.filter(item => item.type === 'Update');
}

export async function getLatestInsight(pageId: string): Promise<NotionPage | null> {
  const insights = await getInsights(pageId);
  return insights.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] || null;
}

export async function getPageRecordMap(pageId: string) {
  return await notion.getPage(pageId);
}
