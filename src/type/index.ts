export type SignState = true | false; // 登录状态

export interface HomesData {
  [key: string]: any;
}

export enum PayType {
  WEIXIN = 1,
  ZFB = 2,
}

export enum ChainType {
  POLYGON = 'polygon',
  HECO = 'heco',
}

export type ChainSpeed = 'slow' | 'normal' | 'fast';
