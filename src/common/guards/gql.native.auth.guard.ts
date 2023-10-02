import { Address } from '@multiversx/sdk-core/out';
import { NativeAuthResult } from '@multiversx/sdk-native-auth-server/lib/src/entities/native.auth.validate.result';
import { NativeAuthServer } from '@multiversx/sdk-native-auth-server/lib/src/native.auth.server';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import Config from '../../../config/configuration';

@Injectable()
export class GqlNativeAuthGuard implements CanActivate {
  constructor(private readonly authServer: NativeAuthServer) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const authorization: string = request.headers['authorization'];
    if (!authorization) {
      return false;
    }
    const jwt = authorization.replace('Bearer ', '');

    try {
      const userInfo = await this.authServer.validate(jwt);

      request.res.set('X-Native-Auth-Issued', userInfo.issued);
      request.res.set('X-Native-Auth-Expires', userInfo.expires);
      request.res.set('X-Native-Auth-Address', userInfo.address);
      request.res.set(
        'X-Native-Auth-Timestamp',
        Math.round(new Date().getTime() / 1000),
      );

      request.nativeAuth = this.getImpersonatedUserIfAny(userInfo, request);

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private getImpersonatedUserIfAny(
    userInfo: NativeAuthResult,
    request: Request,
  ): NativeAuthResult {
    const impersonatedAddress: string = request.headers[
      'impersonate-address'
    ] as string;

    if (!impersonatedAddress) {
      return userInfo;
    }

    if (!Config.security.admins.includes(userInfo.address)) {
      return userInfo;
    }

    try {
      // Will throw an error if the address is not valid
      const address = new Address(impersonatedAddress);

      return new NativeAuthResult({
        ...userInfo,
        address: address.toString(),
      });
    } catch (error) {
      return userInfo;
    }
  }
}
