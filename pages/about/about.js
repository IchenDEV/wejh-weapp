import toast from "../../utils/toast";
import dayjs from "../../libs/dayjs/dayjs.min.js";
import Store2 from "../../utils/store2";
const app = getApp();

Page({
  data: {
    name: app.name,
    versionType: app.versionType,
    version: app.version,
    commitHash: app.env("commitHash"),
    currentYear: dayjs().format("YYYY"),
    headerTapCount: 0,
    isShowCommitHash: false,
    // observed keys
    devMenuEnabled: false,
  },
  onLoad() {
    app.$store2.connect(this,true)
    app.$store2.bind(this,"devMenuEnabled");
  },
  onUnload() {
    app.$store2.disconnect(this);
  },
  onShow() {
    this.data.headerTapCount = 0;
  },
  headerTap() {
    this.data.headerTapCount += 1;
    if (this.data.headerTapCount === 5) {
      if (!this.data.devMenuEnabled) {
        app.$store2.setState( {
          devMenuEnabled: true,
        });
        this.setPageState( {
          isShowCommitHash: true,
        });
        this.data.headerTapCount = 0;
      }
      toast({
        icon: "success",
        title: "调试彩蛋已打开",
      });
    }
  },
  toggleShowCommitHash() {
    this.data.isShowCommitHash = !this.data.isShowCommitHash;
  },
});
