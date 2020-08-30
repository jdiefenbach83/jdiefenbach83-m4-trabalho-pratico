import { accountModel } from '../models/accountModel.js';

const assembleMessage = (success, message) => {
  return {
    success,
    message,
  };
};

const make = async (depositToMake) => {
  try {
    const { agency, account, amount } = depositToMake;

    if (!!!agency || !!!account || !!!amount) {
      return assembleMessage(
        false,
        'You must send the agency, account and amount parameters.'
      );
    }

    if (amount < 0) {
      return assembleMessage(false, 'You must send a positive amount.');
    }

    const accountDB = await accountModel.find({
      agencia: agency,
      conta: account,
    });

    if (accountDB.length === 0) {
      return assembleMessage(false, "The agency/account doesn't exist.");
    }

    const id = accountDB[0]._id;
    const newBalance = accountDB[0].balance + amount;

    const result = await accountModel.updateOne(
      { _id: id },
      { $inc: { balance: amount } },
      { runValidators: true }
    );

    if (result.ok !== 1) {
      return assembleMessage(false, 'A error occuried to deposit.');
    }

    return assembleMessage(true, {
      destination: { agencia: agency, conta: account, balance: newBalance },
    });
  } catch (error) {
    return assembleMessage(false, error);
  }
};

export default { make };
