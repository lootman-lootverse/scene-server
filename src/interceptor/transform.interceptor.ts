import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (
          data &&
          data['code'] !== undefined &&
          data['msg'] !== undefined &&
          data['data'] !== undefined
        ) {
          return data;
        }
        return {
          code: 0,
          data,
          msg: '',
        };
      }),
    );
  }
}
