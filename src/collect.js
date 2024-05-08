import {upload} from './upload';
import qs from 'qs';

let beforeCreateParams, beforeUploadParams;
// 上报日志前
let beforeUpload;
// 上报日志后
let afterUpload;
// 异常处理
let onError = function (err) {
  console.log('err-catch', err);
};
export function registerBeforeCreateParams(fn) {
  beforeCreateParams = fn;
}
export function registerBeforeUploadParams(fn) {
  beforeUpload = fn;
}
export function registerAfterUploadParams(fn) {
  afterUpload = fn;
}

// 采集报错信息
function collect(customData, eventType) {
  // 1 采集页面基本信息
  //   a 应用id（meta中的imooc-app-id）
  //   b pageid（body中imooc-page-id）
  let appId, pageId, timestamp, ua, url;
  beforeCreateParams && beforeCreateParams();
  const metas = document.querySelectorAll('meta');
  [...metas].forEach((meta) => {
    if (meta.getAttribute('imooc-app-id')) {
      appId = meta.getAttribute('imooc-app-id');
    }
  });
  pageId = document.body.getAttribute('imooc-page-id');
  if (!appId || !pageId) return false;
  // 2 日志上报信息收集
  //   a：应用id和页面id
  //   b：访问时间
  //   c：ua
  //   d: currentUrl
  timestamp = Date.now();
  ua = window.navigator.userAgent;
  let params = {
    appId,
    pageId,
    timestamp,
    ua,
    url: window.location.href
  };
  params = Object.assign(params, customData);
  if (beforeUpload) {
    beforeUpload(params);
  }
  const data = qs.stringify(params);
  console.log(data, 'data---');
  // 3 调用日志上报API
  let resUrl, uploadData;
  try {
    const res = upload(data, {eventType});
    resUrl = res.url;
    uploadData = res.data;
  } catch (e) {
    onError(e);
  } finally {
    if (afterUpload) {
      afterUpload(resUrl, uploadData);
    }
  }
}
// 发送PV日志
export const sendPV = () => {
  collect({}, 'PV');
};
// 上报曝光埋点
export function sendExp(data, options = {}) {
  collect(data, 'EXP');
}
// 上报点击埋点
export function sendClick(data={}) {
  collect(data, 'CLICK')
}
// 上传自定义埋点
export function sendCustom(data = {}) {
  collect(data, 'CUSTOM');
}

export function collectAppear() {
  const appearEvent = new CustomEvent('appearEvent');
  const disAppearEvent = new CustomEvent('disAppearEvent');
  let ob;
  if (window.imoocCliMonitorObserver) {
    ob = window.imoocCliMonitorObserver;
  } else {
    ob = new IntersectionObserver(function (entrys) {
      entrys.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
          console.log(entry.target.className, 'appear');
          entry.target.dispatchEvent(appearEvent);
        } else {
          entry.target.dispatchEvent(disAppearEvent);
        }
      });
    });
      window.imoocCliMonitorObserver = ob;
  }
  let obList = [];
  const appearNodes = document.querySelectorAll('[appear]');
  [...appearNodes].forEach((node) => {
    if (!obList.includes(node)) {
      ob.observe(node);
      obList.push(node);
    } 
  });
}
