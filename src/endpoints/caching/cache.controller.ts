import {
  JwtAuthenticateGuard,
  JwtAdminGuard,
  ElrondCachingService,
} from '@multiversx/sdk-nestjs';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiResponse } from '@nestjs/swagger';
import { CacheValue } from './entities/cache.value';

@Controller()
export class CacheController {
  constructor(
    private readonly cachingService: ElrondCachingService,
    @Inject('PUBSUB_SERVICE') private clientProxy: ClientProxy,
  ) {}

  @UseGuards(JwtAuthenticateGuard, JwtAdminGuard)
  @Get('/caching/:key')
  @ApiResponse({
    status: 200,
    description: 'The cache value for one key',
    type: String,
  })
  @ApiResponse({
    status: 404,
    description: 'Key not found',
  })
  async getCache(@Param('key') key: string): Promise<unknown> {
    const value = await this.cachingService.get(key);
    if (!value) {
      throw new HttpException('Key not found', HttpStatus.NOT_FOUND);
    }
    return JSON.stringify(value);
  }

  @UseGuards(JwtAuthenticateGuard, JwtAdminGuard)
  @Put('/caching/:key')
  @ApiResponse({
    status: 200,
    description: 'Key has been updated',
  })
  async setCache(@Param('key') key: string, @Body() cacheValue: CacheValue) {
    await this.cachingService.set(key, cacheValue.value, cacheValue.ttl);
    this.clientProxy.emit('deleteCacheKeys', [key]);
  }

  @UseGuards(JwtAuthenticateGuard, JwtAdminGuard)
  @Delete('/caching/:key')
  @ApiResponse({
    status: 200,
    description: 'Key has been deleted from cache',
  })
  @ApiResponse({
    status: 404,
    description: 'Key not found',
  })
  async delCache(@Param('key') key: string) {
    const keys = await this.cachingService.delete(key);
    this.clientProxy.emit('deleteCacheKeys', keys);
  }

  @UseGuards(JwtAuthenticateGuard, JwtAdminGuard)
  @Get('/caching')
  async getKeys(
    @Query('keys') keys: string[],
  ): Promise<(string | undefined)[]> {
    return await this.cachingService.getMany(keys);
  }
}
