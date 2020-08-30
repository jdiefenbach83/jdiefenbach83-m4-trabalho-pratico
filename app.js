import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import router from './routes/accountsRoute.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', router);

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Error to connect on MongoDB. ' + error);
  }
};

app.listen(process.env.HTTP_PORT, () => {
  db();
  console.log('My Bank API has Started!');
});
