import { ErdnestConfigService } from '@multiversx/sdk-nestjs';
import { Injectable } from '@nestjs/common';
import Config from 'config/configuration';

@Injectable()
export class ErdnestConfigServiceImpl implements ErdnestConfigService {
  getSecurityAdmins(): string[] {
    return Config.security.admins;
  }

  getJwtSecret(): string {
    return Config.security.jwtSecret;
  }

  getApiUrl(): string {
    return Config.urls.api;
  }

  getNativeAuthMaxExpirySeconds(): number {
    return Config.security.nativeAuthTtl;
  }

  getNativeAuthAcceptedOrigins(): string[] {
    return Config.security.nativeAuthAcceptedHosts;
  }
}
