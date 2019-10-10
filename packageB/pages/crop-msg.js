import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()


// pages/crop-msg/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    items: [
      {name:"种植中", id:0},
      {name:"已完成", id:1}
    ],
    plotId: "",
    list: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    this.setData({
      id: query.id
    })
    this.init()
  },
  init(){
    request('/farm/getCoteBatch', 'post', {
      token: wx.getStorageSync("token"),
      coteId: this.data.id,
      status: this.data.active
    }).then(res => {
      console.log(res)
      this.setData({
        list: res.objs.batchs
      })
    })
  },
  //点击切换
  choseBox(e){
    let id = e.target.dataset.id;
    this.setData({
      active: id
    })
    this.init()
  },
  //删除批次
  delParm(e) {
    let that = this;
    const id = e.target.dataset.id || e.currentTarget.dataset.id;
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '确定要删除批次？',
      success(res) {
        if (res.confirm) {
          request('/farm/delBatch', 'post', {
            token: wx.getStorageSync("token"),
            kxBatchId: id
          }).then(res1 => {
            console.log(res1)
            wx.showToast({
              title: '删除成功'
            })
            if (id == wx.getStorageSync("kxBatchId")){
              wx.removeStorageSync("kxBatchId")
            }
            that.init();
          })
        }
      }
    })
  },
  //管理作物
  zuowuFun(){
    wx.navigateTo({
      url: `/packageB/pages/batch-msg?farmId=${farmId}`
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