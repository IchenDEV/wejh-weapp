const campus = ["朝晖", "屏峰", "莫干山"];
const weekday = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
Component({
  properties: {
    currentData: {
      type: Object,
      value: {
        info: null,
      },
      observer: function (newVal, oldVal) {
        const value=[]
        value[0]=parseInt(newVal.area)-1
        value[1]=newVal.week-1
        value[2]=newVal.weekday-1
        value[3]=newVal.startTime-1
        value[4]=newVal.endTime-1
        console.log(value)
        this.setData({
         value:value
        });
      },
    },
  },
  data: {
    range: [],
    value: [],
    currentStr: ""
  },
  lifetimes: {
    attached() {
      this.setData({
        ...this.data.placeHolder,
      });
      this.genPickerRange()
    },
  },
  methods: {
    // 为学期选择器生成 range 数据
    genPickerRange() {
      let fromLesson = []
      let toLesson = []
      let week = []
      for (let i = 1; i <= 12; i++) {
        fromLesson.push(`从${i}节`);
      }
      for (let i = 1; i <= 12; i++) {
        toLesson.push(`到${i}节`);
      }
      for (let i = 1; i <= 20; i++) {
        week.push(`第${i}周`);
      }
      this.setData({
        range: [campus, week, weekday, fromLesson, toLesson, ],
      })
    },
    // 学期改变，e 为从 picker 传入的数据
    onPickerChange(e) {
      const {
        value
      } = e.detail;
      const range = this.data.range;
      if (range.length === 0 || value.length < 2) {
        return;
      }
      const info = {
        area: '0' + (value[0] + 1),
        startTime: value[3],
        endTime: value[4],
        weekday: value[2] + 1,
        week: value[1] + 1
      };
      // 传出数据
      let str = ""
      range.forEach((v, i) => {
        str += v[value[i]] + " "
      })
      this.setData({
        currentStr: str
      })
      this.triggerEvent("roomTimeChange", {
        info: info,
      });
    },
  },
});