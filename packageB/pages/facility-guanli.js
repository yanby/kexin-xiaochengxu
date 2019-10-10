import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()


Page({
  data: {
    kxCote: "",//地块ID
    groundlist: "",//地块列表
  },
  onLoad(query) {
    this.setData({
      kxCote: query.id
    })
    this.init();
  },
  init() {
    request('/inductor/getDevicesByCote', 'post', {
      token: wx.getStorageSync("token"),
      kxCote: this.data.kxCote
    }).then(res => {
      console.log(res)
      this.setData({
        groundlist: res.objs.devices
      })
    })
  },
  //删除地块
  delFun(e){
    console.log(e)
    let that = this;
    const id = e.target.dataset.id || e.currentTarget.dataset.id;
    console.log(id)
    wx.showModal({
      title: '提示',
      content: '确定要解除设备绑定么？',
      success(res) {
        if (res.confirm) {
          request('/inductor/removeDevice', 'post', {
            token: wx.getStorageSync("token"),
            kxDevice: id,
            kxCote: that.data.kxCote
          }).then(res1 => {
            console.log(res1)
            wx.removeStorageSync("kxBatchId")
            wx.showToast({
              title: '解除成功'
            })
            that.init();
          })
        }
      }
    }) 
  },
  //添加设备
  addFun(){
    wx.navigateTo({
      url: `/packageB/pages/facility-msg?id=${this.data.kxCote}`
    })
  },
  //绑定设备
  bindFun(e) {
    var that = this;
    wx.scanCode({
      success(res) {
        console.log(res)
        that.setData({
          result: res.result
        })

        request('/inductor/getDeviceInfo', 'post', {
          token: wx.getStorageSync("token"),
          kxCote: that.data.kxCote,
          qrCode: res.result
        }).then(res1 => {
          console.log(res1)
          wx.navigateTo({
            url: `/packageB/pages/facility-msg?id=${that.data.kxCote}&name=${res1.objs.name}&type=${res1.objs.type}&code=${res1.objs.num}&shebeiId=${res1.objs.id}&result=${res.result}`
          })
        })
      },
      fail(res) {
        wx.showToast({
          title: '请重新扫码',
          icon: 'none'
        })
      }
    })
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    this.init();
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
