import { ConfigValue } from './configuration.utils';

class UrlsConfig {
  @ConfigValue({ env: 'URLS_API' })
  public readonly api!: string;

  @ConfigValue({ env: 'URLS_ELASTIC' })
  public readonly elastic!: string;

  @ConfigValue({ env: 'URLS_GATEWAY' })
  public readonly gateway!: string;

  @ConfigValue({ env: 'URLS_REDIS' })
  public readonly redis!: string;

  @ConfigValue({ env: 'URLS_XEXCHANGE' })
  public readonly xExchange!: string;
}

class KeepAliveConfig {
  @ConfigValue({ yaml: 'keepAlive.enabled' })
  public readonly enabled!: boolean;
}

class ContractsConfig {
  @ConfigValue({
    yaml: 'contracts.swap',
    mapper: (address: string) => address.toLowerCase(),
  })
  public readonly swapContract!: string;
}

class SecurityConfig {
  @ConfigValue({ yaml: 'security.jwtSecret' })
  public readonly jwtSecret!: string;

  @ConfigValue({ yaml: 'rateLimiterSecret', defaultValue: '' })
  public readonly rateLimiterSecret!: string;

  @ConfigValue({ yaml: 'nativeAuthTtl', defaultValue: 86400 })
  public readonly nativeAuthTtl!: number;

  @ConfigValue({ yaml: 'nativeAuthAcceptedHosts', defaultValue: [] })
  public readonly nativeAuthAcceptedHosts!: string[];

  @ConfigValue({
    env: 'SECURITY_ADMINS',
    mapper: (admins: string) => JSON.parse(admins),
    defaultValue: [],
  })
  public readonly admins!: string[];
}

class PublicApiConfig {
  @ConfigValue({ env: 'PUBLIC_API_ENABLED', mapper: (val: string) => val.toLowerCase() === 'true' })
  public readonly isActive!: boolean;

  @ConfigValue({ env: 'PUBLIC_API_PORT' })
  public readonly port!: number;
}

class PrivateApiConfig {
  @ConfigValue({ env: 'PRIVATE_API_ENABLED', mapper: (val: string) => val.toLowerCase() === 'true' })
  public readonly isActive!: boolean;

  @ConfigValue({ env: 'PRIVATE_API_PORT' })
  public readonly port!: number;
}

class CacheWarmerConfig {
  @ConfigValue({ env: 'CACHE_WARMER_ENABLED', mapper: (val: string) => val.toLowerCase() === 'true' })
  public readonly isActive!: boolean;

  @ConfigValue({ env: 'CACHE_WARMER_PORT' })
  public readonly port!: number;
}

class TransactionProcessorConfig {
  @ConfigValue({ env: 'TRANSACTION_PROCESSOR_ENABLED', mapper: (val: string) => val.toLowerCase() === 'true' })
  public readonly isActive!: boolean;

  @ConfigValue({ env: 'TRANSACTION_PROCESSOR_PORT' })
  public readonly port!: number;

  @ConfigValue({ yaml: 'features.transactionProcessor.maxLookBehind' })
  public readonly maxLookBehind!: number;
}

class EventsNotifierConfig {

  @ConfigValue({ env: 'EVENTS_NOTIFIER_ENABLED', mapper: (val: string) => val.toLowerCase() === 'true' })
  public readonly isActive!: boolean;

  @ConfigValue({ env: 'EVENTS_NOTIFIER_PORT' })
  public readonly port!: number;

  @ConfigValue({ env: 'EVENTS_NOTIFIER_URL' })
  public readonly url!: string;

  @ConfigValue({ env: 'EVENTS_NOTIFIER_EXCHANGE' })
  public readonly exchange!: string;

  @ConfigValue({ env: 'EVENTS_NOTIFIER_QUEUE' })
  public readonly queue!: string;

}

class FeaturesConfig {
  public readonly publicApi: PublicApiConfig = new PublicApiConfig();
  public readonly privateApi: PrivateApiConfig = new PrivateApiConfig();
  public readonly cacheWarmer: CacheWarmerConfig = new CacheWarmerConfig();
  public readonly transactionProcessor: TransactionProcessorConfig =
    new TransactionProcessorConfig();
  public readonly eventsNotifier: EventsNotifierConfig = new EventsNotifierConfig();
}

class DappConfig {
  @ConfigValue({ yaml: 'dapp.environment' })
  public readonly environment!: string;

  @ConfigValue({ yaml: 'dapp.updateRefreshRate', defaultValue: 60000 })
  public readonly updateRefreshRate!: number;

  @ConfigValue({ yaml: 'dapp.apiTimeout', defaultValue: 6000 })
  public readonly apiTimeout!: number;

  @ConfigValue({ yaml: 'dapp.walletConnectV2ProjectId' })
  public readonly walletConnectV2ProjectId!: string;
}

class MongoConfig {
  @ConfigValue({ env: 'MONGO_URL' })
  public readonly url!: string;
}

class PostgresConfig {
  @ConfigValue({ env: 'POSTGRES_URL' })
  public readonly url!: string;
}

class ConfigClass {
  @ConfigValue({ yaml: 'chainId' })
  public readonly chainId!: string;

  public readonly urls: UrlsConfig = new UrlsConfig();

  public readonly keepAlive: KeepAliveConfig = new KeepAliveConfig();

  public readonly contracts: ContractsConfig = new ContractsConfig();

  public readonly security: SecurityConfig = new SecurityConfig();

  public readonly features: FeaturesConfig = new FeaturesConfig();

  public readonly dapp: DappConfig = new DappConfig();

  public readonly mongo: MongoConfig = new MongoConfig();

  public readonly postgres: PostgresConfig = new PostgresConfig();

  @ConfigValue({ yaml: 'keepAlive.timeout.downstream', defaultValue: 61000 })
  public readonly axiosTimeout!: number;

  @ConfigValue({ yaml: 'keepAlive.timeout.upstream', defaultValue: 60000 })
  public readonly serverTimeout!: number;

  @ConfigValue({ yaml: 'useCachingInterceptor', defaultValue: false })
  public readonly useCachingInterceptor!: boolean;
}

const Config = new ConfigClass();

export default Config;
