'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getCentrifugeClient } from '@/lib/centrifugo/client';
import { getCentrifugoToken } from '@/lib/centrifugo/auth';

interface CentrifugoContextType {
  client: any | null;
  connected: boolean;
  subscribe: (channel: string, callback: (data: any) => void) => () => void;
}

const CentrifugoContext = createContext<CentrifugoContextType>({
  client: null,
  connected: false,
  subscribe: () => () => {},
});

export function useCentrifugo() {
  return useContext(CentrifugoContext);
}

export function CentrifugoProvider({ children, orgId }: { children: ReactNode; orgId?: string }) {
  const { user } = useAuth();
  const [client, setClient] = useState<any | null>(null);
  const [connected, setConnected] = useState(false);
  const subscriptionsRef = React.useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (!user || !orgId) {
      return;
    }

    let mounted = true;

    async function connect() {
      try {
        const token = await getCentrifugoToken();
        const centrifugoClient = getCentrifugeClient(token);

        centrifugoClient.on('connected', () => {
          if (mounted) {
            console.log('[Centrifugo] Connected');
            setConnected(true);
          }
        });

        centrifugoClient.on('disconnected', () => {
          if (mounted) {
            console.log('[Centrifugo] Disconnected');
            setConnected(false);
          }
        });

        centrifugoClient.on('error', (ctx: any) => {
          console.error('[Centrifugo] Error:', ctx);
        });

        centrifugoClient.connect();
        setClient(centrifugoClient);
      } catch (error) {
        console.error('[Centrifugo] Failed to connect:', error);
      }
    }

    connect();

    return () => {
      mounted = false;
      if (client) {
        // Unsubscribe all
        subscriptionsRef.current.forEach((sub) => {
          sub.unsubscribe();
        });
        subscriptionsRef.current.clear();
        client.disconnect();
      }
    };
  }, [user, orgId]);

  const subscribe = (channel: string, callback: (data: any) => void) => {
    if (!client || !connected) {
      console.warn('[Centrifugo] Client not connected, cannot subscribe');
      return () => {};
    }

    const subscription = client.newSubscription(channel);

    subscription.on('publication', (ctx: any) => {
      callback(ctx.data);
    });

    subscription.subscribe();
    subscriptionsRef.current.set(channel, subscription);

    return () => {
      subscription.unsubscribe();
      subscriptionsRef.current.delete(channel);
    };
  };

  return (
    <CentrifugoContext.Provider value={{ client, connected, subscribe }}>
      {children}
    </CentrifugoContext.Provider>
  );
}
