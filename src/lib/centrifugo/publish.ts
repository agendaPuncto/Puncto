import { CENTRIFUGO_API_KEY } from '@/lib/centrifugo/config';

const CENTRIFUGO_URL = process.env.NEXT_PUBLIC_CENTRIFUGO_URL?.replace('/connection/websocket', '') || 'http://localhost:8000';

/**
 * Publish a message to a Centrifugo channel
 * Server-side only
 */
export async function publishToCentrifugo(
  channel: string,
  data: any
): Promise<void> {
  try {
    const apiKey = process.env.CENTRIFUGO_API_KEY || CENTRIFUGO_API_KEY;
    
    if (!apiKey) {
      console.warn('Centrifugo API key not configured');
      return;
    }

    const response = await fetch(`${CENTRIFUGO_URL}/api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `apikey ${apiKey}`,
      },
      body: JSON.stringify({
        method: 'publish',
        params: {
          channel,
          data,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Centrifugo publish failed: ${errorText}`);
    }
  } catch (error) {
    console.error('Failed to publish to Centrifugo:', error);
    throw error;
  }
}
