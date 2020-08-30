import app from './app.js';
import db from './database/db.js';

const api = app;

api.listen(process.env.HTTP_PORT, async () => {
  await db.connect();
});
