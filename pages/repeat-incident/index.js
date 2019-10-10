import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()


// pages/repeat-incident/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuList: "",
    menuActiveId: "",
    kxBatchId: "",//作物ID
    menuList: "",//一级菜单
    menuActiveId: "",//一级的ID
    templList: "",//模板list
    tempActiveId: "",//模板ID
    showInfos: "",//填写后的显示数据
    kxCropWorkTakeList: "",
    batchStatus: "",//完成状态
    formId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
    
  },
  submitFormId(e) {
    console.log('formid', e.detail.formId)
    this.setData({
      formId: e.detail.formId
    })
  },
  init(){
    request('/repeat/getMenu', 'post', {
      // 这里的code就是通过wx.login()获取的
      token: wx.getStorageSync("token"),
      kxBatchId: wx.getStorageSync("kxBatchId")
    }).then(res => {
      console.log(res);
      this.setData({
        menuList: res.objs.menuList,
        menuActiveId: res.objs.menuList[0].id
      })
      wx.setStorageSync("repeatId", this.data.menuActiveId)
      this.historyFun(this.data.menuActiveId);
      this.menuActiveInit(this.data.menuActiveId); 
    })
  },
  repeatFun(e){
    let id = e.currentTarget.dataset.id;
    console.log(e)
    wx.navigateTo({
      url: `/pages/repeat-result/index?repetaId=${id}`
    })
  },
  //主项点击
  menuActiveFun(e) {
    let id = e.target.dataset.id;
    this.setData({
      menuActiveId: id
    })
    wx.setStorageSync("repeatId", id)
    this.historyFun(id);
    this.menuActiveInit(id)
  },
  //主项点击初始化
  menuActiveInit(id) {
    request('/repeat/getStairInfo', 'post', {
      token: wx.getStorageSync("token"),
      kxBatchId: wx.getStorageSync("kxBatchId"),
      workId: id
    }).then(res => {
      console.log(res)
      this.setData({
        batchStatus: res.objs.batchStatus,
        templList: res.objs.templList,
      })
      //如果有模板数据，默认选择第一个
      if (this.data.templList.length) {
        this.setData({
          tempActiveId: res.objs.templList[0].id
        })
      } else {
        this.setData({
          tempActiveId: ""
        })
      }
    })
  },
  //模板点击的时候
  tempActiveFun(e) {
    let id = e.target.dataset.id || e.currentTarget.dataset.id;
    console.log(e)
    this.setData({
      tempActiveId: id
    })
    
  },
  //历史记录
  historyFun(id){
    request('/repeat/getRepeatList', 'post', {
      // 这里的code就是通过wx.login()获取的
      token: wx.getStorageSync("token"),
      kxBatchId: wx.getStorageSync("kxBatchId"),
      workId: id
    }).then(res => {
      console.log(res);
      this.setData({
        kxCropWorkTakeList: res.objs.kxCropWorkTakeList
      })
    })
  },
  //初始化底部弹窗数据
  bottomModalInit() { 
    var that = this;
    request('/work/getWorkInfo', 'post', {
      token: wx.getStorageSync("token"),
      kxBatchId: wx.getStorageSync("kxBatchId"),
      workId1: this.data.menuActiveId,//一级ID
      workId2: this.data.secondaryListId,//步骤ID
      workTemplId: this.data.tempActiveId,//模板ID 
    }).then(res => {
      console.log(res)
      this.setData({
        bottomList: res.objs,
        singlesList: res.objs.singles,
        commonsList: res.objs.commons,
        commonWorkInfoTemplList: res.objs.commonWorkInfoTemplList
      })
      if (this.data.singlesList.length){
        this.data.singlesList.forEach((item,index)=>{
          if (item.info == true){
            item.groudMapList = JSON.parse(item.groudMapList)
            this.setData({
              singlesList: this.data.singlesList
            })
          }
        })
      }
    })
  },
  addRepeatWork(){
    wx.navigateTo({
      url: `/pages/repeat-add/index?menuActiveId=${this.data.menuActiveId}&tempActiveId=${this.data.tempActiveId}&formId=${this.data.formId}`
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.historyFun(wx.getStorageSync("repeatId"))
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})