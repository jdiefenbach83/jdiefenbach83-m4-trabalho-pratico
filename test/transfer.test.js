import chai from 'chai';
import chaiHttp from 'chai-http';

const should = chai.should();

const url = 'http://localhost:6000/api';

chai.use(chaiHttp);

describe('POST /transfer', () => {
  it('Transfer from existing origin and destination accounts in the same agency', async () => {
    const req = { origin: 2211, destination: 2212, amount: 10 };

    const response = await chai.request(url).post('/transfer').send(req);
    response.should.have.status(200);
    response.body.origin.should.have.property('conta', 2211);
    response.body.origin.should.have.property('balance', 205);
  });

  it('Transfer from existing origin and destination accounts in different agencies', async () => {
    const req = { origin: 2214, destination: 9102, amount: 10 };

    const response = await chai.request(url).post('/transfer').send(req);
    response.should.have.status(200);
    response.body.origin.should.have.property('conta', 2214);
    response.body.origin.should.have.property('balance', 640);
  });

  it('Error: amount higher than balance', async () => {
    const req = { origin: 1002, destination: 1001, amount: 100000000 };

    const response = await chai.request(url).post('/transfer').send(req);
    response.should.have.status(400);
  });

  it('Error: empty request', async () => {
    const req = {};

    const response = await chai.request(url).post('/transfer').send(req);
    response.should.have.status(400);
  });

  it('Error: negative amount', async () => {
    const req = { origin: 1002, destination: 1001, amount: -10 };

    const response = await chai.request(url).post('/transfer').send(req);
    response.should.have.status(400);
  });

  it("Error: origin account doesn't exist", async () => {
    const req = { origin: 999, destination: 1001, amount: 10 };

    const response = await chai.request(url).post('/transfer').send(req);
    response.should.have.status(400);
  });

  it("Error: destination account doesn't exist", async () => {
    const req = { origin: 1002, destination: 999, amount: 10 };

    const response = await chai.request(url).post('/transfer').send(req);
    response.should.have.status(400);
  });
});
