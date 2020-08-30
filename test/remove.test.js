import chai from 'chai';
import chaiHttp from 'chai-http';

import { accountModel } from '../models/accountModel.js';

const should = chai.should();

const url = 'http://localhost:6000/api';

chai.use(chaiHttp);

describe('DELETE /remove', () => {
  it('Creating an account to delete', async () => {
    await accountModel.create({
      agencia: 10,
      conta: 1000,
      name: 'Jefferson Diefenbach',
      balance: 500,
    });

    const account = await accountModel.findOne({ agencia: 10, conta: 1000 });
    account.should.have.property('agencia', 10);
    account.should.have.property('conta', 1000);
  });

  it('Remove an existing account', async () => {
    const req = { agency: '10', account: '1000' };
    const response = await chai.request(url).delete('/remove').send(req);

    response.should.have.status(200);
    response.body.should.have.property('agencyCount', 29);

    const account = await accountModel.findOne(req);
    chai.expect(account).to.be.null;
  });

  it('Error: empty request', async () => {
    const req = {};

    const response = await chai.request(url).delete('/remove').send(req);
    response.should.have.status(400);
  });

  it("Error: account doesn't exist", async () => {
    const req = { agency: '10', account: '999' };

    const response = await chai.request(url).delete('/remove').send(req);
    response.should.have.status(400);

    const account = await accountModel.findOne(req);
    chai.expect(account).to.be.null;
  });
});
