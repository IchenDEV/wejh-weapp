import logger from "./logger";
import dayjs from "../libs/dayjs/dayjs.min.js";
import dayjs_customParseFormat from "../libs/dayjs/plugin/customParseFormat.js";

dayjs.extend(dayjs_customParseFormat);

export function reportUserInfo(userInfo) {
  try {
    console.log(userInfo)
    const lastUpdate = dayjs(userInfo.updated_at, "YYYY-MM-DD hh:mm:ss");
    if (!lastUpdate.isValid()) {
      throw "`update_at` is invalid";
    }
    const daysDiff = dayjs().diff(lastUpdate, "day");

    const grade = userInfo.uno.substring(0, 4);

    const info = wx.getStorageInfoSync() || {};
    const {
      currentSize,
      limitSize
    } = info;

    wx.reportAnalytics("user_login", {
      uno: userInfo.uno,
      grade: grade,
      timetable_term: userInfo.ext.terms.class_term,
      exam_term: userInfo.ext.terms.exam_term,
      score_term: userInfo.ext.terms.score_term,
      card_bind: userInfo.ext.passwords_bind.card_password,
      lib_bind: userInfo.ext.passwords_bind.lib_password,
      yc_bind: userInfo.ext.passwords_bind.yc_password,
      zf_bind: userInfo.ext.passwords_bind.zf_password,
      jh_bind: userInfo.ext.passwords_bind.jh_password,
      last_update: Math.floor(daysDiff),
      storage_free: limitSize - currentSize,
      version: version,
    });
  } catch (err) {
    logger.error("app", "登录埋点上报异常", err);
  }
}