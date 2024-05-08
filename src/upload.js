export const upload = (data, options = {}) => {
  const {eventType='PV' } = options;
  // 利用图片的跨域进行采集信息的上报
  let img = new Image();
  let src =
    'https://imooc.com?data=' +
    encodeURIComponent(data) +
    'eventType=' +
    eventType;
  img.src = src;
  img = null;
  return {
    data: data,
    url: src,
  }
};