import mongoose from 'mongoose';

let session = null;

const connect = async () => {
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

const startTransaction = async () => {
  session = await mongoose.startSession();
  session.startTransaction();
};

const commitTransaction = () => {
  if (!session) {
    return;
  }

  session.commitTransaction();
  session.endSession();
};

const abortTransaction = () => {
  if (!session) {
    return;
  }

  session.abortTransaction();
  session.endSession();
};

export default {
  connect,
  startTransaction,
  commitTransaction,
  abortTransaction,
};
