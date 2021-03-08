import { API } from "../api";
import util from "../util";
function getTimetable(callback = function () {}, options) {
  this.$fetch({
    url: API("timetable"),
    showError: true,
    ...options,
    success: (res) => {
      const cacheStatus = this.$store.getState("session", "cacheStatus") || {};
      cacheStatus.timetable = false;

      let data = res.data.data;
      const fixData = util.fixTimetable(data);
      const cache = {
        cacheStatus,
        timetable: data,
        timetableFixed: fixData,
      };
      this.$store.setState("session", {
        ...cache,
      });
      this.$store.setState("common", {
        cache,
      });
      callback && callback(res);
    },
    fail: (res) => {
      // 使用离线课表
      const cacheStatus = this.$store.getState("session", "cacheStatus") || {};
      const cache = this.$store.getState("common", "cache") || {};
      const cacheState = {};
      if (cache.timetable) {
        cacheState.timetable = cache.timetable;
        if (cache.timetableFixed) {
          cacheState.timetableFixed = cache.timetableFixed;
          // cacheState.timetableToday = util.fixTimetableToday(
          //   cache.timetableFixed
          // );
        }
        cacheStatus.timetable = true;
        this.$store.setState("session", {
          cacheStatus,
          ...cacheState,
        });
        callback && callback(res);
      }
    },
  });
}

function changeTimetableTerm(targetTerm, callback = function () {}, options) {
  this.$fetch({
    url: API("timetable"),
    method: "PUT",
    showError: true,
    ...options,
    data: {
      term: targetTerm,
    },
    success: (res) => {
      callback && callback(res);
    },
  });
}
export { getTimetable, changeTimetableTerm };
