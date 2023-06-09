import dotenv from 'dotenv';

dotenv.config();

const required = [
  'TELEGRAM_KEY',
];

const missing = required.filter((key) => !process.env[key]);
for (const key of missing) console.error(`${key} is not defined`);
if (missing.length) process.exit(1);

export default {
  telegram: {
    key: process.env.TELEGRAM_KEY,
  },
  artists: ((process.env.ARTISTS ?? '')
    .split(',')
    .map((artist) => artist.toLowerCase().trim())
    .filter((artist) => artist)
  ),
};
