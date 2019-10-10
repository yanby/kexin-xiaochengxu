import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()


Page({
  data: {
    plotCropId: "",//	地块作物ＩＤ
    imgUrl:{
      dianlutuleft: imgUrl + "/dianlutuleft.png",
      dianluturight: imgUrl + "/dianluturight.png",
      farm: imgUrl + "/farm.png",
      router: imgUrl + "/router.png",
      manage: imgUrl + "/manage.png",
      arrowRight: imgUrl + "/arrow-right.png",
      completeInfo: imgUrl + "/complete-info.png",
    },
    farmImg: "",//农场图片
    farmName: "",//农场名称,//农场名字
    organicScore: "",//有机分数
    onOrganicScore: "",//绿色
    msgCount: "",//消息数
    organicScoreBatchNum: "",
    onOrganicScoreBatchNum: ""

  },
  onLoad(query) {
    this.init();  
  },
  init() {
    request('/farm/getUserPageInfo', 'post', {
      token: wx.getStorageSync("token"),
      farmId: wx.getStorageSync("farmId"),
    }).then(res => {
      console.log(res)
      this.setData({
        msgCount: res.objs.msgCount,
        organicScore: res.objs.organicScore,
        onOrganicScore: res.objs.onOrganicScore,
        onOrganicScoreBatchNum: res.objs.onOrganicScoreBatchNum,
        organicScoreBatchNum: res.objs.organicScoreBatchNum
      })
    })
  },  
  //切换农场
  linktabFarm() {
    wx.navigateTo({
      url: '/packageB/pages/home-farm-tabs'
    })
  },
  // 农场管理 
  changeFarm() {
    wx.navigateTo({
      url: "/packageB/pages/home-farm-lists"
    })
  },
  // 完善资料
  linkHomeFarmer() {
    wx.navigateTo({
      url: `/packageB/pages/home-farmer`
    })
  },
  //天气预告
  tianqiFun(){
    wx.navigateTo({
      url: "/packageB/pages/farms-weather"
    })
  },
  //消息中心
  linkMessage(){
    wx.navigateTo({
      url: `/pages/message/index`
    })
  },
  // 分数详情
  linkHomeFarm() {
    wx.navigateTo({
      url: `/packageB/pages/home-farm`
    })
  },
  //添加记录员
  addPerson(){
    wx.navigateTo({
      url: `/packageB/pages/add-registrar`
    })
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    var that = this;

    wx.getStorage({
      key: 'farm',
      success(res) {
        console.log(res.data)
        that.setData({
          score: res.data.score,
          farmImg: res.data.img,
          farmName: res.data.name
        })
      }
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
