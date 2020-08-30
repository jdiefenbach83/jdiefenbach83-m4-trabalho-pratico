import chai from 'chai';
import chaiHttp from 'chai-http';

const should = chai.should();

const url = 'http://localhost:6000/api';

chai.use(chaiHttp);

describe('POST /withdraw', () => {
  it('Withdraw from existing account', async () => {
    const req = { agency: 10, account: 1001, amount: 10 };

    const response = await chai.request(url).post('/withdraw').send(req);
    response.should.have.status(200);
    response.body.origin.should.have.property('agencia', 10);
    response.body.origin.should.have.property('conta', 1001);
    response.body.origin.should.have.property('balance', 586);
  });

  it('Error: amount higher than balance', async () => {
    const req = { agency: 10, account: 1001, amount: 10000 };

    const response = await chai.request(url).post('/withdraw').send(req);
    response.should.have.status(400);
  });

  it('Error: empty request', async () => {
    const req = {};

    const response = await chai.request(url).post('/withdraw').send(req);
    response.should.have.status(400);
  });

  it('Error: negative amount', async () => {
    const req = { agency: 10, account: 1001, amount: -10 };

    const response = await chai.request(url).post('/withdraw').send(req);
    response.should.have.status(400);
  });

  it("Error: account doesn't exist", async () => {
    const req = { agency: 10, account: 999, amount: 10 };

    const response = await chai.request(url).post('/withdraw').send(req);
    response.should.have.status(400);
  });
});
