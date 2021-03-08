import { API } from "../api";
function getAnnouncement(callback = function () {}, options) {
  this.$fetch({
    url: API("announcement"),
    method: "GET",
    showError: true,
    ...options,
    success: (res) => {
      const data = res.data.data;
      this.$store.setState("session", {
        announcement: data,
      });
      callback && callback(res);
    },
  });
}
export { getAnnouncement };
