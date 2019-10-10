// pages/map/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ""
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let url = "https://www.baidu.com/";
    // let url = "https://testkexinfarmsdingding.fpchy.com"
    let url = `https://testkexinfarmsdingding.fpchy.com?token=${wx.getStorageSync('token')}`
    this.setData({
      url: url
    })
    console.log(url)
  },
  //监听页面发送给小程序的消息  
  bindmessage(e){    
    console.log(e)
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