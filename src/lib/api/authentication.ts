import { NextRequest } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { ApiKey } from '@/types/api';
import crypto from 'crypto';

/**
 * Hash API key for storage
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

/**
 * Verify API key against stored hash
 */
export function verifyApiKey(key: string, hashedKey: string): boolean {
  const keyHash = hashApiKey(key);
  return keyHash === hashedKey;
}

/**
 * Generate a new API key
 */
export function generateApiKey(): { key: string; prefix: string; hashed: string } {
  // Generate 32-byte random key, base64 encoded = 44 chars
  const key = crypto.randomBytes(32).toString('base64');
  const prefix = key.substring(0, 8);
  const hashed = hashApiKey(key);

  return { key, prefix, hashed };
}

/**
 * Extract API key from request header
 */
export function extractApiKey(request: NextRequest): string | null {
  // Check Authorization header: Bearer <key>
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check X-API-Key header
  const apiKeyHeader = request.headers.get('x-api-key');
  if (apiKeyHeader) {
    return apiKeyHeader;
  }

  return null;
}

/**
 * Authenticate API request using API key
 */
export async function authenticateApiRequest(
  request: NextRequest
): Promise<{ apiKey: ApiKey; businessId: string } | null> {
  const apiKeyString = extractApiKey(request);

  if (!apiKeyString) {
    return null;
  }

  try {
    // Query all API keys for the business (we need to verify the key)
    // In production, you'd want to index by key prefix for better performance
    const apiKeysSnapshot = await db
      .collectionGroup('apiKeys')
      .where('active', '==', true)
      .limit(100) // Limit to prevent full collection scan
      .get();

    for (const doc of apiKeysSnapshot.docs) {
      const apiKey = {
        id: doc.id,
        ...doc.data(),
      } as ApiKey;

      // Check if key matches
      if (verifyApiKey(apiKeyString, apiKey.hashedKey)) {
        // Check if expired
        if (apiKey.expiresAt) {
          const expiresAt = apiKey.expiresAt instanceof Date
            ? apiKey.expiresAt
            : (apiKey.expiresAt as any).toDate();
          
          if (expiresAt < new Date()) {
            return null; // Expired
          }
        }

        // Update last used
        await doc.ref.update({
          lastUsedAt: new Date(),
        });

        // Extract businessId from doc path: businesses/{businessId}/apiKeys/{keyId}
        const pathParts = doc.ref.path.split('/');
        const businessId = pathParts[1];

        return { apiKey, businessId };
      }
    }
  } catch (error) {
    console.error('[authenticateApiRequest] Error:', error);
  }

  return null;
}
