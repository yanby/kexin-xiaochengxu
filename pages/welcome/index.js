import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()


Page({
  data: {
    code: "",
    score: 1,
    bgBig: imgUrl + '/bg-big.png',
    imgUrl: {
      bgBig: imgUrl + '/bg-big.png',
      welcome: imgUrl + '/welcome-txt.png',
      logo: imgUrl + "/text1.png",
    }
  },
  onLoad(query) {
   
    // if (!wx.getStorageSync("token")) {
    //   wx.redirectTo({
    //     url: '/pages/getPhone/index'
    //   })
    // } else {
    //   routerLink()
    // }
  },
  goFun(){
    routerLink()
    // wx.navigateTo({
    //   url: "/pages/getPhone/index"
    // })
  },
 
  onReady() {
    // 页面加载完成
  },
  onShow() {
    
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
    return {title: 'My App', desc: 'My App description', path: 'pages/index/index'};
  },
});
