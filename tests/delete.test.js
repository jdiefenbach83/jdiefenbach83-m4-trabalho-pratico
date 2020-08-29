const request = require('supertest');
const { setupDB } = require('../test-setup');
const accountModel = require('../../models/accountModel');

const url = global.__URL__;

setupDB('test');

describe('delete /remove', () => {
  it('Creating an account to delete', async () => {
    const result = await accountModel.insertOne({
      insertOne: {
        document: {
          agencia: 10,
          conta: 1000,
          name: 'Jefferson Diefenbach',
          balance: 500,
        },
      },
    });

    const account = await accountModel.findOne({ agencia: 10, conta: 1000 });
    expect(account.agencia).toBeTruthy();
    expect(account.conta).toBeTruthy();
  });

  it('Remove an existing account', async () => {
    const req = { agency: '10', account: '1000' };

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
    expect(response.statusCode).toEqual(404);
  });
});
