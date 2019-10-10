import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()


Page({
  data: {
    farmId: "",
    active: "",
    groundlist: "",//地块列表
    items: [{ name: "全部", id: "" }, { name: "暖棚", id: "warm" }, { name: "冷棚", id: "cold" }]
  },
  onLoad(query) {
    this.setData({
      farmId: query.id
    })
    console.log(query )
    this.init();
  },
  init() {
    request('/farm/getCotesByKxFarm', 'post', {
      token: wx.getStorageSync("token"),
      farmId: this.data.farmId || wx.getStorageSync("farmId"),
      type: this.data.active
    }).then(res => {
      console.log(res)
      this.setData({
        groundlist: res.objs.cotes
      })
    })
  },
  //点击详情
  detailFun(e){
    const id = e.target.dataset.id || e.currentTarget.dataset.id;
    console.log(e)
    wx.navigateTo({
      url: `/packageB/pages/facility-monitor?kxCote=${id}`
    })
  },
  //点击tab切换
  tabFun(e){
    const id = e.target.dataset.id || e.currentTarget.dataset.id;
    this.setData({
      active: id
    })
    this.init()
  },
  //删除地块
  delFun(e){
    console.log(e)
    let that = this;
    const id = e.target.dataset.id || e.currentTarget.dataset.id;
    console.log(id)
    wx.showModal({
      title: '提示',
      content: '确定要删除地块？',
      success(res) {
        if (res.confirm) {
          request('/farm/delCote', 'post', {
            token: wx.getStorageSync("token"),
            coteId: id,
          }).then(res1 => {
            console.log(res1)
            wx.removeStorageSync("kxBatchId")
            wx.showToast({
              title: '删除成功'
            })
            that.init();
          })
        }
      }
    }) 
  },
  //修改地块
  dikuaiFun(){
    wx.navigateTo({
      url: `/pages/create-ground/index?url=groundList`
    })
  },
  //管理作物
  zuowuFun(e){
    let id = e.target.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `/packageB/pages/crop-msg?id=${id}`
    })
  },
  //管理设备
  shebeiFun(e){
    let id = e.target.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `/packageB/pages/facility-guanli?id=${id}`
    })
  },
  //新增地块
  goAddplot(){
    wx.navigateTo({
      url: `/packageB/pages/add-plot?farmId=${this.data.farmId}`
    })
  },
  //绑定设备
  bindFun(e){
    let id = e.target.dataset.id;
    console.log(e)
    var that = this;
    wx.scanCode({
      success(res) {
        console.log(res)
        that.setData({
          result: res.result
        })


          request('/inductor/getDeviceInfo', 'post', {
            token: wx.getStorageSync("token"),
            kxCote: that.data.id,
            qrCode: res.result
          }).then(res1 => {
            console.log(res1)
            wx.navigateTo({
              url: `/packageB/pages/facility-msg?id=${id}&name=${res1.objs.name}&type=${res1.objs.type}&code=${res1.objs.num}&shebeiId=${res1.objs.id}&result=${res.result}`
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
