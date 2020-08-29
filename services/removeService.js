import { accountModel } from '../models/accountModel.js';

const assembleMessage = (success, message) => {
  return {
    success,
    message,
  };
};

const remove = async (accountToRemove) => {
  try {
    const { agency, account } = accountToRemove;

    if (!!!agency || !!!account) {
      return assembleMessage(
        false,
        'You must send the agency and account parameters.'
      );
    }

    const accountDB = await accountModel.findOneAndRemove({
      agencia: agency,
      conta: account,
    });

    if (!!!accountDB) {
      return assembleMessage(false, "The agency/account doesn't exist.");
    }

    const agencyCount = await accountModel.countDocuments({ agencia: agency });

    return assembleMessage(true, {
      agencyCount,
    });
  } catch (error) {
    return assembleMessage(false, error);
  }
};

export default { remove };
