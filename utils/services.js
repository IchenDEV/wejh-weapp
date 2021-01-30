import { API } from "./api";
import util from "./util";

export default function ({ store, fetch }) {
  const updateLoggedInState = () => {
    if (
      store.getState("session", "token") &&
      store.getState("session", "time")
    ) {
      store.setState("session", { isLoggedIn: true });
    }
  };
  return {
    autoLogin(callback = function () {}, options) {
      fetch({
        url: API("autoLogin"),
        method: "POST",
        showError: true,
        ...options,
        success: (res) => {
          const result = res.data;
          if (result.errcode > 0) {
            const { token, user: userInfo } = result.data;
            store.setState("session", {
              token: token,
              userInfo: userInfo,
            });
            updateLoggedInState();
            callback && callback(res);
          }
        },
      });
    },
    getOpenId(callback = function () {}, options) {
      fetch({
        url: API("code"),
        method: "POST",
        showError: true,
        ...options,
        success: (res) => {
          const result = res.data;
          const openId = result.data.openid;
          store.setState("common", {
            openId,
          });
          callback && callback(res);
        },
      });
    },
    getBootstrapInfo(callback = function () {}, options) {
      fetch({
        url: API("bootstrap"),
        showError: true,
        ...options,
        success(res) {
          let data = res.data.data;
          store.setState("session", {
            apps: util.fixAppList(data.appList["app-list"]),
            icons: util.fixIcons(data.appList.icons),
            announcement: data.announcement,
            badges: data.badges,
            time: data.termTime,
          });
          updateLoggedInState();
          callback && callback(res);
        },
      });
    },
    getAppList(callback = function () {}, options) {
      fetch({
        url: API("app-list"),
        showError: true,
        ...options,
        success(res) {
          let data = res.data.data;
          store.setState("session", {
            apps: util.fixAppList(data["app-list"]),
            icons: util.fixIcons(data["icons"]),
          });
          callback && callback(res);
        },
      });
    },
    getTermTime: (callback = function () {}, options) => {
      fetch({
        url: API("time"),
        showError: true,
        ...options,
        success: (res) => {
          const result = res.data;
          store.setState("session", {
            time: result.data,
          });
          callback && callback(res);
        },
      });
    },
    getUserInfo: (callback = function () {}, options) => {
      fetch({
        url: API("user"),
        showError: true,
        ...options,
        success: (res) => {
          const result = res.data;
          const userInfo = result.data;
          store.setState("session", {
            userInfo,
          });
          callback && callback(res);
        },
      });
    },
    getTimetable(callback = function () {}, options) {
      fetch({
        url: API("timetable"),
        showError: true,
        ...options,
        success(res) {
          const cacheStatus = store.getState("session", "cacheStatus") || {};
          cacheStatus.timetable = false;

          let data = res.data.data;
          const fixData = util.fixTimetable(data);
          const cache = {
            cacheStatus,
            timetable: data,
            timetableFixed: fixData,
          };
          store.setState("session", {
            ...cache,
          });
          store.setState("common", {
            cache,
          });
          callback && callback(res);
        },
        fail(res) {
          // 使用离线课表
          const cacheStatus = store.getState("session", "cacheStatus") || {};
          const cache = store.getState("common", "cache") || {};
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
            store.setState("session", {
              cacheStatus,
              ...cacheState,
            });
            callback && callback(res);
          }
        },
      });
    },
    getScore(callback = function () {}, options) {
      fetch({
        url: API("score"),
        showError: true,
        ...options,
        success(res) {
          const data = res.data.data;
          const fixedData = util.fixScore(data);
          const sortedData = Array.from(fixedData.list).sort((a, b) => {
            return b["真实成绩"] - a["真实成绩"];
          });
          store.setState("session", {
            score: fixedData,
            sortedScoreList: sortedData,
          });
          callback && callback(res);
        },
      });
    },
    getScoreDetail(callback = function () {}, options) {
      fetch({
        url: API("scoreDetail"),
        showError: true,
        ...options,
        success(res) {
          const data = res.data.data;
          store.setState("session", {
            scoreDetail: data,
          });
          callback && callback(res);
        },
      });
    },
    getExam(callback = function () {}, options) {
      fetch({
        url: API("exam"),
        showError: true,
        ...options,
        success(res) {
          const data = res.data.data;
          store.setState("session", {
            exam: util.fixExam(data),
          });
          callback && callback(res);
        },
      });
    },
    getFreeRoom(callback = function () {}, options) {
      fetch({
        url: API("freeroom"),
        showError: true,
        ...options,
        success(res) {
          const data = res.data.data;
          store.setState("session", {
            originalFreeroomData: data,
            freeroom: util.fixFreeroom(data),
          });
          callback && callback(res);
        },
      });
    },
    getCard(callback = function () {}, options) {
      fetch({
        url: API("card"),
        showError: true,
        ...options,
        success(res) {
          const data = res.data.data;
          const fixedData = util.fixCard(data);
          store.setState("session", {
            card: fixedData,
            cardCost: util.fixCardCost(fixedData),
          });
          callback && callback(res);
        },
      });
    },
    getBorrow(callback = function () {}, options) {
      fetch({
        url: API("borrow"),
        showError: true,
        ...options,
        success(res) {
          const data = res.data.data;
          store.setState("session", {
            borrow: data,
          });
          callback && callback(res);
        },
      });
    },
    getTeacher(callback = function () {}, options) {
      fetch({
        url: API("teacher"),
        showError: true,
        ...options,
        success(res) {
          const data = res.data.data;
          store.setState("session", {
            teacher: util.fixTeacher(data),
          });
          callback && callback(res);
        },
      });
    },
    changeTimetableTerm(targetTerm, callback = function () {}, options) {
      fetch({
        url: API("timetable"),
        method: "PUT",
        showError: true,
        ...options,
        data: {
          term: targetTerm,
        },
        success(res) {
          callback && callback(res);
        },
      });
    },
    changeScoreTerm(targetTerm, callback = function () {}, options) {
      fetch({
        url: API("score"),
        method: "PUT",
        showError: true,
        ...options,
        data: {
          term: targetTerm,
        },
        success(res) {
          callback && callback(res);
        },
      });
    },
    changeExamTerm(targetTerm, callback = function () {}, options) {
      fetch({
        url: API("exam"),
        method: "PUT",
        showError: true,
        ...options,
        data: {
          term: targetTerm,
        },
        success(res) {
          callback && callback(res);
        },
      });
    },
    getAnnouncement(callback = function () {}, options) {
      fetch({
        url: API("announcement"),
        method: "GET",
        showError: true,
        ...options,
        success(res) {
          const data = res.data.data;
          store.setState("session", {
            announcement: data,
          });
          callback && callback(res);
        },
      });
    },
  };
}
