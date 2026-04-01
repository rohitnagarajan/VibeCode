import type { BroadcastMessage } from '../types';

const CHANNEL_NAME = 'teamcast-studio';

let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel {
  if (!channel) channel = new BroadcastChannel(CHANNEL_NAME);
  return channel;
}

export function sendMessage(msg: BroadcastMessage) {
  try {
    getChannel().postMessage(msg);
    // Also write to localStorage as fallback for same-tab output view
    localStorage.setItem('teamcast-broadcast', JSON.stringify({ ...msg, _ts: Date.now() }));
  } catch {}
}

export function onMessage(handler: (msg: BroadcastMessage) => void): () => void {
  const ch = getChannel();
  const listener = (e: MessageEvent) => handler(e.data as BroadcastMessage);
  ch.addEventListener('message', listener);

  // Also listen to localStorage events (same-tab fallback)
  const storageListener = (e: StorageEvent) => {
    if (e.key === 'teamcast-broadcast' && e.newValue) {
      try { handler(JSON.parse(e.newValue)); } catch {}
    }
  };
  window.addEventListener('storage', storageListener);

  return () => {
    ch.removeEventListener('message', listener);
    window.removeEventListener('storage', storageListener);
  };
}
