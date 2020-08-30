import { accountModel } from '../models/accountModel.js';

const assembleMessage = (success, message) => {
  return {
    success,
    message,
  };
};

const get = async (averageToGet) => {
  try {
    const { agency } = averageToGet;

    if (!!!agency) {
      return assembleMessage(false, 'You must send the agency parameter.');
    }

    const accountDB = await accountModel.findOne({
      agencia: agency,
    });

    if (!!!accountDB) {
      return assembleMessage(false, "The agency doesn't exist.");
    }

    const balanceAvg = await accountModel.aggregate([
      { $match: { agencia: parseInt(agency) } },
      {
        $group: { _id: { agency: '$agencia' }, balance: { $avg: '$balance' } },
      },
    ]);

    return assembleMessage(true, {
      agencia: parseInt(agency),
      balance: balanceAvg[0].balance,
    });
  } catch (error) {
    return assembleMessage(false, error);
  }
};

export default { get };
