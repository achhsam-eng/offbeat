export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    
    const url = `https://api.discogs.com/database/search?q=${encodeURIComponent(query)}&type=release&token=${process.env.DISCOGS_TOKEN}&per_page=12`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return Response.json({
        success: false,
        error: 'No results found'
      });
    }

    // Return multiple results
    const records = data.results.slice(0, 12).map((result: any, index: number) => ({
      id: result.id || Date.now() + index,
      title: result.title,
      price: Math.floor(Math.random() * 50) + 15, // Random price for demo
      condition: ['NM', 'VG+', 'VG', 'G+'][Math.floor(Math.random() * 4)],
      pressing: `${result.country || 'Unknown'}, ${result.year || 'Unknown'}`,
      image: result.cover_image || result.thumb || '/albums/placeholder.jpg'
    }));

    return Response.json({
      success: true,
      records
    });
    
  } catch (error) {
    return Response.json({
      success: false,
      error: 'Search failed'
    }, { status: 500 });
  }
}