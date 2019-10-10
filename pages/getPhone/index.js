import { request, imgUrl, https, httpsUrl } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()
// pages/getPhone/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    checked: "",
    items: {value: true},
    modal: false,
    formId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //点击授权按钮
  getPhoneNumber: function (e) {
    var that = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      //用户允许授权
      request('/userLogin/wx', 'post', {
        // 这里的code就是通过wx.login()获取的
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        requestAuthCode: this.data.code,
      }).then(res => {
        console.log(res);
        wx.setStorageSync('token', res.objs.token)
        routerLink()
      })
    }
  },
  checkboxChange(e){
    var val = e.detail.value;
    var str = val.join();
    this.setData({
      checked: str
    })
  },
  modalShow(){
    this.setData({
      modal: true
    })
  },
  modalHide(){
    this.setData({
      modal: false
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
    var that = this
    // 页面显示
    wx.login({
      success(res) {
        that.setData({
          code: res.code
        })
      }
    })
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