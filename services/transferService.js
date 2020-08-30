import { accountModel } from '../models/accountModel.js';

const assembleMessage = (success, message) => {
  return {
    success,
    message,
  };
};

const make = async (transferToMake) => {
  const { origin, destination, amount } = transferToMake;

  if (!!!origin || !!!destination || !!!amount) {
    return assembleMessage(
      false,
      'You must send the origin account, destination account and amount parameters.'
    );
  }

  if (amount < 0) {
    return assembleMessage(false, 'You must send a positive amount.');
  }

  if (origin === destination) {
    return assembleMessage(
      false,
      'The origin and destination accounts must be different.'
    );
  }

  const originAccountDB = await accountModel.find({
    conta: origin,
  });

  if (originAccountDB.length === 0) {
    return assembleMessage(false, "The origin account doesn't exist.");
  }

  const destinationAccountDB = await accountModel.find({
    conta: destination,
  });

  if (destinationAccountDB.length === 0) {
    return assembleMessage(false, "The destination account doesn't exist.");
  }

  const originId = originAccountDB[0]._id;
  const originAgency = originAccountDB[0].agencia;
  const originBalance = originAccountDB[0].balance;

  const destinationId = destinationAccountDB[0]._id;
  const destinationAgency = destinationAccountDB[0].agencia;
  const destinationBalance = destinationAccountDB[0].balance;

  const valueToTransfer = amount;
  const tax = originAgency === destinationAgency ? 0 : 8;

  if (valueToTransfer + tax > originBalance) {
    return assembleMessage(false, 'Insufficient funds to transfer.');
  }

  const newOriginBalance = originBalance - (valueToTransfer + tax);

  const originResult = await accountModel.updateOne(
    { _id: originId },
    { $set: { balance: newOriginBalance } },
    { runValidators: true }
  );

  if (originResult.ok !== 1) {
    return assembleMessage(false, 'A error occuried to transfer.');
  }

  const newDestinationBalance = destinationBalance + valueToTransfer;

  const destinationResult = await accountModel.updateOne(
    { _id: destinationId },
    { $set: { balance: newDestinationBalance } },
    { runValidators: true }
  );

  if (destinationResult.ok !== 1) {
    return assembleMessage(false, 'A error occuried to transfer.');
  }

  return assembleMessage(true, {
    origin: { conta: origin, balance: newOriginBalance },
  });
};

export default { make };
