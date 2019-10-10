import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()


Page({
  data: {
    
    plantStandard: [{ name: "无化学农药、化肥、人工合成激素", id: 0 }, { name:"合理使用化学农药、化肥、激素",id:1}],//种植标准
    sowingForm: [{ name:"自育苗",id:0},{name:"外购苗",id:1},{name:"直播",id:2}],//种植形式

    variety:"",//名称
    area: "",//面积 
    nameId:0,//冷暖棚
    kxCote: "",//棚的id
    kxCrop: "",//农作物的id

    cotesList: "",//所有的棚
    firstTree: [{ name: "暖棚", id: 0 }, { name: "冷棚", id: 1 }],
    secondTree: [],//棚号
    thirdTree: [],//农作物
    selfFertileSeeding: "",//自育苗
    purchasedSeeding: "",//外购苗
    directSeeding: "",//直播  
    organic: "",//有机
    noOrganic: "",//绿色
    formId: ""
  },
  onLoad(query) {
    this.init();
  },
  submitFormId(e) {
    console.log('formid', e.detail.formId)
    this.setData({
      formId: e.detail.formId
    })
  },
  init(){
    request('/farm/getAddBatchInfo', 'post', {
      token: wx.getStorageSync("token"),
      farmId: wx.getStorageSync("farmId")
    }).then(res => {
      console.log(res)
      this.setData({
        cotesList: res.objs,
        secondTree: res.objs.warmCotes,
        thirdTree: res.objs.crops
      })
      
      if(this.data.nameId == 0){
        this.setData({
          kxCote: res.objs.warmCotes[0].id,
          kxCrop: res.objs.crops[0].id
        })
      }
    })
  },
  //选择种植作物
  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      nameId: this.data.firstTree[val[0]].id
    }) 
    console.log(val)
    if (this.data.nameId == 0){
      this.setData({
        secondTree: this.data.cotesList.warmCotes,
      })
      if (this.data.secondTree.length){
        this.setData({
          kxCote: this.data.cotesList.warmCotes[val[1]].id,
          kxCrop: this.data.cotesList.crops[val[2]].id,
        })
      }
    }else{
      this.setData({
        secondTree: this.data.cotesList.coldCotes
      })
      if (this.data.secondTree.length) {
        this.setData({
          kxCote: this.data.cotesList.coldCotes[val[1]].id,
          kxCrop: this.data.cotesList.crops[val[2]].id,
        })
      }
    }
  },
  //点击选择种植标准
  radioBiaozhun: function (e) {
    let id = e.detail.value;
    if(id == 0){
      this.setData({
        organic: 1,
        noOrganic: 0
      })
      console.log(this.data.organic)
    }else{
      this.setData({
        organic: 0,
        noOrganic: 1
      })
    }
  },
  //点击选择种植形式
  radioXingshi: function (e) {
    let id = e.detail.value;
    if (id == 0) {
      this.setData({
        selfFertileSeeding: 1,//自育苗
        purchasedSeeding: 0,//外购苗
        directSeeding: 0,//直播
      })
    } else if(id == 1) {
      this.setData({
        selfFertileSeeding: 0,//自育苗
        purchasedSeeding: 1,//外购苗
        directSeeding: 0,//直播
      })
    }else{
      this.setData({
        selfFertileSeeding: 0,//自育苗
        purchasedSeeding: 0,//外购苗
        directSeeding: 1,//直播
      })
    }
  },
  //获取input的值
  onBlur(e) {
    const param = e.target.dataset.param
    if (param == 'cropVariety') {
      this.setData({
        variety: e.detail.value
      })
    } else if (param == 'area') {
      this.setData({
        area: e.detail.value
      })
    } 
  },
  //点击确认
  querenFun(){
    if (!this.data.variety){
      wx.showToast({
        title: '请填写品种名称',
        icon: 'none'
      })
      return
    } else if(!this.data.area){
      wx.showToast({
        title: '请填写种植面积',
        icon: 'none'
      })
      return
    } else if ( ( this.data.organic + this.data.noOrganic ) == 0 ) {

      wx.showToast({
        title: '请选择种植标准',
        icon: 'none'
      })
      return
    } else if ( (this.data.selfFertileSeeding + this.data.purchasedSeeding + this.data.directSeeding) ==0 ) {
      wx.showToast({
        title: '请选择种植形势',
        icon: 'none'
      })
      return
    }else{
      request('/work/addBatch', 'post', {
        formId: this.data.formId,
        token: wx.getStorageSync("token"),
        kxCote: this.data.kxCote,//	棚id
        kxCrop: this.data.kxCrop,//	农作物id
        variety: this.data.variety,//批次代号
        area: this.data.area,//种植面积
        selfFertileSeeding: this.data.selfFertileSeeding,//自育苗
        purchasedSeeding: this.data.purchasedSeeding,//外购苗
        directSeeding: this.data.directSeeding,//直播
        organic: this.data.organic,//有机
        noOrganic: this.data.noOrganic,//非有机
      }).then(res => {
        console.log(res)  
        wx.setStorageSync("kxBatchId", res.objs.batchId)
        wx.reLaunch({
          url: "/pages/index/index"
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
