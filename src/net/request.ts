import axios from 'axios';
import qs from 'qs';

import {
  ServerCode,
  NetResultCode,
  NetResultData,
  RequestParameter,
  Methods,
} from '@/type/result';
import { Storage } from '@/type/storage';
import { TIME_OUT } from './constant';
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  clearLocalStorage,
} from '@/util/storage';

const instance = axios.create();

// 请求数据拦截处理
instance.interceptors.request.use(
  (config) => {
    const token = getLocalStorage(Storage.Token);
    if (token) {
      try {
        config.headers.token = JSON.parse(token).token;
      } catch (err) {
        console.log('err', err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 返回数据拦截处理
instance.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (err) => {
    console.log(err);
    let config = err.config;
    if (config.retry > 0) {
      config.retry--;
      config.data = JSON.parse(config.data);
      return instance(config);
    }
    return err.response.data;
  },
);

class Request {
  success<T>(data: T) {
    return {
      code: NetResultCode.Success,
      msg: '成功',
      success: true,
      data: data,
    };
  }
  error<T>(data: T) {
    return {
      code: NetResultCode.Fail,
      msg: '失败',
      success: false,
      data: data,
    };
  }

  errorTimeout<T>(data: T) {
    return {
      code: NetResultCode.Timeout,
      msg: '超时',
      success: false,
      data: null,
    };
  }

  private _request<T>(parameter: RequestParameter) {
    let { url, headers, timeout, method, data, retry } = parameter;
    let _timeout = typeof timeout === 'undefined' ? TIME_OUT : timeout;
    let _headers = typeof headers === 'undefined' ? {} : headers;
    let _method = typeof method === 'undefined' ? Methods.T1 : method;
    let _retryCount = typeof retry === 'undefined' ? 0 : retry;

    const configData: any = {
      url,
      timeout: _timeout,
      headers: _headers,
      retry: _retryCount,
    };

    switch (_method) {
      case Methods.T0:
        configData.method = Methods.T0;
        configData.params = data;
        break;
      case Methods.T1:
        configData.method = 'post';
        if (data instanceof FormData) {
          configData.headers['Content-Type'] =
            'multipart/form-data; charset=UTF-8';
          configData.data = data;
        } else {
          configData.headers['Content-Type'] =
            'application/x-www-form-urlencoded; charset=UTF-8';
          configData.data = qs.stringify(data);
        }
        break;
      default:
        configData.method = 'post';
        configData.headers['Content-Type'] = 'application/json; charset=UTF-8';
        configData.data = data;
    }
    return new Promise<NetResultData<T | null>>((resolve, reject) => {
      instance(configData)
        .then((result: any) => {
          if (result.data.code === ServerCode.Success) {
            resolve(this.success(result.data.data));
          } else {
            resolve(this.error(result));
          }
        })
        .catch((error) => {
          const { message } = error;
          try {
            if (message.includes('timeout')) {
              resolve(this.errorTimeout(null));
            } else {
              resolve(this.error(error));
            }
          } catch (e) {
            resolve(this.error(error));
          }
        });
    });
  }

  get<T>(data: RequestParameter) {
    data.method = Methods.T0;
    return this._request<T>(data);
  }

  postForm<T>(data: RequestParameter) {
    data.method = Methods.T1;
    return this._request<T>(data);
  }

  post<T>(data: RequestParameter) {
    data.method = Methods.T2;
    return this._request<T>(data);
  }
}

export default new Request();
