import TelegramBot from 'node-telegram-bot-api';
import Source from '../source';

interface TelegramConfig {
  key: string;
}

export default class TelegramSource extends Source {
  private config: TelegramConfig;
  private bot: TelegramBot;

  constructor(config: TelegramConfig) {
    super();
    this.config = config;

    console.log('Initializing Telegram bot...');
    this.bot = new TelegramBot(config.key, { polling: true });
    console.log('Telegram bot initialized');

    this.bot.on('message', async (msg) => {
      if (!msg.text || msg.text.startsWith('/')) return;
      this.listener({
        sender: {
          id: msg.from.id.toString(),
          username: msg.from.username,
          firstName: msg.from.first_name,
          lastName: msg.from.last_name,
          isBot: msg.from.is_bot,
          lang: msg.from.language_code,
        },
        text: msg.text,
        answer: (text) => this.bot.sendMessage(msg.chat.id, text),
      });
    });

    this.bot.on('polling_error', (err) => {
      console.error('Polling error:', err.message);
    });
  }
}
