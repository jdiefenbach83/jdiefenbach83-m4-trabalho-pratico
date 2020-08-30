const request = require('supertest');
const url = global.__URL__;

describe('POST /deposit', () => {
  it('Deposit into existing account', async () => {
    const req = { agency: '10', account: '1001', amount: 10 };

    const response = await request(url).post('/deposit').send(req);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('destination.balance');
  });

  it('Error: empty request', async () => {
    const req = {};

    const response = await request(url).post('/deposit').send(req);
    expect(response.statusCode).toEqual(400);
  });

  it('Error: negative amount', async () => {
    const req = { agency: '10', account: '1001', amount: -10 };

    const response = await request(url).post('/deposit').send(req);
    expect(response.statusCode).toEqual(400);
  });

  it("Error: account doesn't exist", async () => {
    const req = { agency: '10', account: '999', amount: 10 };

    const response = await request(url).post('/deposit').send(req);
    expect(response.statusCode).toEqual(400);
  });
});
