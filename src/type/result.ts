// 服务器层code
export enum ServerCode {
  Success = '00', // 成功
  AuthFail = '1000002', // 登录过期
}

// net层code
export enum NetResultCode {
  Success = 0, // 成功
  Fail = 1, // 失败
  Timeout = 2, // 超时
}

// net层数据格式
export interface NetResultData<T> {
  code: NetResultCode;
  data: T;
  msg: string;
  success: boolean;
}

// 请求方式
export enum Methods {
  T0 = 'get',
  T1 = 'postForm',
  T2 = 'post',
}

// 请求参数
export interface RequestParameter {
  method?: Methods; // 请求类型
  url: string; //url
  data?: any; //请求参数
  headers?: any; //自定义请求头
  timeout?: number; // 超时时间
  retry?: number; // 失败重试次数
}
