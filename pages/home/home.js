import { bind } from "./viewmodel";
import userInfoStore from "../../utils/store/userInfoStore";
import { weekday } from "../../const/const";
const app = getApp();

const followUs = () => {
  wx.setClipboardData({
    data: "zjutjh",
    success() {
      wx.showModal({
        title: "提示",
        icon: "success",
        showCancel: false,
        content: "复制成功，粘贴至微信搜索栏关注我们",
      });
    },
  });
};
Page({
  data: {
    weekday,
    devMenuEnabled: false,
  },
  onLoad() {
    bind(this);
    userInfoStore.bindView(this, "userInfo");
  },
  onShow() {
    app.badgeManager.updateBadgeForTabBar();
  },
  onUnload() {
    this.disconnect();
  },
  followUs,
  userBlockClick() {
    if (!this.data.userInfo) {
      return wx.navigateTo({
        url: "/pages/login/login",
      });
    }
  },
});
