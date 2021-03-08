import { API } from "../api";
import logger from "../logger";
import util from "../util";
import dayjs from "../../libs/dayjs/dayjs.min.js";
import termUtil from "../termPicker";

function getScoreDetail(termInfo, callback = function () {}, options) {
  // cache_key: cache_scoreDetail_termYear_semester (scoreDetail_2020_1)
  this.$fetch({
    url: API("scoreDetail"),
    showError: true,
    data: {
      term_year: termInfo.year || "",
      term_semester: termInfo.semester || "",
    },
    ...options,
    success: (res) => {
      let scoreDetail = res.data.data;

      scoreDetail = {
        ...scoreDetail,
        lastUpdated: dayjs().unix(),
        isDetail: true,
      };

      this.$store.setState("session", {
        score: scoreDetail,
      });

      // 写 cache
      const termInfo = termUtil.getInfoFromTerm(scoreDetail.term);
      if (termInfo.year && termInfo.semester) {
        const cacheKey = `cache_scoreDetail_${termInfo.year}_${termInfo.semester}`;
        logger.info("service", "写入 cache 'scoreDetail', key: ", cacheKey);
        this.$store.setState("common", {
          [cacheKey]: scoreDetail,
        });
      }
      callback && callback(res);
    },
    fail: (res) => {
      // 请求失败时返回 cache
      if (termInfo.year && termInfo.semester) {
        const cacheKey = `cache_scoreDetail_${termInfo.year}_${termInfo.semester}`;
        logger.info("service", "读出 cache 'scoreDetail', key: ", cacheKey);

        let cachedScoreDetail = this.$store.getState("common", cacheKey);
        if (cachedScoreDetail) {
          // 上个版本写入 cache 的数据没有 isDetail 字段, 需要添加进去
          cachedScoreDetail = {
            ...cachedScoreDetail,
            isDetail: true,
          };
          this.$store.setState("session", {
            score: cachedScoreDetail,
          });
        }
      }
      callback && callback(res);
    },
  });
}
function changeScoreTerm(targetTerm, callback = function () {}, options) {
  this.$fetch({
    url: API("score"),
    method: "PUT",
    showError: true,
    ...options,
    data: {
      term: targetTerm,
    },
    success: (res) => {
      callback && callback(res);
    },
  });
}

function getScore(termInfo, callback = function () {}, options) {
  /*
      cache_key: cache_score_termYear_semester (score_2020_1)
      cache: {
        last_updated: unix_stamp
        ...payload
      }
      */
  this.$fetch({
    url: API("score"),
    showError: true,
    data: {
      term_year: termInfo.year || "",
      term_semester: termInfo.semester || "",
    },
    ...options,
    success: (res) => {
      const data = res.data.data;

      let scoreData = util.fixScore(data);
      const sortedList = Array.from(scoreData.list).sort((a, b) => {
        return b["真实成绩"] - a["真实成绩"];
      });

      scoreData = {
        ...scoreData,
        sortedList,
        lastUpdated: dayjs().unix(),
        isDetail: false,
      };

      this.$store.setState("session", {
        score: scoreData,
      });

      // 写 cache, 使用响应返回的学期生成 cache key
      const termInfo = termUtil.getInfoFromTerm(scoreData.term);
      if (termInfo.year && termInfo.semester) {
        const cacheKey = `cache_score_${termInfo.year}_${termInfo.semester}`;
        logger.info("service", "写入 cache 'score', key: ", cacheKey);
        this.$store.setState("common", {
          [cacheKey]: scoreData,
        });
      }

      callback && callback(res);
    },
    fail: (res) => {
      // 请求失败时返回 cache
      if (termInfo.year && termInfo.semester) {
        const cacheKey = `cache_score_${termInfo.year}_${termInfo.semester}`;
        logger.info("service", "读出 cache 'score', key: ", cacheKey);

        let cachedScore = this.$store.getState("common", cacheKey);
        if (cachedScore) {
          // 上个版本写入 cache 的数据没有 isDetail key, 需要添加进去
          cachedScore = {
            ...cachedScore,
            isDetail: false,
          };
          this.$store.setState("session", {
            score: cachedScore,
          });
        }
      }
      callback && callback(res);
    },
  });
}

export { getScoreDetail, changeScoreTerm, getScore };
