import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigVariables } from 'src/config/config.interface';
import Web3 from 'web3';

@Injectable()
export class Web3Service {
  private readonly logger = new Logger(Web3Service.name);

  // private readonly ecRecoverWeb3: Web3Cli;
  constructor(private configService: ConfigService) {}

  async ecRecover(encrypted: string, sig: string): Promise<string> {
    this.logger.debug('ecRecover ' + encrypted + ' ' + sig);
    if (sig.endsWith('00')) {
      sig = sig.slice(0, sig.length - 2) + '1b';
      this.logger.debug('change to ' + sig);
    } else if (sig.endsWith('01')) {
      sig = sig.slice(0, sig.length - 2) + '1c';
      this.logger.debug('change to ' + sig);
    }
    const config = this.configService.get<ConfigVariables['web3']>('web3');
    const client = new Web3(config.ecRecoverNode);
    const recoverAddr = await client.eth.personal.ecRecover(encrypted, sig);
    return recoverAddr.toLowerCase();
  }
}
