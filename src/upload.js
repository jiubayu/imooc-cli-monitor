import {v4 as uuidv4} from 'uuid';

/**
 * 日志数据上报   event-type：PV、EXP、CLICK、CUSTOM
 * @param {*} data  上报参数
 * @param {*} options  附加属性
 * @param {*} isSendBeacon
 * @returns
 */
export const upload = (data, options = {}, isSendBeacon = false) => {
  const {eventType = 'PV'} = options;
  // 获取user_id和visitor_id
  let userId, visitorId;
  userId = window.localStorage.getItem('user_id');
  visitorId = window.localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = uuidv4();
    window.localStorage.setItem('visitor_id', visitorId);
  }
  if (!userId) {
    userId = visitorId;
  }
  const params =
    data +
    '&eventType=' +
    eventType +
    '&user_id=' +
    userId +
    '&visitor_id=' +
    visitorId;
  // 利用图片的跨域进行采集信息的上报
  let src = 'http://127.0.0.1:7001/monitor/upload?' + params;
  console.log("🚀 ~ upload ~ params:", params)
  if (!isSendBeacon) {
    let img = new Image();
    img.src = src;
    img = null; // 内存释放
  } else {
    window.navigator.sendBeacon(src);
  }
  return {
    data: data,
    url: src,
  };
};
