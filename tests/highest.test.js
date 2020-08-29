const request = require('supertest');
const url = global.__URL__;

describe('get /highest', () => {
  it('Get highest balance customers from the bank', async () => {
    const req = '/highest?limit=10';

    const response = await request(url).get(req);
    expect(response.statusCode).toEqual(200);
  });

  it('Error: empty request', async () => {
    const req = '/lowest';

    const response = await request(url).get(req);
    expect(response.statusCode).toEqual(400);
  });
});
