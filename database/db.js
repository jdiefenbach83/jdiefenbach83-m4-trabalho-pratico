import mongoose from 'mongoose';

let session = null;

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  } catch (error) {
    console.log('Error to connect on MongoDB. ' + error);
  }
};

const disconnect = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.log('Error to disconnect from MongoDB. ' + error);
  }
};

const dropDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
  } catch (error) {
    console.log('Error to drop the database from MongoDB. ' + error);
  }
};

const startTransaction = async () => {
  session = await mongoose.startSession();
  session.startTransaction();
};

const commitTransaction = async () => {
  if (!session) {
    return;
  }

  await session.commitTransaction();
  await session.endSession();
  session = null;
};

const abortTransaction = async () => {
  if (!session) {
    return;
  }

  await session.abortTransaction();
  await session.endSession();
  session = null;
};

export default {
  connect,
  disconnect,
  startTransaction,
  commitTransaction,
  abortTransaction,
  dropDatabase,
};
