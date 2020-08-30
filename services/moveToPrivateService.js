import { accountModel } from '../models/accountModel.js';

const assembleMessage = (success, message) => {
  return {
    success,
    message,
  };
};

const move = async () => {
  try {
    const agencies = await accountModel.aggregate([
      { $match: { agencia: { $ne: 99 } } },
      { $group: { _id: { agency: '$agencia' } } },
    ]);

    const movedAccounts = [];
    const updates = [];

    for (let agency of agencies) {
      const customer = await accountModel.findOne(
        { agencia: agency._id.agency },
        ['agencia', 'conta', 'name', 'balance'],
        {
          sort: { balance: -1 },
        }
      );

      const { id, agencia, conta, name, balance } = customer;

      updates.push({
        updateOne: { filter: { _id: id }, update: { agencia: 99 } },
      });

      movedAccounts.push({
        agencia,
        conta,
        name,
        balance,
      });
    }

    const result = await accountModel.bulkWrite(updates);
    //fazer alguma validação junto com o transaction

    return assembleMessage(true, movedAccounts);
  } catch (error) {
    return assembleMessage(false, { message: error });
  }
};

export default { move };
