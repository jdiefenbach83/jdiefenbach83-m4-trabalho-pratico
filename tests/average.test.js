const request = require('supertest');
const url = global.__URL__;

describe('get /average', () => {
  it('Get average from existing agency', async () => {
    const req = '/average?agency=10';

    const response = await request(url).get(req);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('balance');
  });

  it('Error: empty request', async () => {
    const req = '/average';

    const response = await request(url).get(req);
    expect(response.statusCode).toEqual(400);
  });

  it("Error: agency doesn't exist", async () => {
    const req = '/average?agency=999';

    const response = await request(url).get(req);
    expect(response.statusCode).toEqual(404);
  });
});
