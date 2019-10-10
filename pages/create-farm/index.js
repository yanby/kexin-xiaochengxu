import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()


Page({
  data: {
    title: '创建农场',
    farmName: '',//农场名字
    area: '',//面积
    address: "",//位置
    brooderCount: 0,//暖棚数量
    coolCount: 0,//冷棚数量
    query: "",//上个页面的参数
    farmId: '',
    lat:"",//经度
    lng: "",//维度
    arrList: "",//经纬度数组
    province: "",//省
    city: "",//市
    district: "",//区
    imgUrl: {
      logo: imgUrl + "/text1.png",
    }
  },
  onLoad(query) {
    console.log(query)
    this.setData({
      area: query.area || "",
      address: query.province + query.city + query.district || "",
      lat: query.lat || "",
      lng: query.lng || "",
      arrList: query.arrList || "",                                  
      province: query.province || "",
      city: query.city || "",
      district: query.district || ""
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
  // 失去焦点时更新数据
  onBlur(e) {
    const param = e.target.dataset.param
    if (param === 'farmName') {
      this.setData({
        farmName: e.detail.value
      })
    } else if (param === 'brooderCount') {
      this.setData({
        brooderCount: e.detail.value
      })
      console.log(this.data.brooderCount)
    } else if (param === 'coolCount') {
      this.setData({
        coolCount: e.detail.value
      })
    } else if (param === 'address') {
      this.setData({
        address: e.detail.value
      })
    } else if (param === 'area') {
      this.setData({
        area: e.detail.value
      })
    } 
  },
  // 点击加号
  tapJia(e) {
    const param = e.target.dataset.param
    if (param === 'brooderCount') {
      this.setData({
        brooderCount: this.data.brooderCount + 1
      })
    } else if (param === 'coolCount') {
      this.setData({
        coolCount: this.data.coolCount + 1
      })
    }
  },
  // 点击减号
  tapJian(e) {
    const param = e.target.dataset.param
    if (param === 'brooderCount') {
      if (this.data.brooderCount === 0) return
      this.setData({
        brooderCount: this.data.brooderCount - 1
      })
    } else if (param === 'coolCount') {
      if (this.data.coolCount === 0) return
      this.setData({
        coolCount: this.data.coolCount - 1
      })
    }
  },
  linkPlantStart() {
   
    const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
    if (!this.data.farmName) {
      wx.showToast({
        title: '请填写农场名称',
        icon: 'none'
      })
      return
    } else if (this.data.brooderCount == 0 && this.data.coolCount == 0) {
      wx.showToast({
        title: '请填写棚数',
        icon: 'none'
      })
      return
    } else if (!this.data.address) {
      wx.showToast({
        title: '请补充农场位置信息',
        icon: 'none'
      })
      return
    } else if (!this.data.area) {
      wx.showToast({
        title: '请填写农场面积',
        icon: 'none'
      })
      return
    } else if (!reg.test(this.data.area)) {
      wx.showToast({
        title: '农场面积最多保留两位小数',
        icon: 'none'
      })
      return
    }else{
      request('/farm/addFarm', 'post', {
        token: wx.getStorageSync("token"),
        name: this.data.farmName,
        area: this.data.area,
        warmNum: this.data.brooderCount,
        coldNum: this.data.coolCount,
        path: this.data.address,
        x: this.data.lat,
        y: this.data.lng,
        mapInfo: this.data.arrList,
        city: this.data.city,
        province: this.data.province,
        districtTown: this.data.district
      }).then(res => {
        console.log(res)
        wx.setStorageSync("farm",res.objs.farm)
        wx.setStorageSync("farmId", res.objs.farm.id)
        wx.setStorageSync("farmName", res.objs.farm.name)
        wx.navigateTo({
          url: `/pages/create-ground/index`
        })
      })
    }
  }
});
