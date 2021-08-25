import * as chai from 'chai'
const expect = chai.expect
import 'mocha';
import { v4 as uuidv4 } from 'uuid';
import chaiHttp from 'chai-http';
import { CONFIG } from '../models/constants';
chai.use(chaiHttp)
const tokenFile = require('../tests/authTokenCheck.spec')
const uuid:string = uuidv4()

describe('User Sign Up',() => {
    it('should sign up the user', async () => {
        let req = await chai.request('http://localhost:3002/')
          .post('v1/user/create')
          .set('authorization', `Bearer ${CONFIG.STATIC_TOKEN}`)
          .send({
            fullName: uuid,
            userName: uuid,
            email: `${uuid}@gmail.com`,
            password: "abc@123",
            phone_1: "1111111455",
            phone_2: "1112122055",
            gender: "male",
            address: "plot bbc, street 5",
            role:"user",
            description: "lorem5",
            imageUrl: "http://3.16.172.190:3002/static/1622736212474_7f5489e3.jpg",
            isAcceptedTerm: true
          });
          expect(req).to.have.status(200);
        
         
})
it('should not sign up', async () => {
  let req = await chai.request('http://localhost:3002/')
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
            "imageUrl": "http://3.16.172.190:3002/static/1622736212474_7f5489e3.jpg",
            "isAcceptedTerm": true
    });
    expect(req).not.to.have.status(200);
    
})
});

describe('User Signin', () => {
  it('should log in', async () => {
      // change user password
      let req = await chai.request('http://localhost:3002/')
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
  let req = await chai.request('http://localhost:3002/')
    .post('v1/user/login')
    .set('authorization', `Bearer ${CONFIG.STATIC_TOKEN}`)
    .send({
        email: `${uuid}@gmail.com`,
        password: 'abc@1234',
    });
    expect(req).not.to.have.status(200);
})
})

describe('User Sign Out',() => {
  it('should sign out a user', async () => {
      const token = await tokenFile.tokenExtractor()
      let req = await chai.request('http://localhost:3002/')
        .get('v1/session/logout')
        .set('authorization', `Bearer ${token}`)
        expect(req).to.have.status(200);   
})
it('should not sign out', async () => {
  const token = await tokenFile.tokenExtractor()
  let req = await chai.request('http://localhost:3002/')
    .get('v1/session/logout')
    .set('authorization', `Bearer ${token}`);
    expect(req).not.to.have.status(200);
    
})
})

