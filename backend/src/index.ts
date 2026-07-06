import 'dotenv/config';
import { createApp } from './app.js';
import { getConfig } from './config.js';
import { createStorage } from './storage.js';

const config = getConfig();
const storage = createStorage();

await storage.init();

createApp(storage).listen(config.port, () => {
  console.log(`Hoodwood backend running on http://localhost:${config.port}`);
});
