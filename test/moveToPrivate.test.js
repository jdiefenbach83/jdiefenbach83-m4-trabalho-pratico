import chai from 'chai';
import chaiHttp from 'chai-http';

const should = chai.should();

const url = 'http://localhost:6000/api';

chai.use(chaiHttp);

describe('POST /moveToPrivate', () => {
  it('Move the highest balances account to private agency', async () => {
    const req = { agency: 10, account: 1001, amount: 10 };

    const response = await chai.request(url).post('/moveToPrivate').send(req);
    response.should.have.status(200);
    response.body.should.have.lengthOf(4);
  });
});
