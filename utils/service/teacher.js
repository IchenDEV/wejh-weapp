import { API } from "../api";
import util from "../util";
function getTeacher(callback = function () {}, options) {
  this.$fetch({
    url: API("teacher"),
    showError: true,
    ...options,
    success: (res) => {
      const data = res.data.data;
      this.$store.setState("session", {
        teacher: util.fixTeacher(data),
      });
      callback && callback(res);
    },
  });
}
export { getTeacher };
