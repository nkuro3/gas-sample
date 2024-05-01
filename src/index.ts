import {
  getTime,
  getAuthType,
  getConfig,
  getFields,
  getSchema,
  getData,
} from './main';

declare const global: {
  [x: string]: unknown;
};

global.getTime = getTime;
global.getAuthType = getAuthType;
global.getConfig = getConfig;
global.getFields = getFields;
global.getSchema = getSchema;
global.getData = getData;
