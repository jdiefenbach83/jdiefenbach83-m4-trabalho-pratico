import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  agencia: { type: Number, required: true },
  conta: { type: Number, required: true },
  name: { type: String, required: true },
  balance: {
    type: Number,
    required: true,
    min: [0, 'O saldo da conta não pode ser negativo'],
  },
});

const accountModel = mongoose.model('account', accountSchema);

export { accountModel };
