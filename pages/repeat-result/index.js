import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: {
      complete: imgUrl + '/complete.png',
      nocomplete: imgUrl + '/no-complete.png',
    },
    repetaId: "",
    showInfos:"",
    status: "",
    kxCropWorkTake: "",
    formId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      repetaId: options.repetaId
    })
    this.init();
  },
  submitFormId(e) {
    console.log('formid', e.detail.formId)
    this.setData({
      formId: e.detail.formId
    })
  },
  //图片放大功能
  imgYu(e) {
    console.log(e)
    var src = e.currentTarget.dataset.src;//获取data-src
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
  //主项点击初始化
  init() {
    request('/repeat/getWorkInfoShow', 'post', {
      token: wx.getStorageSync("token"),
      kxBatchId: wx.getStorageSync("kxBatchId"),
      repetaId: this.data.repetaId
    }).then(res => {
      console.log(res)
      this.setData({
        status: res.objs.status,
        showInfos: res.objs.showInfos,
        kxCropWorkTake: res.objs.kxCropWorkTake
      })
    })
  },
  //初始化底部弹窗数据
  addRepeatWork() {
    wx.navigateTo({
      url: `/pages/repeat-add/index?repetaId=${this.data.repetaId}`
    })
  },
  //单个节点点击完成
  childCompleted() {
    request('/repeat/workFinish', 'post', {
      formId: this.data.formId,
      token: wx.getStorageSync("token"),
      kxBatchId: wx.getStorageSync("kxBatchId"),
      repetaId: this.data.repetaId//一级ID
    }).then(res => {
      console.log(res)
      this.init();
      // wx.redirectTo({
      //   url: `/pages/repeat-add/index?repetaId=${this.data.repetaId}`
      // })
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