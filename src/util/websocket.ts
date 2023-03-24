// @ts-nocheck

import { getLocalStorage } from '@/util/storage';
import { Storage } from '@/type/storage';
import { WEBSOCKET_URL } from '@/config/constant';

export enum ChannelType {
  T1 = 'Achievement', // 成就系统
  T4 = 'Chatgpt', // Chatgpt
}

const noticeTypeMap = new Map([
  [1, ChannelType.T1],
  [4, ChannelType.T4],
]);

interface SubscribeData {
  channel: ChannelType;
}

const heartBeatTime = 30000; // 心跳检测时间

class RealSocket {
  ws: WebSocket | null = null; // ws实例
  isReady: boolean = false; // 是否准备好
  EventObj = {}; //事件对象
  SendMsgAry = []; //发送消息队列
  TaskInterval: NodeJS.Timer | null = null;
  PingPongTime = 0;

  constructor() {}

  private init() {
    this.ws = new WebSocket(WEBSOCKET_URL);
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onerror = this.onError.bind(this);
    this.ws.onclose = this.onClose.bind(this);
  }

  private onOpen() {
    this.TaskInterval = setInterval(() => {
      if (this.PingPongTime && Date.now() - this.PingPongTime > heartBeatTime) {
        this.isReady = false;
        clearInterval(this.TaskInterval);
        return this.retry();
      }
      this.ws.send(JSON.stringify({ ping: new Date().getTime() }));
    }, 30000);

    this.isReady = true;
  }

  private onMessage({ data }: { data: string }) {
    try {
      const json = JSON.parse(data);
      if (json) {
        //ping pong 逻辑处理
        if (json.ping) {
          this.ws.send(JSON.stringify({ pong: json.ping }));
          this.PingPongTime = Date.now();
          return;
        }
        if (json.pong) {
          this.PingPongTime = Date.now();
          return;
        }

        const { noticeType, noticeInfo } = json;
        const _event = noticeTypeMap.get(noticeType);
        if (!_event) return;
        if (!this.EventObj[_event]) return;
        this.EventObj[_event](noticeInfo);
      }
    } catch (e) {
      console.log('【catch websocket onmessage】%o', e);
    }
  }

  private onError() {
    this.destroy();
    this.retry();
  }

  private onClose() {
    console.log('关闭了');
  }

  private retry() {
    this.init();
  }

  destroy() {
    try {
      this.TaskInterval && clearInterval(this.TaskInterval);
      this.isReady = false;
      const _ws = this.ws;
      this.ws = null;
      _ws && _ws.close();
    } catch (e) {
      console.log('【catch websocket _destroy】%o', e);
    }
  }

  private send() {
    try {
      const msg = this.SendMsgAry.shift();
      if (!msg) return;
      this.ws.send(JSON.stringify(msg));
      this.send();
    } catch (e) {
      console.log('【catch websocket _send】%o', e);
    }
  }

  private emit() {
    if (this.isReady) return this.send();
    if (this.ws) return;
    this.init();
  }

  //添加频道
  addChannel = (message: SubscribeData, callback) => {
    this.EventObj[this.getMark(message)] = callback;
    this.emit();
  };

  //移除频道
  removeChannel = (message: SubscribeData) => {
    delete this.EventObj[this.getMark(message)];
    this.emit();
  };

  // 生成订阅标识
  private getMark(message: SubscribeData) {
    const { channel } = message;
    return channel;
  }
}

export default new RealSocket();
