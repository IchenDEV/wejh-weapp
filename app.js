import WejhStore from "./utils/store";
import Fetch from "./utils/fetch";
import BadgeManager from "./utils/badgeManager";
import toast from "./utils/toast";
import Services from "./utils/service/index";
import logger from "./utils/logger";
import autoUpdate from "./utils/autoUpdate";
import envConfig from "./env";
import { reportUserInfo } from "./utils/reporter";
import Store2 from "./utils/store2"

const env = (key) => envConfig[key];

const version = "2.0";

let versionType = "release";
let versionTypeName = "Release";

const systemInfo = wx.getSystemInfoSync();

if (typeof __wxConfig === "object") {
  let envVersion = __wxConfig.envVersion;
  switch (envVersion) {
    case "develop":
      versionType = "develop";
      versionTypeName = "Dev";
      break;
    case "trial":
      versionType = "beta";
      versionTypeName = "Beta";
      break;
  }
}

const isDev = versionType === "develop" || versionType === "beta";

if (isDev) {
  logger.info("app", "当前运行环境: " + versionType);
  logger.info("app", systemInfo);
}

const store = new WejhStore({
  debug: isDev,
  fields: {
    session: {
      isPersistent: true,
    },
    // common 域用于存放可持久化的、来源于请求的数据
    common: {
      isPersistent: true,
    },
    // static 域用于存储可持久化的，非来源于请求的数据
    static: {
      isPersistent: true,
    },
  },
});

const fetch = Fetch({
  $store: store,
  isDev,
});
const store2 = new Store2()
const services = Services({ fetch, store ,store2});
const badgeManager = BadgeManager({
  store,
});

App({
  name: "微精弘",
  version,
  $store2:store2,
  versionType: versionTypeName,
  onLaunch: () => {
    autoUpdate();
    if (!store.getState("session", "isLoggedIn")) this.wxLogin(this.weJHLogin);
  },
  wxLogin(callback = this.weJHLogin) {
    wx.login({
      success: (res) => {
        if (!res.code) {
          toast({
            icon: "error",
            title: "获取用户登录态失败！" + res.errMsg,
          });
          return;
        }
        callback(res.code);
      },
    });
  },
  weJHLogin(code) {
    this.services.auth(
      (res) => {
        const { user: userInfo } = res.data.data;
        reportUserInfo(userInfo);
      },
      {
        data: {
          mode: "wechat",
          code: code,
        },
      }
    );
  },
  systemInfo,
  isDev: isDev,
  env,
  services,
  fetch,
  $store:store,
  badgeManager,
});
