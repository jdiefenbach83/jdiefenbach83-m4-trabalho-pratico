const request = require('supertest');
const url = global.__URL__;

describe('POST /transfer', () => {
  it('Transfer from existing origin and destination accounts in the same agency', async () => {
    const req = { origin: '1002', destination: '1001', amount: 10 };

    const response = await request(url).post('/transfer').send(req);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('origin.balance');
  });

  it('Transfer from existing origin and destination accounts in different agencies', async () => {
    const req = { origin: '3001', destination: '1001', amount: 10 };

    const response = await request(url).post('/transfer').send(req);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('origin.balance');
  });

  it('Error: amount higher than balance', async () => {
    const req = { origin: '1002', destination: '1001', amount: 100000000 };

    const response = await request(url).post('/transfer').send(req);
    expect(response.statusCode).toEqual(400);
  });

  it('Error: empty request', async () => {
    const req = {};

    const response = await request(url).post('/transfer').send(req);
    expect(response.statusCode).toEqual(400);
  });

  it('Error: negative amount', async () => {
    const req = { origin: '1002', destination: '1001', amount: -10 };

    const response = await request(url).post('/transfer').send(req);
    expect(response.statusCode).toEqual(400);
  });

  it("Error: origin account doesn't exist", async () => {
    const req = { origin: '999', destination: '1001', amount: 10 };

    const response = await request(url).post('/transfer').send(req);
    expect(response.statusCode).toEqual(404);
  });

  it("Error: destination account doesn't exist", async () => {
    const req = { origin: '1002', destination: '999', amount: 10 };

    const response = await request(url).post('/transfer').send(req);
    expect(response.statusCode).toEqual(404);
  });
});
