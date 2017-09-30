import util from '../../utils/util'

const initAppList = []
const initApp = {
  title: '加载中',
  disabled: true,
  icon: '/images/app-list/red.png'
}
for (let i = 0; i < 10; i++) {
  initAppList.push(initApp)
}

const app = getApp()
Page({
  data: {
    tinyTip: {
      active: false,
      content: '请先登录'
    },
    apps: initAppList
  },
  onLoad: function (options) {
    app.$store.connect(this, 'index')
    this.observeCommon('userInfo')
    this.observeCommon('apps')
    this.observeCommon('icons')
    this.getData()
    app.set('preview', options.preview)
  },
  getData() {
    if (app.isLogin()) {
      this.getTimetable()
    }
  },
  onPullDownRefresh () {
    this.getData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },
  getTimetable() {
    app.services.getTimetable()
  },
  showTip(content, duration = 1500) {
    this.setState({
      tinyTip: {
        active: true,
        content: content
      }
    })

    setTimeout(() => {
      this.hideTip()
    }, duration)
  },
  hideTip() {
    this.setState({
      tinyTip: {
        active: false,
        content: ''
      }
    })
  },
  onClickApp(e) {
    const commonData = app.$store.getCommonState()
    const isLogin = !!commonData['token']
    const target = e.currentTarget
    const index = target.dataset.index
    const appItem = this.data.apps[index]
    if(!isLogin) {
      return this.showTip('请先登录')
    }
    if(appItem.disabled) {
      return this.showTip('服务暂不可用')
    }
    wx.navigateTo({
      url: appItem.route
    })
  }
})
