import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()


Page({
  data: {
    farmId: "",
    active: "warm",
    groundlist: "",//地块列表
    name: "",
    area: "",
    items: [{ name: "暖棚", id: "warm" }, { name: "冷棚", id: "cold" }]
  },
  onLoad(query) {
    this.setData({
      farmId: query.farmId
    })
  },
  //点击tab切换
  tabFun(e){
    const id = e.target.dataset.id || e.currentTarget.dataset.id;
    this.setData({
      active: id
    })
  },
  bindblur(e) {
    let param = e.target.dataset.param
    if (param == "area") {
      this.setData({
        area: e.detail.value
      })
    } else if (param == "name") {
      this.setData({
        name: e.detail.value
      })
    }
  },
  btnFun(){
    var that = this;
    const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    if (!this.data.name) {
      wx.showToast({
        title: '请填写名称',
        icon: 'none'
      })
      return;
    } else if (!this.data.area) {
      wx.showToast({
        title: '请填写面积',
        icon: 'none'
      })
      return;
    } else if (!reg.test(this.data.area)) {
      wx.showToast({
        title: '地块面积最多保留两位小数',
        icon: 'none'
      })
      return
    } else {
      setTimeout(() => {
        request('/farm/addCote', 'post', {
          token: wx.getStorageSync("token"),
          kxFarm: that.data.farmId,
          type: that.data.active,
          name: that.data.name,
          area: that.data.area
        }).then(res => {
          console.log(res)
          wx.navigateBack({
            delta: 1 
          })
        })
      }, 500)
    }
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
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
  // 农场管理 / 切换农场
  changeFarm(e) {
    const type = e.target.dataset.type
    wx.navigateTo({
      url: '/pages/home-farm-lists/index?type=' + type
    })
  },
  // 完善资料
  linkHomeFarmer() {
    wx.navigateTo({
      url: '/pages/home-farmer/index'
    })
  },
  // 农场详情
  linkHomeFarm() {
    wx.navigateTo({
      url: '/pages/home-farm/index'
    })
  }
});
