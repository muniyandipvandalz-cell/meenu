/**
 * Instant Phone Notification Settings
 *
 * METHOD 1: ntfy.sh (Recommended - 100% Free, No signup required)
 * -------------------------------------------------------------
 * 1. Download the free "ntfy" app on your phone:
 *    - Android: Google Play Store ("ntfy")
 *    - iPhone / iPad: App Store ("ntfy")
 * 2. Open the ntfy app, tap the "+" button, and enter the topic name below:
 *    Topic: meenu-proposal-alert-eren
 * 3. Done! As soon as Meenu opens the site or clicks YES, your phone will ring and show the notification immediately!
 *
 * (You can change "meenu-proposal-alert-eren" to any custom secret topic name you like)
 *
 * METHOD 2: Telegram Bot (Optional)
 * ---------------------------------
 * If you prefer Telegram notifications, create a bot with @BotFather, get your token and chat ID,
 * and fill them below.
 *
 * METHOD 3: Discord Webhook (Optional)
 * ------------------------------------
 * If you prefer Discord notifications, create a webhook in your Discord server and paste it below.
 */

export const NOTIFICATION_CONFIG = {
  // Free instant push notifications via ntfy (install ntfy app & subscribe to this topic name)
  ntfyTopic: 'meenu-proposal-alert-eren',

  // Optional: Telegram Bot credentials (leave empty if not using)
  telegramBotToken: '',
  telegramChatId: '',

  // Optional: Discord Webhook URL (leave empty if not using)
  discordWebhookUrl: 'https://discord.com/api/webhooks/1569815305792790568/VHssgri9wmiBhaE6yQqpPY0BQ6EwGZUh7IUfY6BU9-TKa8_ZrWjaujystgwUjapATV89',

  // Notify when she first opens the page? (true/false)
  notifyOnPageOpen: true,
};
