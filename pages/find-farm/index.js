import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()

Page({
  data: {
    scrollList: [
      { name: "111" ,id:0},
      { name: "222" ,id:1},
      { name: "333" ,id:2},
    ],
    tabActive: 0,
  },
  onLoad(query) {
    
  },
  init() {
    request('/api/user/findCompleteUserInfo', 'get', {
      farmId: this.data.farmId
    }).then(res => {
      console.log(res)
      this.setData({
        dataList: res.data
      })

    })
  },
  activeFun(e){
    let id = e.target.dataset.id
    console.log(e)
    this.setData({
      tabActive: id
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
    return {title: 'My App', desc: 'My App description', path: 'pages/index/index'};
  },
});
