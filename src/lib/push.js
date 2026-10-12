import { supabase } from './supabase.js';

import { VAPID_PUBLIC_KEY as KEY } from '../config.js';
const b64ToBytes = s => { const p = '='.repeat((4 - s.length % 4) % 4); const b = atob((s + p).replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(b, c => c.charCodeAt(0)); };

export function pushSupport() {
  if (!KEY) return 'unconfigured';
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
    const ios = /iPhone|iPad/.test(navigator.userAgent);
    return ios && !window.matchMedia('(display-mode: standalone)').matches ? 'ios-install' : 'unsupported';
  }
  if (Notification.permission === 'denied') return 'denied';
  return 'ok';
}

export async function currentSubscription() {
  if (pushSupport() !== 'ok') return null;
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
}

/** Must be called from a tap. Asks permission, subscribes, and saves the subscription. */
export async function enablePush() {
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') throw new Error('Notifications were not allowed. Turn them on in your phone settings for this app.');
  const reg = await navigator.serviceWorker.ready;
  const sub = (await reg.pushManager.getSubscription()) || await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(KEY) });
  const j = sub.toJSON();
  const { error } = await supabase.from('push_subscriptions').upsert({ endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth }, { onConflict: 'endpoint' });
  if (error) throw new Error(error.message);
  return sub;
}
