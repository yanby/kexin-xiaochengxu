import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()

Page({
  data: {
    active: 0,//选择的地块性质
    index: 0,
    area: "",//面积
    id: "",//棚的ID
    name: "",//棚的名字
    updataName: "",//修改的名字
    area: "",//棚的面积
    cotesList: "",//所有的棚
    activeList: "",//当前选择的棚
    coteStayNum: 0,//标记了几个
    cotesLength: "",//总的数量
    url: "",
    focus: false,//点确定获取焦点
    total:""
  },
  onLoad(query) {
    this.setData({
      url: query.url || ""
    })
    this.init();
    
  },
  init(){
    request('/user/getCote', 'post', {
      token: wx.getStorageSync("token"),
      farmId: wx.getStorageSync("farmId")
    }).then(res => {
      console.log(res)
      var that = this;
      this.setData({
        cotesList: res.objs,
        updataName: "",
        coteStayNum: res.objs.coteStayNum,
        total: res.objs.cotes.length
      })

      this.data.cotesList.warmCotes.forEach((item,idnex)=>{
        if(item.area == 0){
          item.area = ""
        }
      })
      this.data.cotesList.coldCotes.forEach((item, idnex) => {
        if (item.area == 0) {
          item.area = ""
        }
      })
      this.setData({
        cotesList: this.data.cotesList
      })

      if(this.data.active == 0){
        this.setData({
          activeList: this.data.cotesList.warmCotes,
          cotesLength: this.data.cotesList.warmCotes.length
        })
        if (this.data.cotesLength){
          this.setData({
            id: this.data.cotesList.warmCotes[this.data.index].id,
            name: this.data.cotesList.warmCotes[this.data.index].name,
            area: this.data.cotesList.warmCotes[this.data.index].area,
          })
        }
        
      }else{
        this.setData({
          activeList: this.data.cotesList.coldCotes,
          id: this.data.cotesList.coldCotes[this.data.index].id,
          area: this.data.cotesList.coldCotes[this.data.index].area,
          cotesLength: this.data.cotesList.coldCotes.length
        })
        if (this.data.cotesLength) {
          this.setData({
            id: this.data.cotesList.coldCotes[this.data.index].id,
            name: this.data.cotesList.coldCotes[this.data.index].name,
            area: this.data.cotesList.coldCotes[this.data.index].area,
          })
        }
      } 
    })
  },
  //选择的地块性质
  changeFun(e){
    let that = this;
    let active = e.target.dataset.active
    this.setData({
      active: e.target.dataset.active,
    })
    if (active == 0){
      this.setData({
        index: 0,
        activeList: this.data.cotesList.warmCotes,
        cotesLength: this.data.cotesList.warmCotes.length
      })
      if (this.data.cotesLength){
        this.setData({
          id: this.data.cotesList.warmCotes[0].id,
          name: this.data.cotesList.warmCotes[0].name,
          area: this.data.cotesList.warmCotes[0].area,
        })
      } else {
        this.setData({
          area: ""
        })
      }
    }else{
      this.setData({
        index: 0,
        activeList: this.data.cotesList.coldCotes,
        cotesLength: this.data.cotesList.coldCotes.length
      })
      if (this.data.cotesLength){
        this.setData({
          id: this.data.cotesList.coldCotes[0].id,
          name: this.data.cotesList.coldCotes[0].name,
          area: this.data.cotesList.coldCotes[0].area
        })
      }else{
        this.setData({
          area: ""
        })
      }
    }
  },
  //选择的棚号
  bindPickerChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      index: e.detail.value,
      id: this.data.activeList[e.detail.value].id,
      name: this.data.activeList[e.detail.value].name,
      area: this.data.activeList[e.detail.value].area
    })
  },
  //填写面积
  bindblur(e){
    let param = e.target.dataset.param
    if (param=="area"){
      // let value = this.validateNumber(e.detail.value)
      this.setData({
        area: e.detail.value
      })
    } else if (param == "name"){
      this.setData({
        updataName: e.detail.value
      })
    }
    
  },
  // validateNumber(val) {
  //     return val.replace(/\D/g, '')
  //   },
  //点击确认标注
  biaozhuFun(){
    var that = this;
    const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
    if (!this.data.area){
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
    }else{
      console.log(this.data.updataName)
      setTimeout(() => {
        request('/farm/updateCote', 'post', {
          token: wx.getStorageSync("token"),
          id: that.data.id,//棚的id
          name: that.data.updataName || that.data.name,
          area: that.data.area//棚的面积
        }).then(res => {
          console.log(res)
          that.init();
        })
      }, 500)
    }
  },
  //结束标注
  jieshuFun(){
    if (this.data.coteStayNum == 0){
      wx.showToast({
        title: '至少保存一个棚',
        icon: 'none'
      })
    }else{
      if (this.data.url == "groundList"){
        wx.navigateTo({
          url: "/packageB/pages/home-ground-lists"
        })
      }else{
        wx.redirectTo({
          url: "/pages/plant-start/index"
        })
      }
        
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
