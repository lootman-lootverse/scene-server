import { ConfigVariables } from './config.interface';
const S = (key: string) => process.env[key];
const I = (key: string) => parseInt(process.env[key]);
const B = (key: string) => process.env[key].toLowerCase() === 'true';
const A = (key: string) => {
  const reg = `^${key}\\.(\\d)+$`;
  const indexes: number[] = [];
  const indexValue: Record<number, string> = {};
  for (const name of Object.keys(process.env)) {
    const result = name.match(reg);
    if (result) {
      const idx = parseInt(result[1]);
      indexes.push(idx);
      indexValue[idx] = process.env[name];
    }
  }
  const arr: string[] = [];
  indexes.sort().forEach((v) => {
    arr.push(indexValue[v]);
  });
  return arr;
};

export default () => {
  const config: ConfigVariables = {
    port: I('PORT'),
    openapi: B('OPENAPI'),
    logger: {
      file: S('LOGGER_FILE'),
    },
    database: {
      mysql: {
        host: S('DATABASE_MYSQL_HOST'),
        port: I('DATABASE_MYSQL_PORT'),
        database: S('DATABASE_MYSQL_DATABASE'),
        user: S('DATABASE_MYSQL_USER'),
        password: S('DATABASE_MYSQL_PASSWORD'),
      },
    },
    bull: {
      redis: {
        host: S('BULL_REDIS_HOST'),
        port: I('BULL_REDIS_PORT'),
      },
    },
    web3: {
      ecRecoverNode: S('WEB3_ECRECOVER_NODE'),
      ecRecoverAlive: I('WEB3_ECRECOVER_ALIVE'),
    },
  };
  return config;
};
