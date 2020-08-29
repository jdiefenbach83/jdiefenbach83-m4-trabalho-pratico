import { accountModel } from '../models/accountModel.js';

const assembleMessage = (success, message) => {
  return {
    success,
    message,
  };
};

const make = async (withdrawToMake) => {
  try {
    const { agency, account, amount } = withdrawToMake;

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
    const balance = accountDB[0].balance;

    const valueToWithdraw = amount;
    const tax = 1;

    if (valueToWithdraw + tax > balance) {
      return assembleMessage(false, 'Insufficient funds to withdraw.');
    }

    const newBalance = balance - (valueToWithdraw + tax);

    const result = await accountModel.updateOne(
      { _id: id },
      { $set: { balance: newBalance } },
      { runValidators: true }
    );

    if (result.ok !== 1) {
      return assembleMessage(false, 'A error occuried to withdraw.');
    }

    return assembleMessage(true, {
      origin: { agencia: agency, conta: account, balance: newBalance },
    });
  } catch (error) {
    return assembleMessage(false, error);
  }
};

export default { make };
