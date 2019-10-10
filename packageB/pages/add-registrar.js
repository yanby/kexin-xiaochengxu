import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()


Page({
  data: {
    tabActive: 0,
    inputValue: "",
    farmId: "",
    formId: ""
  },
  onLoad(query) {
    this.init()
  },
  submitFormId(e) {
    console.log('formid', e.detail.formId)
    this.setData({
      formId: e.detail.formId
    })
  },
  activeFun(e){
    let id = e.target.dataset.id
    console.log(e)
    this.setData({
      tabActive: id
    })
  },  
  init() {
    request('/farm/getFarmManager', 'post', {
      formId: this.data.formId,
      token: wx.getStorageSync("token"),
      farmId: wx.getStorageSync("farmId")
    }).then(res => {
      console.log(res)
      this.setData({
        dataList: res.objs.kxFarmManagerUsers
      })
     
    })
  },
  //确认添加
  btnFun(){
    let tel = /^\d{11}$/;
    if (this.data.inputValue==""){
      wx.showToast({
        title: '请输入手机号'
      })  
      return
    } else if (tel.test(this.data.inputValue)==false){
      wx.showToast({
        title: '请输入正确的手机号'
      }) 
      return 
    }else{
      request('/farm/addFarmManager', 'post', {
        token: wx.getStorageSync("token"),
        farmId: wx.getStorageSync("farmId"),
        managerPhone: this.data.inputValue
      }).then(res => {
        console.log(res)
        this.setData({
          inputValue: ""
        })
        wx.showToast({
          title: '添加成功'
        })
        this.init();
      })
    }
  },
  bindblur(e){
    this.setData({
      inputValue: e.detail.value
    })
  },
  delParm(e) {
    let that = this;
    const id = e.target.dataset.id || e.currentTarget.dataset.id;
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '确定要删除记录员？',
      success(res) {
        if (res.confirm) {
          request('/farm/delFarmManager', 'post', {
            token: wx.getStorageSync("token"),
            id: id,
          }).then(res1 => {
            console.log(res1)
            wx.showToast({
              title: '删除成功'
            })
            that.init();
          })
        }
      }
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
    return {title: 'My App', desc: 'My App description', path: 'pages/index/index'};
  },
});
