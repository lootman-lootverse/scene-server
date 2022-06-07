export interface ConfigVariables {
  port: number;
  openapi: boolean;
  logger: {
    file: string;
  };
  database: {
    mysql: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
    };
  };
  bull: {
    redis: {
      host: string;
      port: number;
    };
  };
  web3: {
    ecRecoverNode: string;
    ecRecoverAlive: number;
  };
}
