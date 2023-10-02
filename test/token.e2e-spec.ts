import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PublicAppModule } from '../src/public.app.module';
import request = require('supertest');

const gql = '/graphql';

describe('TokenTests', () => {
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

  describe('createToken', () => {
    it('Should create a new token', () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation {
            createToken(input: {
              identifier: "TestId1",
              name: "Test"
            }) {
              identifier,
              name
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeUndefined();
          expect(res.body.data).toHaveProperty('createToken');
        });
    });
  });
});
