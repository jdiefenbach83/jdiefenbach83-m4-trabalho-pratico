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
    await mongoose.connect(
      //'mongodb+srv://jdiefenbach83:SUa8gIiHlhwH797G@igti.g8tph.gcp.mongodb.net/grades?retryWrites=true&w=majority',
      'mongodb://127.0.0.1/my-bank-api',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Error to connect on MongoDB. ' + error);
  }
};

app.listen(3000, () => {
  db();
  console.log('My Bank API has Started!');
});
