import WejhStore from "../utils/store";

const store=new WejhStore({
  
  fields: {
    // session 域用于存储不可持久化的数据
    session: {
      isPersistent: false,
    },
    // common 域用于存放可持久化的、来源于请求的数据
    common: {
      isPersistent: true,
    },
    // static 域用于存储可持久化的，非来源于请求的数据
    static: {
      isPersistent: true,
    },
  },
});
export default store;