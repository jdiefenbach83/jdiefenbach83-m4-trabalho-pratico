import dotenv from 'dotenv';

import db from '../database/db.js';
import accounts from '../database/seeder/accounts.js';
import app from '../app.js';

let server = null;

before('before', async function () {
  // runs once before the first test in this block
  dotenv.config({
    path: '.env.testing',
  });

  await db.connect();
  await accounts.seed();

  server = app.listen(process.env.HTTP_PORT);
});

after('after', async function () {
  server.close();
  await db.dropDatabase();
  await db.disconnect();
});

beforeEach(function () {
  // runs before each test in this block
});

afterEach(function () {
  // runs after each test in this block
});
