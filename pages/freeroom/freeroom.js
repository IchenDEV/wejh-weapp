const app = getApp();
Page({
  data: {
    form: {
      area: "01",
      weekday: 1,
      week: 1,
      startTime: 1,
      endTime: 1
    }

  },
  onLoad: function () {
    app.$store.connect(this, "freeroom");
    this.observe("session", "isLoggedIn");
    this.observe("session", "userInfo");
    this.observe("session", "time");
    this.observe("session", "freeroom");
    this.observe("session", "unclearedBadges");
  },
  onUnload() {
    this.disconnect();
  },
  getFreeRoom(callback = this.afterGetFreeRoom) {
    wx.showLoading({
      title: "获取空教室中",
    });
    app.services.getFreeRoom(callback, {
      showError: true,
      data: this.data.form,
    });
  },
  afterGetFreeRoom() {
    wx.hideLoading();
  },
  roomTimeChange: function (e) {
    const {
      info
    } = e.detail;
    app.$store.setState("session","form",info)
    this.setPageState({
        form: info,
      },
      () => {
        this.getFreeRoom();
      }
    );
  },
  toggleRefresh: function () {
    this.getFreeRoom();
  }
});