export async function generateBrutalistStatement(topic: string) {
  try {
    const response = await fetch('/api/ai/manifesto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const { statement } = await response.json();
    return String(statement).trim();
  } catch (error) {
    console.error('Gemini failed:', error);
    return 'SYSTEM ERROR: FAILED TO GENERATE MANIFESTO.';
  }
}
