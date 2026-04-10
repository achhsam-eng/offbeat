export const runtime = 'nodejs';
export const maxDuration = 60;

import Anthropic from '@anthropic-ai/sdk';

// Simple in-memory rate limiter (resets on each deployment)
const rateLimitMap = new Map();
function rateLimit(ip, maxRequests = 10, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const key = ip;
  
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  
  const data = rateLimitMap.get(key);
  
  if (now > data.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  
  if (data.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: data.resetTime };
  }
  
  data.count++;
  return { allowed: true, remaining: maxRequests - data.count };
}

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
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const wantCount = recordData.community?.want || 0;
  const haveCount = recordData.community?.have || 0;
  const demand = wantCount > haveCount ? "high demand" : wantCount > haveCount * 0.5 ? "moderate demand" : "relatively available";
  
  const pricingInfo = recordData.lowest_price 
    ? `Lowest current price: $${recordData.lowest_price} (${recordData.num_for_sale} available for sale)`
    : "Not currently available for sale on the marketplace";
  
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
  });
  
  let finalText = '';
  for (const block of message.content) {
    if (block.type === 'text') {
      finalText += block.text;
    }
  }
  
  return finalText;
}

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const limit = rateLimit(ip, 10, 60 * 60 * 1000);
    
    if (!limit.allowed) {
      const resetDate = new Date(limit.resetTime);
      return Response.json({
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
        resetAt: resetDate.toISOString()
      }, { 
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetDate.toISOString()
        }
      });
    }
    
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
    }, {
      headers: {
        'X-RateLimit-Remaining': limit.remaining.toString()
      }
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