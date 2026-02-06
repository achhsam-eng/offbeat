export const runtime = 'nodejs';
export const maxDuration = 60;

import Anthropic from '@anthropic-ai/sdk';

async function searchDiscogs(query) {
  const url = `https://api.discogs.com/database/search?q=${encodeURIComponent(query)}&type=release&token=${process.env.DISCOGS_TOKEN}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data.results || data.results.length === 0) {
    throw new Error('No results found');
  }
  
  return data.results[0];
}

async function getReleaseDetails(resourceUrl) {
  const url = `${resourceUrl}?token=${process.env.DISCOGS_TOKEN}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data;
}

async function getExplanation(recordData) {
  // TEST 1: Log the API key
  console.log('=== ENV VAR TEST ===');
  console.log('ANTHROPIC_API_KEY exists:', !!process.env.ANTHROPIC_API_KEY);
  console.log('ANTHROPIC_API_KEY length:', process.env.ANTHROPIC_API_KEY?.length);
  console.log('ANTHROPIC_API_KEY first 30 chars:', process.env.ANTHROPIC_API_KEY?.substring(0, 30));
  console.log('===================');

  // TEST 2: Initialize Anthropic inside the function
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const wantCount = recordData.community?.want || 0;
  const haveCount = recordData.community?.have || 0;
  const demand = wantCount > haveCount ? "high demand" : wantCount > haveCount * 0.5 ? "moderate demand" : "relatively available";
  
  const pricingInfo = recordData.lowest_price 
    ? `Lowest current price: $${recordData.lowest_price} (${recordData.num_for_sale} available for sale)`
    : "Not currently available for sale on the marketplace";
  
  try {
    console.log('About to call Anthropic API...');
    
    // TEST 3: Remove web_search to test permissions
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You're a knowledgeable record store employee helping a customer understand this specific record. Don't explain basic vinyl terminology unless it's unusual.

Record: ${recordData.title}
Year: ${recordData.year}
Label: ${recordData.label?.[0] || 'Unknown'}
Format: ${recordData.format?.join(', ')}
Country: ${recordData.country || 'Unknown'}
Catalog #: ${recordData.catno || 'Unknown'}
Genre/Style: ${recordData.genre?.join(', ') || 'Unknown'} / ${recordData.style?.join(', ') || 'Unknown'}
Community stats: ${haveCount} people own this, ${wantCount} people want it (${demand})
Pricing: ${pricingInfo}

Based on this information, provide a brief 2-3 sentence description of this record, covering its sonic characteristics, genre placement, and collectibility. Keep it conversational.`
        }
      ]
      // NO TOOLS - removed web_search
    });
    
    console.log('Anthropic API call succeeded!');
    
    let finalText = '';
    for (const block of message.content) {
      if (block.type === 'text') {
        finalText += block.text;
      }
    }
    
    return finalText;
  } catch (error) {
    console.error('=== ANTHROPIC API ERROR ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error status:', error.status);
    console.error('Error type:', error.type);
    console.error('=========================');
    throw error;
  }
}

export async function POST(request) {
  try {
    const { query } = await request.json();
    
    const record = await searchDiscogs(query);
    const details = await getReleaseDetails(record.resource_url);
    const fullRecord = { ...record, ...details };
    
    const explanation = await getExplanation(fullRecord);
    
    return Response.json({
      success: true,
      record: {
        title: fullRecord.title,
        year: fullRecord.year,
        format: fullRecord.format,
        coverImage: fullRecord.cover_image,
        label: fullRecord.label?.[0],
        country: fullRecord.country,
        genre: fullRecord.genre,
        style: fullRecord.style,
        wantCount: fullRecord.community?.want,
        haveCount: fullRecord.community?.have,
        lowestPrice: fullRecord.lowest_price,
        numForSale: fullRecord.num_for_sale,
      },
      explanation
    });
    
  } catch (error) {
    console.error('=== MAIN HANDLER ERROR ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('==========================');
    
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}