import { accountModel } from '../models/accountModel.js';

const assembleMessage = (success, message) => {
  return {
    success,
    message,
  };
};

const get = async (lowestToGet) => {
  try {
    const { limit } = lowestToGet;

    if (!!!limit) {
      return assembleMessage(false, 'You must send the limit parameter.');
    }

    const lowestCustomers = await accountModel.find(
      {},
      ['agencia', 'conta', 'name', 'balance'],
      { sort: { balance: 1 }, limit: parseInt(limit) }
    );

    const retorno = lowestCustomers.map(({ agencia, conta, name, balance }) => {
      return { agencia, conta, name, balance };
    });

    return assembleMessage(true, retorno);
  } catch (error) {
    return assembleMessage(false, error);
  }
};

export default { get };
