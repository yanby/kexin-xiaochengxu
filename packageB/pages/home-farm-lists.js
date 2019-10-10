import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()

Page({
  data: {
    farms: "",//所有农场
    farmId: "",//农场id
    
    area: "",//面积
    name: "",//名称
    address: "",//地址
    modal: false,//
    param: "",
    id: "",
    value: ""
  },
  onLoad(query) {
    // 页面加载
   
    this.init();
  },
  init() {
    request('/farm/getFarmsByKxUser', 'post', {
      token: wx.getStorageSync("token"),
    }).then(res => {
      console.log(res)
      this.setData({
        farms: res.objs.kxFarms
      })
      if (this.data.farms.length == 0){
        wx.redirectTo({
          url: "/pages/create-farm/index"
        })
      }
    })
  },
  bindblur(e){
    this.setData({
      value: e.detail.value
    })
   
  },
  cancelFun(){
    this.setData({
      modal: false
    })
  },
  //点击弹窗确认按钮
  
  configFun(){
    var that = this;
    if (this.data.param == 'name') {
      if (this.data.value == "") {
        wx.showToast({
          title: '农场名称不能为空'
        })
        return
      } else {
        that.setData({
          name: this.data.value
        })
      }
    } else if (this.data.param == 'address') {
      if (this.data.value == "") {
        wx.showToast({
          title: '农场位置不能为空'
        })
        return
      } else {
        that.setData({
          address: this.data.value
        })
      }
    } else if (this.data.param == 'area') {
      if (this.data.value == "") {
        wx.showToast({
          title: '农场面积不能为空'
        })
        return
      } else {
        that.setData({
          area: this.data.value
        })
      }
    } 
    //修改农场信息
    request('/farm/updateFarm', 'post', {
      token: wx.getStorageSync("token"),
      id: this.data.id,
      area: this.data.area,
      name: this.data.name,
      path: this.data.address
    }).then(res => {
      console.log(res)
      wx.setStorageSync("farmName", this.data.name)
      wx.showToast({
        title: '修改成功'
      })
      this.setData({
        modal: false
      })
      this.init();
    })
  },
  //修改农场信息
  bindtap(e){
    console.log(e)
    this.setData({
      modal: true,
      param: e.currentTarget.dataset.param,
      id: e.currentTarget.dataset.id
    })
  },
  //添加农场
  addFarm(){
    // wx.navigateTo({
    //   url: "/pages/create-farm/index"
    // })
    wx.navigateTo({
      url: "/pages/map/index"
    })
  },
  //删除农场
  delParm(e){
    let that = this;
    const farmId = e.currentTarget.dataset.id;
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '确定要删除农场？',
      success(res) {
        if (res.confirm) {
          request('/farm/delFarm', 'post', {
            token: wx.getStorageSync("token"),
            farmId: farmId,
          }).then(res1 => {
            console.log(res1)
            wx.showToast({
              title: '删除成功'
            })
            if (farmId == wx.getStorageSync("farmId")){
              wx.removeStorageSync("farm")
              wx.removeStorageSync("farmId")
              wx.removeStorageSync("farmName")
              wx.removeStorageSync("kxBatchId")
            }
            that.init();
          })
        }
      }
    }) 
  },
  //修改圈地
  quandiFun(e){
    // const farmId = e.target.dataset.farmid;
    // console.log(e)
    // wx.navigateTo({
    //   url: `/pages/create-ground/index?farmId=${farmId}`
    // })
  },
  //管理地块
  dikuaiFun(e){
    let that = this;
    console.log(e)
    const farmId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/packageB/pages/home-ground-lists?id=${farmId}`
    })
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
