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

        // Build a mapping from property names to their internal IDs
        const propMap: Record<string, string> = {};
        Object.entries(schema).forEach(([id, prop]: [string, any]) => {
          propMap[prop.name] = id;
        });

        const publishedPropId = propMap['Published'];
        const typePropId = propMap['Type'];
        const datePropId = propMap['Date'];

        // Get all rows in the collection
        if (recordMap.block) {
          for (const [blockId, block] of Object.entries(recordMap.block)) {
            const blockValue = (block as any).value;
            if (blockValue?.type === 'page' && blockValue?.parent_id === collectionId) {
              // Extract properties from the block
              const properties = blockValue.properties || {};

              // Check if published - checkbox is true if it exists and is checked
              const published = publishedPropId ? properties[publishedPropId]?.[0]?.[0] === 'Yes' : true;

              // Get type
              let type: 'Insight' | 'Update' = 'Update';
              if (typePropId) {
                const typeRaw = properties[typePropId]?.[0]?.[0] || '';
                type = typeRaw.includes('Insight') ? 'Insight' : 'Update';
              }

              // Get title
              const title = properties['title']?.[0]?.[0] || 'Untitled';

              // Get date (use created time if no date property)
              let date = new Date().toISOString();
              if (datePropId && properties[datePropId]) {
                const dateVal = properties[datePropId]?.[0]?.[1]?.[0]?.[0];
                if (dateVal) date = dateVal;
              } else if (blockValue.created_time) {
                date = new Date(blockValue.created_time).toISOString();
              }

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
