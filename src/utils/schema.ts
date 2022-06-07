import { getSchemaPath } from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { SigData } from 'src/dto/data-with-sig.dto';
import { ResponseData } from '../dto/response-data.dto';
import { PageResult } from './page';

interface ResponseDataWrapOptions {
  model?: string | { new (): any };
  schema?: SchemaObject & Partial<ReferenceObject>;
  isArray?: boolean;
  optional?: boolean;
}

function getModelType(model: string | { new (): any }) {
  let target: SchemaObject | ReferenceObject = { $ref: getSchemaPath(model) };
  if (model === String) {
    target = { type: 'string' };
  } else if (model === Boolean) {
    target = { type: 'boolean' };
  } else if (model === Number) {
    target = { type: 'number' };
  }
  return target;
}

export function withResponseDataWrap({
  model,
  schema,
  isArray = false,
  optional = false,
}: ResponseDataWrapOptions) {
  let target;
  if (model) {
    target = getModelType(model);
  } else {
    target = schema;
  }

  const outputSchema: SchemaObject & Partial<ReferenceObject> = {
    allOf: [
      { $ref: getSchemaPath(ResponseData) },
      {
        required: optional ? [] : ['data'],
        properties: {
          data: {
            type: 'array',
            items: target,
          },
        },
      },
    ],
  };
  if (!isArray) {
    outputSchema.allOf[1]['properties'].data = target;
  }
  return outputSchema;
}

export interface WithPageResultWrapOptions {
  model: string | { new (): any };
}
export function withPageResultWrap({ model }: WithPageResultWrapOptions) {
  const target = getModelType(model);

  const schema: SchemaObject & Partial<ReferenceObject> = {
    allOf: [
      { $ref: getSchemaPath(PageResult) },
      {
        required: ['data'],
        properties: {
          data: {
            type: 'array',
            items: target,
          },
        },
      },
    ],
  };

  return schema;
}

export function schemaWithEthSig({
  model,
}: {
  model: string | { new (): any };
}) {
  const target = getModelType(model);

  const schema: SchemaObject & Partial<ReferenceObject> = {
    required: ['data', 'sig'],
    properties: {
      data: {
        allOf: [
          { $ref: getSchemaPath(SigData) },
          {
            properties: {
              rawdata: target,
            },
          },
        ],
      },
      sig: {
        type: 'string',
      },
    },
  };

  return schema;
}
