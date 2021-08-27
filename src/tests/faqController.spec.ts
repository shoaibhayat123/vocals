import * as chai from 'chai'
const expect = chai.expect
import 'mocha';
import { v4 as uuidv4 } from 'uuid';
import chaiHttp from 'chai-http';
import { CONFIG } from '../models/constants';
chai.use(chaiHttp)
const tokenFile = require('../tests/authTokenCheck.spec')
const uuid:string = uuidv4()
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InJvbGUiOiJzdXBlciBhZG1pbiIsInVzZXJJZCI6IjYxMjc2NjU5MzlmM2ZhMWE2NGUxMGI1NyJ9LCJpYXQiOjE2Mjk5NzIwNTcsImV4cCI6MTYzMDIzMTI1N30.Xglu5Ny7y8OmHFY0NrH96XJld7qnHkQiEHXogDtueJY'

describe('FAQ Creation', () => {
  it('should create a FAQ', async () => {
      // change user password
      let req = await chai.request('http://localhost:3005/')
        .post('v1/faq/create')
        .set('authorization', `Bearer ${adminToken}`)
        .send({
            "question": "Am I logged in?",
            "answer": "Testing answer",
            "category":"subscription"
        });
        expect(req).to.have.status(200);
})
it('should not create a FAQ', async () => {
  let req = await chai.request('http://localhost:3005/')
    .post('v1/faq/create')
    .set('authorization', `Bearer ${adminToken}`)
    .send({
            "answer": "Testing answer",
            "category":"subscription"
    });
    expect(req).not.to.have.status(200);
})
})

describe('All FAQs', () => {
  it('should get FAQs', async () => {
      let req = await chai.request('http://localhost:3005/')
        .get('v1/faq/get')
        .set('authorization', `Bearer ${adminToken}`)
        expect(req).to.have.status(200);
})
it('should not get FAQs', async () => {
  // not change username
  const token = await tokenFile.tokenExtractor()
  let req = await chai.request('http://localhost:3005/')
    .get('v1/fat/get')
    .set('authorization', `Bearer ${token}`)
    expect(req).not.to.have.status(200);
})
})

describe('Edit FAQ',() => {
  it('should edit FAQ', async () => {
      let req = await chai.request('http://localhost:3005/')
        .post('v1/faq/edit/?search=61277556d1e244292008a2e1')
        .set('authorization', `Bearer ${adminToken}`)
        .send({
            "answer": "Testing answer",
            "category":"subscription"
        });
        expect(req).to.have.status(200);   
})
it('should not edit FAQ', async () => {
  const token = await tokenFile.tokenExtractor()
  let req = await chai.request('http://localhost:3005/')
    .post('v1/faq/edit/?search=61277556d1e244292008a2e1')
    .set('authorization', `Bearer ${token}`)
    .send({
        "answer": "Testing answer",
        "category":"subscription"
    });
    expect(req).not.to.have.status(200);
    
})
})

describe('Get FAQ by Id',() => {
  it('should get FAQ', async () => {
      let req = await chai.request('http://localhost:3005/')
        .get('v1/faq/get-by?search=61277556d1e244292008a2e1')
        .set('authorization', `Bearer ${adminToken}`)
        expect(req).to.have.status(200);   
})
it('should not get FAQ', async () => {
  const token = await tokenFile.tokenExtractor()
  let req = await chai.request('http://localhost:3005/')
    .get('v1/faq/get-by?search=61277556d1e244292008a2e1')
    .set('authorization', `Bearer ${token}`);
    expect(req).not.to.have.status(200);
    
})
})
