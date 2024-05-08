import {
  sendPV,
  sendExp,
  sendClick,
  collectAppear,
  registerBeforeCreateParams,
  registerBeforeUploadParams,
  registerAfterUploadParams,
} from './collect';
import {upload } from './upload';

window.onload = () => {
  // 启动dom是否可见的监听
  collectAppear();
}
// sendPV();
window.ImoocCliMonitor = {
  upload,
  sendPV,
  sendExp,
  sendClick,
  collectAppear,
  registerBeforeCreateParams,
  registerBeforeUploadParams,
  registerAfterUploadParams,
};
