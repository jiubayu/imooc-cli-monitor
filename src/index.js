import {
  sendPV,
  sendExp,
  sendClick,
  sendStayTime,
  sendPerf,
  collectAppear,
  registerBeforeCreateParams,
  registerBeforeUploadParams,
  registerAfterUploadParams,
} from './collect';
import {upload} from './upload';

window.addEventListener('load', function () {
  // 启动dom是否可见的监听
  collectAppear();
  window.__ImoocMonitor_ENTER_TIME = new Date().getTime();
});
// 全局监听点击事件
!window.__disableClickMonitor &&
  window.addEventListener('click', function (e) {
    const {className} = e.target;
    if (className) {
      sendClick({target: className}, e);
    }
  });
// 自动监听停留时长
window.addEventListener('beforeunload', (e) => {
  window.__ImoocMonitor_LEAVE_TIME = new Date().getTime();
  const stayTime =
    window.__ImoocMonitor_LEAVE_TIME - window.__ImoocMonitor_ENTER_TIME;
  if (stayTime) {
    sendStayTime({stayTime});
  }
});

let fp = 0; // first-paint
let fcp = 0; // first-contentful-paint
let lcp = 0; // largest-contenful-paint
const observer = new PerformanceObserver(callback);
observer.observe({
  entryTypes: ['paint', 'largest-contentful-paint'],
});
function callback(perf) {
  perf.getEntries().forEach((timing) => {
    if (timing.name === 'first-paint') {
      fp = timing.startTime;
    } else if (timing.name === 'first-contentful-paint') {
      fcp = timing.startTime;
    } else if (timing.entryType === 'largest-contentful-paint') {
      lcp = timing.startTime;
    }
    sendPerf({
      fp,
      fcp,
      lcp,
    });
    // console.log(fp, 'fp------');
    // console.log(fcp, 'fcp------');
    // console.log(lcp, 'lcp------');
    // if (timing.entryType === 'navigation') {
    //   const dns = timing.domainLookupEnd - timing.domainLookupStart;
    //   const tcp = timing.connectEnd - timing.connectStart;
    //   const http = timing.responseStart - timing.requestStart;
    //   const dom = timing.domComplete - timing.domInteractive;
    //   const load = timing.loadEventEnd - timing.loadEventStart;
    //   console.log(dns, 'dns------');
    //   console.log(tcp, 'tcp------');
    //   console.log(http, 'http------');
    //   console.log(dom, 'dom------');
    //   console.log(load, 'load------');
    // }
  });
}

window.ImoocCliMonitor = {
  upload,
  sendPV,
  sendExp,
  sendClick,
  sendPerf,
  collectAppear,
  registerBeforeCreateParams,
  registerBeforeUploadParams,
  registerAfterUploadParams,
};
