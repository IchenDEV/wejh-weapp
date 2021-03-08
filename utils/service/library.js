import { API } from "../api";
function getBorrow(callback = function () {}, options) {
  this.$fetch({
    url: API("borrow"),
    showError: true,
    ...options,
    success: (res) => {
      const data = res.data.data;
      this.$store.setState("session", {
        borrow: data,
      });
      callback && callback(res);
    },
  });
}
export { getBorrow };
