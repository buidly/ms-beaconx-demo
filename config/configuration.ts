import { ConfigValue } from './configuration.utils';

class EventsNotifierConfig {

  @ConfigValue({ env: 'EVENTS_NOTIFIER_PORT' })
  public readonly port!: number;

  @ConfigValue({ env: 'EVENTS_NOTIFIER_URL' })
  public readonly url!: string;

  @ConfigValue({ env: 'EVENTS_NOTIFIER_EXCHANGE' })
  public readonly exchange!: string;

  @ConfigValue({ env: 'EVENTS_NOTIFIER_QUEUE' })
  public readonly queue!: string;

}

class ConfigClass {
  public readonly eventsNotifier: EventsNotifierConfig = new EventsNotifierConfig();
}

const Config = new ConfigClass();

export default Config;
