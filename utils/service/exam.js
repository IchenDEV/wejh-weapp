import { API } from "../api";
import logger from "../logger";
import util from "../util";
import dayjs from "../../libs/dayjs/dayjs.min.js";
import termUtil from "../termPicker";
function getExam(termInfo, callback = function () {}, options) {
  this.$fetch({
    url: API("exam"),
    showError: true,
    data: {
      term_year: termInfo.year || "",
      term_semester: termInfo.semester || "",
    },
    ...options,
    success: (res) => {
      let exam = res.data.data;
      exam = {
        ...util.fixExam(exam),
        lastUpdated: dayjs().unix(),
      };

      this.$store.setState("session", {
        exam,
      });

      // 写 cache
      const termInfo = termUtil.getInfoFromTerm(exam.term);
      if (termInfo.year && termInfo.semester) {
        const cacheKey = `cache_exam_${termInfo.year}_${termInfo.semester}`;
        logger.info("service", "写入 cache 'exam', key: ", cacheKey);
        this.$store.setState("common", {
          [cacheKey]: exam,
        });
      }
      callback && callback(res);
    },
    fail: (res) => {
      // 请求失败时返回 cache
      if (termInfo.year && termInfo.semester) {
        const cacheKey = `cache_exam_${termInfo.year}_${termInfo.semester}`;
        logger.info("service", "读出 cache 'exam', key: ", cacheKey);

        let cachedExam = this.$store.getState("common", cacheKey);
        if (cachedExam) {
          this.$store.setState("session", {
            exam: cachedExam,
          });
        }
      }
      callback && callback(res);
    },
  });
}
function changeExamTerm(targetTerm, callback = function () {}, options) {
  this.$fetch({
    url: API("exam"),
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
export { getExam, changeExamTerm };
