import chai from 'chai';
import chaiHttp from 'chai-http';

const should = chai.should();

const url = 'http://localhost:6000/api';

chai.use(chaiHttp);

describe('GET /lowest', () => {
  it('Get lowest balance customers from the bank', async () => {
    const req = '/lowest?limit=5';

    const response = await chai.request(url).get(req);
    response.should.have.status(200);
    response.body.should.have.lengthOf(5);
  });

  it('Error: empty request', async () => {
    const req = '/lowest';

    const response = await chai.request(url).get(req);
    response.should.have.status(400);
  });
});
