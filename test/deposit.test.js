import chai from 'chai';
import chaiHttp from 'chai-http';

const should = chai.should();

const url = 'http://localhost:6000/api';

chai.use(chaiHttp);

describe('POST /deposit', () => {
  it('Deposit into existing account', async () => {
    const req = { agency: 10, account: 1001, amount: 10 };

    const response = await chai.request(url).post('/deposit').send(req);
    response.should.have.status(200);
    response.body.destination.should.have.property('agencia', 10);
    response.body.destination.should.have.property('conta', 1001);
    response.body.destination.should.have.property('balance', 597);
  });

  it('Error: empty request', async () => {
    const req = {};

    const response = await chai.request(url).post('/deposit').send(req);
    response.should.have.status(400);
  });

  it('Error: negative amount', async () => {
    const req = { agency: 10, account: 1001, amount: -10 };

    const response = await chai.request(url).post('/deposit').send(req);
    response.should.have.status(400);
  });

  it("Error: account doesn't exist", async () => {
    const req = { agency: 10, account: 999, amount: 10 };

    const response = await chai.request(url).post('/deposit').send(req);
    response.should.have.status(400);
  });
});
