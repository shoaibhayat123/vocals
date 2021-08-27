const chai = require('chai')
const expect = chai.expect
import 'mocha';
import chaiHttp from 'chai-http';
chai.use(chaiHttp)
const STATIC_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InJvbGUiOiJ1c2VyIiwidXNlcklkIjoiNWY1Yjk0YTY2YTNjYTMwMDA0YzJjZWJiIn0sImlhdCI6MTU5OTgzOTMwMiwiZXhwIjoxNjAwMDk4NTAyfQ.Fdft4zwZwOzww6Fdbk2t4UiTz1cpNSrIYrzsvddXh1U';

 const tokenExtractor = async()=> {
  let token: string = ''
  let req = await chai.request('http://localhost:3005/')
  .post('v1/user/login')
  .set('authorization', `Bearer ${STATIC_TOKEN}`)
  .send({
    email: 'testing@appverticals.com',
    password: 'abc@123',
  });
  return token = req.body.user.access_token
}

exports.tokenExtractor = tokenExtractor