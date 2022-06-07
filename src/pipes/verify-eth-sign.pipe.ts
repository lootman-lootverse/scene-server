import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Web3Service } from 'src/web3/web3.service';
import { DataWithSig, SigData } from 'src/dto/data-with-sig.dto';
import { ConfigService } from '@nestjs/config';
import { ConfigVariables } from 'src/config/config.interface';

/**
 * 用于校验 request body 中传递的的内容及签名。当校验通过时，返回内容及签名者
 */
@Injectable()
export class VerifyEthSignPipe implements PipeTransform {
  logger = new Logger(VerifyEthSignPipe.name);

  constructor(
    private readonly web3Svc: Web3Service,
    private readonly configSvc: ConfigService,
  ) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    this.logger.debug('value:' + JSON.stringify(value));
    const input: DataWithSig<any> = plainToClass(DataWithSig, value);

    const errors = await validate(input);
    if (errors.length > 0) {
      throw new BadRequestException('invliad DataWithSig<T> structure');
    }

    const recoverAddr = await this.web3Svc.ecRecover(
      JSON.stringify(input.data),
      input.sig,
    );
    if (recoverAddr.toLowerCase() !== input.data.address.toLowerCase()) {
      throw new BadRequestException('invalid DataWithSig<T> signature');
    }

    // 检查时间偏差
    const { ecRecoverAlive } =
      this.configSvc.get<ConfigVariables['web3']>('web3');

    const currTimesamp = new Date().valueOf();

    if (
      input.data.timestamp + ecRecoverAlive > currTimesamp ||
      input.data.timestamp > currTimesamp
    ) {
      throw new BadRequestException('invalid timestamp');
    }

    if (metadata.metatype == SigData) {
      return input.data;
    } else if (metadata.metatype == DataWithSig) {
      return input;
    } else {
      return input.data.rawdata;
    }
  }
}
