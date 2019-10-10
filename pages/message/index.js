import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()
// pages/message/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    farmMsgs: "",//消息列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },
  init() {
    request('/farm/getUserMsgList', 'post', {
      token: wx.getStorageSync("token"),
      farmId: wx.getStorageSync("farmId"),
    }).then(res => {
      console.log(res)
      this.setData({
        farmMsgs: res.objs.farmMsgs
      })
    })
  }, 
  //重新上传
  updataFun(){
    wx.redirectTo({
      url: `/packageB/pages/home-farmer`
    })
  }, 
  resultFun(e){
    console.log(e)
    var obj = e.target.dataset.obj;
    var id = e.target.dataset.id;
    var index = e.target.dataset.index;
    request('/farm/credit', 'post', {
      token: wx.getStorageSync("token"),
      farmId: wx.getStorageSync("farmId"),
      buyer: obj,
      creditStatus: index,
      id: id
    }).then(res => {
      console.log(res)
      this.init()
    })
  },
  readFun(e){
    console.log(e)
    var id = e.currentTarget.dataset.id;
    request('/farm/readMsg', 'post', {
      token: wx.getStorageSync("token"),
      msgId: id
    }).then(res => {
      console.log(res)
      this.init()
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