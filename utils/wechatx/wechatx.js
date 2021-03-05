import { Observer } from "./index.js";
import Watcher from "./watcher.js";
export function Refing(obj, cb) {
  new Observer(obj);
  new Watcher(obj, cb, (obj) => {
    Object.keys(obj).forEach((k) => {
      let t = obj[k];
    });
    return obj;
  });
}
