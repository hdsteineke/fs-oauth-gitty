const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');


jest.mock('../lib/services/github');


describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('should redirect user to github oauth for login', async () => {
    const res = await request(app).get('/api/v1/github/login');
    console.log('res.header.location', res.header.location);
    expect(res.header.location).toMatch(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/callback`);


  });
  afterAll(() => {
    pool.end();
  });
});
