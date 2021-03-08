import { API } from "../api";
function getUserInfo(callback = function () {}, options) {
  this.$fetch({
    url: API("user"),
    showError: true,
    ...options,
    success: (res) => {
      const result = res.data;
      const userInfo = result.data;
      this.$store.setState("session", {
        userInfo,
      });
      callback && callback(res);
    },
  });
}
export { getUserInfo };
