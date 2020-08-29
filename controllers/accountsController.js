import depositService from '../services/depositService.js';
import { accountModel } from '../models/accountModel.js';

const deposit = async (req, res) => {
  try {
    const result = await depositService.make(req.body);

    if (!!!result.success) {
      return res.status(400).send({
        message: result.message,
      });
    }

    return res.status(200).send(result.message);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const withdraw = async (req, res) => {
  try {
    const { agency, account, amount } = req.body;

    if (!!!agency || !!!account || !!!amount) {
      return res.status(400).send({
        message: 'You must send the agency, account and amount parameters.',
      });
    }

    if (amount < 0) {
      return res.status(400).send({
        message: 'You must send a positive amount.',
      });
    }

    const accountDB = await accountModel.find({
      agencia: agency,
      conta: account,
    });

    if (accountDB.length === 0) {
      return res.status(404).send({
        message: "The agency/account doesn't exist.",
      });
    }

    const id = accountDB[0]._id;
    const balance = accountDB[0].balance;

    const valueToWithdraw = amount;
    const tax = 1;

    if (valueToWithdraw + tax > balance) {
      return res.status(400).send({
        message: 'Insufficient funds to withdraw.',
      });
    }

    const newBalance = balance - (valueToWithdraw + tax);

    const result = await accountModel.updateOne(
      { _id: id },
      { $set: { balance: newBalance } },
      { runValidators: true }
    );

    if (result.ok !== 1) {
      return res.status(500).send({ message: 'A error occuried to withdraw.' });
    }

    return res.status(200).send({
      origin: { agencia: agency, conta: account, balance: newBalance },
    });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const balance = async (req, res) => {
  try {
    const { agency, account } = req.query;

    if (!!!agency || !!!account) {
      return res.status(400).send({
        message: 'You must send the agency and account parameters.',
      });
    }

    const accountDB = await accountModel.find({
      agencia: agency,
      conta: account,
    });

    if (accountDB.length === 0) {
      return res.status(404).send({
        message: "The agency/account doesn't exist.",
      });
    }

    const balance = accountDB[0].balance;

    return res.status(200).send({
      origin: { agencia: agency, conta: account, balance },
    });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const remove = async (req, res) => {
  try {
    const { agency, account } = req.body;

    if (!!!agency || !!!account) {
      return res.status(400).send({
        message: 'You must send the agency and account parameters.',
      });
    }

    const accountDB = await accountModel.find({
      agencia: agency,
      conta: account,
    });

    if (accountDB.length === 0) {
      return res.status(404).send({
        message: "The agency/account doesn't exist.",
      });
    }

    const id = accountDB[0]._id;
    const result = await accountModel.deleteOne({ _id: id });

    if (result.ok !== 1) {
      return res
        .status(500)
        .send({ message: 'A error occuried to remove an account.' });
    }

    const agencyCount = await accountModel.countDocuments({ agencia: agency });

    return res.status(200).send({
      agencyCount,
    });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const transfer = async (req, res) => {
  try {
    const { origin, destination, amount } = req.body;

    if (!!!origin || !!!destination || !!!amount) {
      return res.status(400).send({
        message:
          'You must send the origin account, destination account and amount parameters.',
      });
    }

    if (amount < 0) {
      return res.status(400).send({
        message: 'You must send a positive amount.',
      });
    }

    if (origin === destination) {
      return res.status(400).send({
        message: 'The origin and destination accounts must be different.',
      });
    }

    const originAccountDB = await accountModel.find({
      conta: origin,
    });

    if (originAccountDB.length === 0) {
      return res.status(404).send({
        message: "The origin account doesn't exist.",
      });
    }

    const destinationAccountDB = await accountModel.find({
      conta: destination,
    });

    if (destinationAccountDB.length === 0) {
      return res.status(404).send({
        message: "The destination account doesn't exist.",
      });
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
      return res.status(400).send({
        message: 'Insufficient funds to transfer.',
      });
    }

    const newOriginBalance = originBalance - (valueToTransfer + tax);

    const originResult = await accountModel.updateOne(
      { _id: originId },
      { $set: { balance: newOriginBalance } },
      { runValidators: true }
    );

    if (originResult.ok !== 1) {
      return res.status(500).send({ message: 'A error occuried to transfer.' });
    }

    const newDestinationBalance = destinationBalance + valueToTransfer;

    const destinationResult = await accountModel.updateOne(
      { _id: destinationId },
      { $set: { balance: newDestinationBalance } },
      { runValidators: true }
    );

    if (destinationResult.ok !== 1) {
      return res.status(500).send({ message: 'A error occuried to transfer.' });
    }

    return res.status(200).send({
      origin: { conta: origin, balance: newOriginBalance },
    });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const average = async (req, res) => {
  try {
    const { agency } = req.query;

    if (!!!agency) {
      return res.status(400).send({
        message: 'You must send the agency parameter.',
      });
    }

    const accountDB = await accountModel.findOne({
      agencia: agency,
    });

    if (!!!accountDB) {
      return res.status(404).send({
        message: "The agency doesn't exist.",
      });
    }

    const balanceAvg = await accountModel.aggregate([
      { $match: { agencia: parseInt(agency) } },
      {
        $group: { _id: { agency: '$agencia' }, balance: { $avg: '$balance' } },
      },
    ]);

    return res.status(200).send({
      agencia: agency,
      balance: balanceAvg[0].balance,
    });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const lowest = async (req, res) => {
  try {
    const { limit } = req.query;

    if (!!!limit) {
      return res.status(400).send({
        message: 'You must send the limit parameter.',
      });
    }

    const lowestCustomers = await accountModel.find(
      {},
      ['agencia', 'conta', 'name', 'balance'],
      { sort: { balance: 1 }, limit: parseInt(limit) }
    );

    const retorno = lowestCustomers.map(({ agencia, conta, name, balance }) => {
      return { agencia, conta, name, balance };
    });

    return res.status(200).send(retorno);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const highest = async (req, res) => {
  try {
    const { limit } = req.query;

    if (!!!limit) {
      return res.status(400).send({
        message: 'You must send the limit parameter.',
      });
    }

    const highestCustomers = await accountModel.find(
      {},
      ['agencia', 'conta', 'name', 'balance'],
      { sort: { balance: -1 }, limit: parseInt(limit) }
    );

    const retorno = highestCustomers.map(
      ({ agencia, conta, name, balance }) => {
        return { agencia, conta, name, balance };
      }
    );

    return res.status(200).send(retorno);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const moveToPrivate = async (_, res) => {
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

    return res.status(200).send(movedAccounts);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

export default {
  deposit,
  withdraw,
  balance,
  remove,
  transfer,
  average,
  lowest,
  highest,
  moveToPrivate,
};
