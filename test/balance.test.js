import chai from 'chai';
import chaiHttp from 'chai-http';

const should = chai.should();

const url = 'http://localhost:6000/api';

chai.use(chaiHttp);

describe('GET /balance', () => {
  it('Get balance from existing account', async () => {
    const req = '/balance?agency=33&account=9107';

    const response = await chai.request(url).get(req);
    response.should.have.status(200);
    response.body.origin.should.have.property('balance', 854);
  });

  it('Error: empty request', async () => {
    const req = '/balance';

    const response = await chai.request(url).get(req);
    response.should.have.status(400);
  });

  it("Error: account doesn't exist", async () => {
    const req = '/balance?agency=10&account=999';

    const response = await chai.request(url).get(req);
    response.should.have.status(400);
  });
});
