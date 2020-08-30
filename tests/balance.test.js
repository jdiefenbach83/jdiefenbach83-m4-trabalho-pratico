const request = require('supertest');
const url = global.__URL__;

describe('get /balance', () => {
  it('Get balance from existing account', async () => {
    const req = '/balance?agency=10&account=1001';

    const response = await request(url).get(req);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('origin.balance');
  });

  it('Error: empty request', async () => {
    const req = '/balance';

    const response = await request(url).get(req);
    expect(response.statusCode).toEqual(400);
  });

  it("Error: account doesn't exist", async () => {
    const req = '/balance?agency=10&account=999';

    const response = await request(url).get(req);
    expect(response.statusCode).toEqual(400);
  });
});
