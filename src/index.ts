import { getTime } from './main';

declare const global: {
  [x: string]: unknown;
};

global.getTime = getTime;
