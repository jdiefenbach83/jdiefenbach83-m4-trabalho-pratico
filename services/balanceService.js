import { accountModel } from '../models/accountModel.js';

const assembleMessage = (success, message) => {
  return {
    success,
    message,
  };
};

const get = async (accountToGet) => {
  try {
    const { agency, account } = accountToGet;

    if (!!!agency || !!!account) {
      return assembleMessage(
        false,
        'You must send the agency and account parameters.'
      );
    }

    const accountDB = await accountModel.find({
      agencia: agency,
      conta: account,
    });

    if (accountDB.length === 0) {
      return assembleMessage(false, "The agency/account doesn't exist.");
    }

    const balance = accountDB[0].balance;

    return assembleMessage(true, {
      origin: { agencia: agency, conta: account, balance },
    });
  } catch (error) {
    return assembleMessage(false, error);
  }
};

export default { get };
