import { API } from "../api";
import util from "../util";
function getCard(callback = function () {}, options) {
  this.$fetch({
    url: API("card"),
    showError: true,
    ...options,
    success: (res) => {
      const data = res.data.data;
      const fixedData = util.fixCard(data);
      this.$store.setState("session", {
        card: fixedData,
        cardCost: util.fixCardCost(fixedData),
      });
      callback && callback(res);
    },
  });
}
export { getCard };
