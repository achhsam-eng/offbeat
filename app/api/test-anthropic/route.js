export const runtime = 'nodejs';

async function runTest() {
  // Test 1: Check if env var exists
  const keyExists = !!process.env.ANTHROPIC_API_KEY;
  const keyLength = process.env.ANTHROPIC_API_KEY?.length || 0;
  const keyStart = process.env.ANTHROPIC_API_KEY?.substring(0, 20) || 'NOT FOUND';
  
  // Test 2: Try to make a simple API call with fetch (not the SDK)
  let fetchTest = 'not attempted';
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: 'Say hello'
        }]
      })
    });
    
    const data = await response.json();
    fetchTest = response.ok ? 'SUCCESS' : `FAILED: ${JSON.stringify(data)}`;
  } catch (err) {
    fetchTest = `ERROR: ${err.message}`;
  }
  
  return {
    test: 'Anthropic API Test',
    results: {
      envVarExists: keyExists,
      envVarLength: keyLength,
      envVarStart: keyStart,
      fetchTest: fetchTest
    }
  };
}

export async function GET() {
  try {
    const result = await runTest();
    return Response.json(result);
  } catch (error) {
    return Response.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    const result = await runTest();
    return Response.json(result);
  } catch (error) {
    return Response.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}