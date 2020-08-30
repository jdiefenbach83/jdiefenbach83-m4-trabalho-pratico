const request = require('supertest');

const url = global.__URL__;

describe('delete /remove', () => {
  it('Remove an existing account', async () => {
    const req = { agency: '10', account: '1001' };

    const response = await request(url).delete('/remove').send(req);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('agencyCount');
  });

  it('Error: empty request', async () => {
    const req = {};

    const response = await request(url).delete('/remove').send(req);
    expect(response.statusCode).toEqual(400);
  });

  it("Error: account doesn't exist", async () => {
    const req = { agency: '10', account: '999' };

    const response = await request(url).delete('/remove').send(req);
    expect(response.statusCode).toEqual(400);
  });
});
