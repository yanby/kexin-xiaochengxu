import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()



Page({
  data: {
    plotCrop: {},
    infos: [],//事件列表
    kxCote: "",
    key: "",
    page: 1
  },
  onLoad(query) {
    this.setData({
      kxCote: query.id,
      key: query.key,
    })
    this.init();
  },
  init() {
    request('/inductor/getDeviceInfoByKey', 'post', {
      token: wx.getStorageSync("token"),
      kxCote: this.data.kxCote,
      key: this.data.key,
      page: this.data.page,
      limit: 10
    }).then(res => {
      console.log(res)
      this.setData({
        infos: res.objs.infos.list
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
    this.data.page++;
    this.setData({
      page: this.data.page
    })
    request('/inductor/getDeviceInfoByKey', 'post', {
      token: wx.getStorageSync("token"),
      kxCote: this.data.kxCote,
      key: this.data.key,
      page: this.data.page,
      limit: 10
    }).then(res => {
      console.log(res)
      if (this.data.page > res.objs.infos.pages){
        wx.showToast({
          title: '没有更多数据了',
          icon: 'none'
        })
      }else{
        let arr = this.data.infos.concat(res.objs.infos.list)
        this.setData({
          infos: arr
        })
      }
    })
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
