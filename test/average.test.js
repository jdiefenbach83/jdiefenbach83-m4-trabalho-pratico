import chai from 'chai';
import chaiHttp from 'chai-http';

const should = chai.should();

const url = 'http://localhost:6000/api';

chai.use(chaiHttp);

describe('GET /average', () => {
  it('Get average from existing agency', async () => {
    const req = '/average?agency=33';

    const response = await chai.request(url).get(req);
    response.should.have.status(200);
    response.body.should.have.property('agencia', 33);
    response.body.should.have.property('balance', 528.3);
  });

  it('Error: empty request', async () => {
    const req = '/average';

    const response = await chai.request(url).get('/average').send(req);
    response.should.have.status(400);
  });

  it("Error: agency doesn't exist", async () => {
    const req = '/average?agency=999';

    const response = await chai.request(url).get('/average').send(req);
    response.should.have.status(400);
  });
});
