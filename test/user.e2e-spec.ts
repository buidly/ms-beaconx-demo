import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PublicAppModule } from '../src/public.app.module';
import request = require('supertest');

const gql = '/graphql';

describe('UserTests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PublicAppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('createUser', () => {
    it('Should create a new user', () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation {
            createUser(input: {
              firstName: "TestId1",
              lastName: "Test"
            }) {
              id
              firstName
              lastName
              isActive
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeUndefined();
          expect(res.body.data).toHaveProperty('createUser');
        });
    });
  });
});
