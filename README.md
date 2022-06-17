# Scenes Server

创作/解谜场景的服务端程序，提供用户场景体验状态的记录、留言存储及IPFS接入功能。

## 项目结构

项目采用`nestjs`框架，以模块化方式开发，主要模块为：

- Transform Intecepter
  
  对Controller返回结果统一包装为 {code, msg, data} 形式。
  
- RequestLoggerMiddleware

  开始处理请求时、请求处理完成时打印日志，并附带耗时信息
  
- VerifyEthSignPipe

  用于解析、验证用户签名数据
  
- IpfsModule

  ipfs相关服务，目前提供文件上传功能。
  
- ScenesModule

  场景相关服务，目前留言、解密报告、故事创作、场景勋章功能。



## 部署&启动流程

1. 安装依赖

    ``` bash
    $ pnpm install
    ```

2. 配置运行参数
    
    项目使用`nestjs`的`ConfigModule`模块，从环境文件及环境变量中提取参数，参数列表如下
    
    ``` bash
    # 服务运行端口
    PORT=3300
    # 是否启用Swagger文档
    OPENAPI=true
    # 日志文件存储位置
    LOGGER_FILE=logs/server.log
    # 数据库相应配置
    DATABASE_MYSQL_HOST=127.0.0.1
    DATABASE_MYSQL_PORT=3306
    DATABASE_MYSQL_USER=root
    DATABASE_MYSQL_PASSWORD=root
    DATABASE_MYSQL_DATABASE=dorahacks-scenes
    # bull 消息队列所用的 redis 服务配置
    BULL_REDIS_HOST=127.0.0.1
    BULL_REDIS_PORT=6379
    # 用于验证用户签名的节点rpc地址
    WEB3_ECRECOVER_NODE=http://127.0.0.1:8545
    # 签名中时间戳的有效期限
    WEB3_ECRECOVER_ALIVE=60000
    ```

3. 启动项目

    程序中配置为自动同步数据库，无需手动创建。若需要监听本地文件变化，请使用 `pnpm start:dev` 命令

    ``` bash
    $ pnpm start
    ```

## The following is framework README.md

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
