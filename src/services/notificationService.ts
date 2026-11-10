import { NOTIFICATION_CONFIG } from '../config/notification';

interface NotificationPayload {
  title: string;
  message: string;
  tags?: string[];
  priority?: 'min' | 'low' | 'default' | 'high' | 'urgent';
}

let outcomeSent = false;
let openSent = false;

export async function notifySiteOpened(): Promise<void> {
  if (openSent || !NOTIFICATION_CONFIG.notifyOnPageOpen) return;
  openSent = true;

  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  await dispatchNotification({
    title: '👀 Meenu opened the proposal link! ❤️',
    message: `Someone just opened your marriage proposal site for Meenu!\nTime: ${timestamp}`,
    tags: ['eyes', 'heart'],
    priority: 'default',
  });
}

export async function sendPhoneNotification(
  outcome: 'accepted' | 'declined',
  extraInfo?: { dodgeCount?: number }
): Promise<void> {
  if (outcomeSent) return;
  outcomeSent = true;

  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dodgeText =
    extraInfo?.dodgeCount && extraInfo.dodgeCount > 0
      ? `\n(She playfully dodged the NO button ${extraInfo.dodgeCount} times! 😂)`
      : '';

  const payload: NotificationPayload =
    outcome === 'accepted'
      ? {
          title: '💍 MEENU SAID YES! ❤️🎉',
          message: `SHE SAID YES! 💍❤️ Meenu accepted your marriage proposal!\n"Forever begins today."${dodgeText}\nTime: ${timestamp}`,
          tags: ['ring', 'tada', 'heart', 'sparkles'],
          priority: 'urgent',
        }
      : {
          title: '💔 Meenu clicked No',
          message: `Meenu clicked No on the proposal.\nTime: ${timestamp}`,
          tags: ['broken_heart'],
          priority: 'high',
        };

  await dispatchNotification(payload);
}

async function dispatchNotification(payload: NotificationPayload): Promise<void> {
  const promises: Promise<any>[] = [];

  // 1. ntfy.sh (Instant mobile push notifications with Priority 5 Max)
  if (NOTIFICATION_CONFIG.ntfyTopic?.trim()) {
    const ntfyPromise = fetch('https://ntfy.sh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: NOTIFICATION_CONFIG.ntfyTopic.trim(),
        title: payload.title,
        message: payload.message,
        priority: payload.priority === 'default' ? 3 : 5, // 5 = Urgent/Max for instant screen wakeup & alarm
        tags: payload.tags || ['ring', 'tada'],
      }),
      keepalive: true,
    }).catch((err) => {
      console.warn('[ntfy error]', err);
    });
    promises.push(ntfyPromise);
  }

  // 2. Telegram Bot (Ultra-fast < 1 second real-time delivery)
  if (NOTIFICATION_CONFIG.telegramBotToken?.trim() && NOTIFICATION_CONFIG.telegramChatId?.trim()) {
    const tgUrl = `https://api.telegram.org/bot${NOTIFICATION_CONFIG.telegramBotToken.trim()}/sendMessage`;
    const tgPromise = fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: NOTIFICATION_CONFIG.telegramChatId.trim(),
        text: `*${payload.title}*\n\n${payload.message}`,
        parse_mode: 'Markdown',
      }),
      keepalive: true,
    }).catch((err) => {
      console.warn('[Telegram error]', err);
    });
    promises.push(tgPromise);
  }

  // 3. Discord Webhook (Ultra-fast < 1 second real-time delivery)
  if (NOTIFICATION_CONFIG.discordWebhookUrl?.trim()) {
    const discordPromise = fetch(NOTIFICATION_CONFIG.discordWebhookUrl.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `🎉 @everyone **${payload.title}**\n${payload.message}`,
      }),
      keepalive: true,
    }).catch((err) => {
      console.warn('[Discord error]', err);
    });
    promises.push(discordPromise);
  }

  try {
    await Promise.allSettled(promises);
  } catch {}
}
