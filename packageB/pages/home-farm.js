import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()


Page({
  data: {
    indexData: "",//所有数据
    poltType: "",//棚类型
    coteName: "",//棚名称
    cropId: "",//作物ID
    status: "",//状态
    poltTypeIndex: 0,//棚类型
    plotsIndex: 0,//棚号
    cropsIndex: 0,//品类
    statusIndex: 0,//状态
    poltTypeId: "",//棚类型
    plotsId: "",//棚号
    cropsId: "",//品类
    statusId: "",//状态
    imgUrl: {
      more: imgUrl + "/more.png",
      youji: imgUrl + "/youji.png",
      luse: imgUrl + "/luse.png",
    },
    list: "", 
    farmName: "",//农场名字
  },
  onLoad(query) {
    
    var that = this
    wx.getStorage({
      key: 'farm',
      success(res) {
        console.log(res.data)
        that.setData({
          farmName: res.data.name
        })
      }
    })
    this.init();
  },
  init(){
    request('/farm/getFarmInfoAndBatch', 'post', {
      token: wx.getStorageSync("token"),
      farmId: wx.getStorageSync("farmId"),
      coteType: this.data.poltType,
      coteName: this.data.coteName,
      cropId: this.data.cropId,
      status: this.data.status
    }).then(res => {
      console.log(res)
      this.setData({
        indexData: res.objs,
        poltType: res.objs.searchInfo.poltType,//棚类型
        plots: res.objs.searchInfo.plots,//棚号
        crops: res.objs.searchInfo.crops,//品类
        status: res.objs.searchInfo.status,//状态
        poltTypeId: res.objs.searchInfo.poltType[0].value,
        plotsId: res.objs.searchInfo.plots[0].value,//棚号
        cropsId: res.objs.searchInfo.crops[0].value,//品类
        statusId: res.objs.searchInfo.status[0].value,//状态
      })
      this.listFun();
    })
  },
  listFun() {
    request('/farm/getBatchByCoteInfo', 'post', {
      token: wx.getStorageSync("token"),
      farmId: wx.getStorageSync("farmId"),
      coteType: this.data.poltTypeId,//棚类型
      coteName: this.data.plotsId,//棚号
      cropId: this.data.cropsId,//品类
      status: this.data.statusId,//状态
    }).then(res => {
      console.log(res)
      this.setData({
        list: res.objs.batchs
      })
    })
  },
  bindChang0(e){
    this.setData({
      poltTypeIndex: e.detail.value,
      poltTypeId: this.data.poltType[e.detail.value].value,
    })
    this.listFun();
  },
  bindChang1(e) {
    this.setData({
      plotsIndex: e.detail.value,
      plotsId: this.data.plots[e.detail.value].value,
    })
    this.listFun();
  },
  bindChang2(e) {
    this.setData({
      cropsIndex: e.detail.value,
      cropsId: this.data.crops[e.detail.value].value,
    })
    this.listFun();
  },
  bindChang3(e) {
    this.setData({
      statusIndex: e.detail.value,
      statusId: this.data.status[e.detail.value].value,
    })
    this.listFun();
  },
 
  //跳转分数标准
  linkHomeCredit(){
    wx.navigateTo({
      url: '/packageB/pages/home-credit'
    })
  },
  //跳转详情页面
  linkHomeCropDetail(e){
    let id = e.currentTarget.dataset.id;
    console.log(e)
    wx.navigateTo({
      url: `/packageB/pages/home-crop-detail?&id=${id}`
    })
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    this.setData({
      farmName: wx.getStorageSync("farmName")
    })
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
