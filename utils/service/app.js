import { API } from "../api";
import util from "../util";
function getBootstrapInfo(callback = function () {}, options) {
  this.$fetch({
    url: API("bootstrap"),
    showError: true,
    ...options,
    success: (res) => {
      let data = res.data.data;
      this.$store.setState("session", {
        apps: util.fixAppList(data.appList["app-list"]),
        icons: util.fixIcons(data.appList.icons),
        announcement: data.announcement,
        badges: data.badges,
        time: data.termTime,
      });
      this.updateLoggedInState();
      callback && callback(res);
    },
  });
}
function getAppList(callback = function () {}, options) {
  this.$fetch({
    url: API("app-list"),
    showError: true,
    ...options,
    success: (res) => {
      let data = res.data.data;
      this.$store.setState("session", {
        apps: util.fixAppList(data["app-list"]),
        icons: util.fixIcons(data["icons"]),
      });
      callback && callback(res);
    },
  });
}
function getTermTime(callback = function () {}, options) {
  this.$fetch({
    url: API("time"),
    showError: true,
    ...options,
    success: (res) => {
      const result = res.data;
      this.$store.setState("session", {
        time: result.data,
      });
      callback && callback(res);
    },
  });
}
export { getBootstrapInfo, getAppList, getTermTime };
