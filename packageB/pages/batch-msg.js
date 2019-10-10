import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()

Page({
  data: {
    farmId: "",//农场ID
    plantStandard: "",//种植标准
    plantStandardId: "",//选择的种植标准
    sowingForm: "",//种植形式
    sowingFormId: "",//选择的种植形式
    cropVariety: "",//名称
    area: "",//面积
    repetActive: 0,//反复性事件
  },
  onLoad(query) {
    this.setData({
      farmId: query.farmId,
    })
    this.init();

  },
  init() {
    request('/api/farm/kxMenu', 'get', {
      farmId: this.data.farmId,
      plotType: this.data.nameId
    }).then(res => {
      console.log(res)
      if (!this.data.plotId) {
        this.setData({
          plotId: res.data.plots[0].id,
          cropId: res.data.plots[0].list[0].id
        })
      }
      this.setData({
        plantStandard: res.data.dicts[0].plantStandard,
        sowingForm: res.data.dicts[0].sowingForm,
        secondTree: res.data.plots,
        thirdTree: res.data.plots[0].list,
      })
    })
  },  
  //点击选择种植标准
  radioBiaozhun: function (e) {
    this.setData({
      plantStandardId: e.detail.value
    })
  },
  //点击选择种植形式
  radioXingshi: function (e) {
    this.setData({
      sowingFormId: e.detail.value
    })
  },
  //获取input的值
  onBlur(e) {
    const param = e.target.dataset.param
    if (param == 'cropVariety') {
      this.setData({
        cropVariety: e.detail.value
      })
    } else if (param == 'area') {
      this.setData({
        area: e.detail.value
      })
    }
  },
  //点击确认
  querenFun() {
    if (!this.data.cropVariety) {
      wx.showToast({
        title: '请填写品种名称'
      })
      return
    } else if (!this.data.area) {
      wx.showToast({
        title: '请填写种植面积'
      })
      return
    } else if (!this.data.plantStandardId) {
      wx.showToast({
        title: '请选择种植标准'
      })
      return
    } else if (!this.data.sowingFormId) {
      wx.showToast({
        title: '请选择种植形势'
      })
      return
    } else {
      request('/api/farm/addPlantingPlan', 'post', {
        cropVariety: this.data.cropVariety,//品种名称
        area: this.data.area,//面积
        plantStandard: this.data.plantStandardId,//种植标准
        sowingForm: this.data.sowingFormId,//播种形式
        cropId: this.data.cropId,//农作物ID
        plotId: this.data.plotId//地块ID
      }).then(res => {
        console.log(res)
        wx.redirectTo({
          url: `/pages/index/index?plotCropId=${res.data.plotCropId}`
        })
      })
    }
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
  }
});
