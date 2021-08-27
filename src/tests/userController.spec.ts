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

describe('User Sign Up',() => {
    it('should sign up the user', async () => {
        let req = await chai.request('http://localhost:3005/')
          .post('v1/user/create')
          .set('authorization', `Bearer ${CONFIG.STATIC_TOKEN}`)
          .send({
            fullName: uuid,
            userName: `${uuid+Math.random()}`,
            email: `${uuid}@gmail.com`,
            password: "abc@123",
            phone_1: "1111111455",
            phone_2: "1112122055",
            gender: "male",
            address: "plot bbc, street 5",
            role:"user",
            description: "lorem5",
            imageUrl: "http://3.16.172.190:3005/static/1622736212474_7f5489e3.jpg",
            isAcceptedTerm: true
          });
          expect(req).to.have.status(200);
        
         
})
it('should not sign up', async () => {
  let req = await chai.request('http://localhost:3005/')
    .post('v1/user/create')
    .set('authorization', `Bearer ${CONFIG.STATIC_TOKEN}`)
    .send({
            "fullName": uuid,
            "userName": uuid,
            "email": `${uuid}@gmail.com`,
            "password": "abc@123",
            "phone_1": "1111111455",
            "phone_2": "1112122055",
            "gender": "male",
            "address": "plot bbc, street 5",
            "role":"user",
            "description": "lorem5",
            "imageUrl": "http://3.16.172.190:3005/static/1622736212474_7f5489e3.jpg",
            "isAcceptedTerm": true
    });
    expect(req).not.to.have.status(200);
    
})
});

describe('User Signin', () => {
  it('should log in', async () => {
      // change user password
      let req = await chai.request('http://localhost:3005/')
        .post('v1/user/login')
        .set('authorization', `Bearer ${CONFIG.STATIC_TOKEN}`)
        .send({
          email: `${uuid}@gmail.com`,
          password: 'abc@123',
        });
        expect(req).to.have.status(200);
})
it('should not log in', async () => {
  // change user password
  let req = await chai.request('http://localhost:3005/')
    .post('v1/user/login')
    .set('authorization', `Bearer ${CONFIG.STATIC_TOKEN}`)
    .send({
        email: `${uuid}@gmail.com`,
        password: 'abc@1234',
    });
    expect(req).not.to.have.status(200);
})
})

describe('User Edit', () => {
  it('should edit username', async () => {
      const token = await tokenFile.tokenExtractor()
      let req = await chai.request('http://localhost:3005/')
        .patch('v1/user/profile?search=6124e6396874c027101ecea8')
        .set('authorization', `Bearer ${token}`)
        .send({
          userName: `${uuid}`,
        });
        expect(req).to.have.status(200);
})
it('should not edit username', async () => {
  // not change username
  const token = await tokenFile.tokenExtractor()
  let req = await chai.request('http://localhost:3005/')
    .patch('v1/user/profile?search=6124e6396874c027101ecea8')
    .set('authorization', `Bearer ${token}`)
    .send({
        userName: `${uuid}`
    });
    expect(req).not.to.have.status(200);
})
})

describe('User Profile',() => {
  it('should get user profile', async () => {
      const token = await tokenFile.tokenExtractor()
      let req = await chai.request('http://localhost:3005/')
        .get('v1/user/me')
        .set('authorization', `Bearer ${token}`)
        expect(req).to.have.status(200);   
})
it('should not get user profile', async () => {
  const token = await tokenFile.tokenExtractor()
  let req = await chai.request('http://localhost:3005/')
    .get('v1/user/me')
    .set('authorization', `Bearer ${token+1}`);
    expect(req).not.to.have.status(200);
    
})
})

describe('List Of Users (Admin Only)',() => {
  it('should get list of users', async () => {
      let req = await chai.request('http://localhost:3005/')
        .get('v1/user/get')
        .set('authorization', `Bearer ${adminToken}`)
        expect(req).to.have.status(200);   
})
it('should not get list of users', async () => {
  const token = await tokenFile.tokenExtractor()
  let req = await chai.request('http://localhost:3005/')
    .get('v1/user/get')
    .set('authorization', `Bearer ${token}`);
    expect(req).not.to.have.status(200);
    
})
})

describe('Get by userId (Admin Only)',() => {
  it('should get user', async () => {
      let req = await chai.request('http://localhost:3005/')
        .get('v1/user/get-by?search=61265cde2c87152be04a77ae')
        .set('authorization', `Bearer ${adminToken}`)
        expect(req).to.have.status(200);   
})
it('should not get user', async () => {
  const token = await tokenFile.tokenExtractor()
  let req = await chai.request('http://localhost:3005/')
    .get('v1/user/get-by?search=61265cde2c87152be04a77ae')
    .set('authorization', `Bearer ${token}`);
    expect(req).not.to.have.status(200);
    
})
})

describe('User Sign Out',() => {
  it('should sign out a user', async () => {
      const token = await tokenFile.tokenExtractor()
      let req = await chai.request('http://localhost:3005/')
        .get('v1/session/logout')
        .set('authorization', `Bearer ${token}`)
        expect(req).to.have.status(200);   
})
it('should not sign out', async () => {
  const token = await tokenFile.tokenExtractor()
  let req = await chai.request('http://localhost:3005/')
    .get('v1/session/logout')
    .set('authorization', `Bearer ${token}`);
    expect(req).not.to.have.status(200);
    
})
})