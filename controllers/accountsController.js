import depositService from '../services/depositService.js';
import withdrawService from '../services/withdrawService.js';
import balanceService from '../services/balanceService.js';
import removeService from '../services/removeService.js';
import transferService from '../services/transferService.js';
import averageService from '../services/averageService.js';
import lowestService from '../services/lowestService.js';
import highestService from '../services/highestService.js';
import moveToPrivateService from '../services/moveToPrivateService.js';

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
    const result = await withdrawService.make(req.body);

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

const balance = async (req, res) => {
  try {
    const result = await balanceService.get(req.query);

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

const remove = async (req, res) => {
  try {
    const result = await removeService.remove(req.body);

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

const transfer = async (req, res) => {
  try {
    const result = await transferService.make(req.body);

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

const average = async (req, res) => {
  try {
    const result = await averageService.get(req.query);

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

const lowest = async (req, res) => {
  try {
    const result = await lowestService.get(req.query);

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

const highest = async (req, res) => {
  try {
    const result = await highestService.get(req.query);

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

const moveToPrivate = async (_, res) => {
  //try {
  const result = await moveToPrivateService.move();

  if (!!!result.success) {
    return res.status(400).send({
      message: result.message,
    });
  }

  return res.status(200).send(movedAccounts);
  // } catch (error) {
  //   return res.status(500).send({ message: error });
  // }
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
