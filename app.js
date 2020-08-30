import express from 'express';
import cors from 'cors';

import db from './database/db.js';
import router from './routes/accountsRoute.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', router);

app.listen(process.env.HTTP_PORT, () => {
  db.connect();
  console.log('My Bank API has Started!');
});
