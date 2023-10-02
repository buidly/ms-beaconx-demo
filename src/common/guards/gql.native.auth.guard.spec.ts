import { GqlNativeAuthGuard } from './gql.native.auth.guard';
import { Test } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { NativeAuthServer } from '@multiversx/sdk-native-auth-server/lib/src/native.auth.server';
import { createMock } from '@golevelup/ts-jest';
import { NativeAuthResult as NativeAuthValidateResult } from '@multiversx/sdk-native-auth-server/lib/src/entities/native.auth.validate.result';

describe('GqlNativeAuthGuardTest', () => {
  let guard: GqlNativeAuthGuard;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [GqlNativeAuthGuard],
    })
      .useMocker((token) => {
        if (token === NativeAuthServer) {
          return {
            validate: jest.fn((jwt): NativeAuthValidateResult => {
              if (jwt === 'valid') {
                return {
                  expires: 3600,
                  origin: '',
                  address: 'address',
                  issued: 0,
                  extraInfo: {},
                };
              }

              if (jwt === 'admin') {
                return {
                  expires: 3600,
                  origin: '',
                  address:
                    'erd1qqqqqqqqqqqqqpgq8cer8c44z7um52465gt0pc833lcspdu64juslpuklj', // value from .env file
                  issued: 0,
                  extraInfo: {},
                };
              }

              throw new UnauthorizedException();
            }),
          };
        }

        return undefined;
      })
      .compile();

    guard = moduleRef.get(GqlNativeAuthGuard);
  });

  describe('canActivate', () => {
    it('should return false for no header', async () => {
      const mockExecutionContext = createMock<ExecutionContext>();
      mockExecutionContext.getArgs.mockReturnValue([
        {},
        {},
        {
          req: {
            headers: {
              authorization: '',
            },
          },
        },
        {},
      ]);

      expect(await guard.canActivate(mockExecutionContext)).toBeFalsy();
    });

    it('should throw error for invalid header', async () => {
      const mockExecutionContext = createMock<ExecutionContext>();
      mockExecutionContext.getArgs.mockReturnValue([
        {},
        {},
        {
          req: {
            headers: {
              authorization: 'Bearer invalid',
            },
          },
        },
        {},
      ]);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should be authentication valid', async () => {
      const res = createMock<Response>();
      const req = {
        headers: {
          authorization: 'Bearer valid',
        },
        res,
      };
      const mockExecutionContext = createMock<ExecutionContext>();
      mockExecutionContext.getArgs.mockReturnValue([{}, {}, { req }, {}]);

      expect(await guard.canActivate(mockExecutionContext)).toBeTruthy();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(req.nativeAuth.address).toBe('address');
    });

    it('should be authentication valid with non admin user impersonation', async () => {
      const res = createMock<Response>();
      const req = {
        headers: {
          authorization: 'Bearer valid',
          'impersonate-address': 'otherAddress',
        },
        res,
      };
      const mockExecutionContext = createMock<ExecutionContext>();
      mockExecutionContext.getArgs.mockReturnValue([{}, {}, { req }, {}]);

      expect(await guard.canActivate(mockExecutionContext)).toBeTruthy();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(req.nativeAuth.address).toBe('address');
    });

    it('should be invalid impersonation', async () => {
      const res = createMock<Response>();
      const req = {
        headers: {
          authorization: 'Bearer admin',
          'impersonate-address': 'otherAddress',
        },
        res,
      };
      const mockExecutionContext = createMock<ExecutionContext>();
      mockExecutionContext.getArgs.mockReturnValue([{}, {}, { req }, {}]);

      expect(await guard.canActivate(mockExecutionContext)).toBeTruthy();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(req.nativeAuth.address).toBe(
        'erd1qqqqqqqqqqqqqpgq8cer8c44z7um52465gt0pc833lcspdu64juslpuklj',
      );
    });

    it('should be valid impersonation', async () => {
      const res = createMock<Response>();
      const req = {
        headers: {
          authorization: 'Bearer admin',
          'impersonate-address':
            'erd1qqqqqqqqqqqqqpgq38zwarrn24c6df4essae6k8xeywf7aaa4jusz203xk',
        },
        res,
      };
      const mockExecutionContext = createMock<ExecutionContext>();
      mockExecutionContext.getArgs.mockReturnValue([{}, {}, { req }, {}]);

      expect(await guard.canActivate(mockExecutionContext)).toBeTruthy();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(req.nativeAuth.address).toBe(
        'erd1qqqqqqqqqqqqqpgq38zwarrn24c6df4essae6k8xeywf7aaa4jusz203xk',
      );
    });
  });
});
