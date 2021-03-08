const app = getApp();
const userInfoStore = {
  userInfoStore(store, fetch) {
    function updateUserInfo() {}
    function setUserInfo(userInfo) {
      store.setState("common", "userInfo", userInfo);
    }
    function getUserInfo() {
      return store.getState("common", "userInfo");
    }
  },

  bindView(view, localkey) {
    if (!view.observe) app.$store.connect(view, "home");
    view.observe("session", "userInfo", localkey);
  },
};

export default userInfoStore;
