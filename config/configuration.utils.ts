import "reflect-metadata";
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

require("dotenv").config({
  path: process.env.NODE_ENV == 'test' ? '.env.test' : '.env',
});

const YAML_CONFIG_FILENAME = 'config.yaml';

let configs: Record<string, any>;

const configFactory = (): Record<string, any> => {
  if (!configs) {
    configs = yaml.load(
      readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
    ) as Record<string, any>;
  }
  return configs;
};

interface ConfigValueOptions<T> {
  yaml?: string,
  env?: string,
  defaultValue?: T;
  mapper?: (rawValue: any) => T
}

export function ConfigValue<T>(options: ConfigValueOptions<T>): PropertyDecorator {
  let configValue: T | undefined;

  if (options.env) {
    configValue = process.env[options.env] as T | undefined;
  }

  if (options.yaml) {
    const yamlConfig = configFactory();
    configValue = options.yaml
      .split('.')
      .reduce((value: any, field: string) => value ? value[field] : undefined, yamlConfig);
  }

  let value = configValue ?? options?.defaultValue;

  if (value === undefined) {
    throw new Error(`No config '${options.env ?? options.yaml}' is present`);
  }

  if (options?.mapper) {
    value = options.mapper(value);
  }

  return (target: any, key): void => {
    Reflect.deleteProperty(target, key);
    Reflect.defineProperty(target, key, {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      get: () => value!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      set: () => value!,
      enumerable: true,
      configurable: true,
    });
  };
}
