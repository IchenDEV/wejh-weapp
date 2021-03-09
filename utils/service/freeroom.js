import { API } from "../api";
import util from "../util";
function getFreeRoom(callback = function () {}, options) {
  this.$fetch({
    url: API("freeroom"),
    showError: true,
    ...options,
    success: (res) => {
      const data = res.data.data;
      this.$store2.setState( 
        'freeroom', util.fixFreeroom(data),
      );
      callback && callback(res);
    },
  });
}
export { getFreeRoom };
