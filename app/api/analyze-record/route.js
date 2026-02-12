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
  
  // Reset if window expired
  if (now > data.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  
  // Check if over limit
  if (data.count >= maxRequests) {
    return { 
      allowed: false, 
      remaining: 0,
      resetTime: data.resetTime 
    };
  }
  
  // Increment count
  data.count++;
  return { allowed: true, remaining: maxRequests - data.count };
}

// ... rest of your existing functions (searchDiscogs, getReleaseDetails, getExplanation)

export async function POST(request) {
  try {
    // Get IP address
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Check rate limit (10 requests per hour)
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