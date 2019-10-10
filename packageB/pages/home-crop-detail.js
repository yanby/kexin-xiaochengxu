import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()



Page({
  data: {
    plotCrop: {},
    timerShaft: [],//事件列表
    kxBatchId: ""
  },
  onLoad(query) {
    this.setData({
      kxBatchId: query.id
    })
    this.init();
  },
  init() {
    request('/farm/getBatchWorkInfo', 'post', {
      token: wx.getStorageSync("token"),
      kxBatchId: this.data.kxBatchId
    }).then(res => {
      console.log(res)
      this.setData({
        plotCrop: res.objs.kxBatch,
        timerShaft: res.objs.batchMaps
      })
    })
  },
  imgYu(e) {
    console.log(e)
    var src = e.currentTarget.dataset.src;//获取data-src
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
});
