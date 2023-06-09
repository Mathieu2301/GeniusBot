import TelegramSource from './sources/telegram';
import config from './config';
import genius from './lib/genius';
import type Source from './source';

console.log('Authorised artists:', config.artists.length ? config.artists : 'All');

console.log('Initializing bot...');

const sources: Source[] = [
  new TelegramSource(config.telegram),
];

for (const source of sources) {
  source.init(async (message) => {
    console.log(message.text);
    const result = await genius.searchLyrics(message.text, config.artists);
    console.log('=>', result.completion);
    if (result.code === 'OK') message.answer(result.completion);
  });
}
