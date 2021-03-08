import { auth } from "./auth";
import { getTimetable, changeTimetableTerm } from "./timetable";
import { getScoreDetail, changeScoreTerm, getScore } from "./score";
import { getUserInfo } from "./userInfo";
import { getExam, changeExamTerm } from "./exam";
import { getAnnouncement } from "./announcement";
import { getCard } from "./card";
import { getBorrow } from "./library";
import { getFreeRoom } from "./freeroom";
import { getAppList, getBootstrapInfo, getTermTime } from "./app";
export default function ({ store, fetch }) {
  const updateLoggedInState = () => {
    if (
      store.getState("session", "token") &&
      store.getState("session", "time")
    ) {
      store.setState("session", { isLoggedIn: true });
    }
  };
  return {
    $store: store,
    $fetch: fetch,
    updateLoggedInState,
    auth,
    getTimetable,
    changeTimetableTerm,
    getScoreDetail,
    getScore,
    changeScoreTerm,
    getUserInfo,
    getExam,
    changeExamTerm,
    getAnnouncement,
    getCard,
    getBorrow,
    getAppList,
    getBootstrapInfo,
    getFreeRoom,
    getTermTime,
  };
}
