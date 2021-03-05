import { Observer } from "./index.js";
import Watcher from "./watcher.js";
export function Refing(obj, cb) {
  new Observer(obj);
  new Watcher(obj, cb, (obj) => {
    Object.keys(obj).map((k) => {
      return obj[k];
    });
    return obj
  });
  return obj
}
