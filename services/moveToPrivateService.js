import { accountModel } from '../models/accountModel.js';

const assembleMessage = (success, message) => {
  return {
    success,
    message,
  };
};

const move = async () => {
  try {
    const customers = await accountModel.find(
      {},
      ['agencia', 'conta', 'name', 'balance'],
      {
        sort: { balance: -1 },
      }
    );

    const accountsToMove = [];

    for (let customer of customers) {
      const exists = accountsToMove.some(
        (item) => item.agencia === customer.agencia
      );

      if (exists) {
        continue;
      }

      accountsToMove.push(customer);
    }

    const movedAccounts = [];
    const updates = [];

    accountsToMove.forEach(async ({ id, agencia, conta, name, balance }) => {
      updates.push({
        updateOne: { filter: { _id: id }, update: { agencia: 99 } },
      });
      movedAccounts.push({
        agencia,
        conta,
        name,
        balance,
      });
    });

    const result = await accountModel.bulkWrite(updates);
    //fazer alguma validação junto com o transaction

    return assembleMessage(true, movedAccounts);
  } catch (error) {
    return assembleMessage(false, { message: error });
  }
};

export default { move };
