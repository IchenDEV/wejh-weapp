import { API } from "../api";
function auth(callback = function () {}, options) {
  this.$fetch({
    url: API("code"),
    method: "POST",
    showError: true,
    ...options,
    success: (res) => {
      const result = res.data;
      if (result.errcode > 0) {
        const { token, user: userInfo } = result.data;
        this.$store.setState("session", {
          token: token,
          userInfo: userInfo,
        });
        this.updateLoggedInState();
        callback && callback(res);
      }
    },
  });
}

export { auth };
