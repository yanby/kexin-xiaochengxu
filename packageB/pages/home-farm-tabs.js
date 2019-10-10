import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()


Page({
  data: {
    farms: "",//所有农场
  },
  onLoad(query) {
    // 页面加载
   
    this.init();
  },
  init() {
    request('/farm/getFarmsByKxUser', 'post', {
      token: wx.getStorageSync("token"),
    }).then(res => {
      console.log(res)
      this.setData({
        farms: res.objs.kxFarms
      })
    })
  },
  changeParm(e) {
    console.log(e)
    let that = this;
    let id = e.target.dataset.id;
   
    wx.showModal({
      title: '提示',
      content: '确定要切换农场？',
      success(res) {
        if (res.confirm) {
         
          request('/user/getUserStatus', 'post', {
            token: wx.getStorageSync("token")
          }).then(res1 => {
            console.log(res1);
            res1.objs.farmList.forEach((item,index)=>{
              if(item.id == id){
                console.log(item)
                wx.setStorageSync("farm", res1.objs.farmList[index])
                wx.setStorageSync("farmId", res1.objs.farmList[index].id)
                wx.setStorageSync("farmName", res1.objs.farmList[index].name)
                wx.removeStorageSync("kxBatchId")
                routerLink();
              }
            })
          })
        }
      }
    })
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {

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
  },
  // 农场管理 / 切换农场
  changeFarm(e) {
    const type = e.target.dataset.type
    wx.navigateTo({
      url: '/pages/home-farm-lists/index?type=' + type
    })
  },
  // 完善资料
  linkHomeFarmer() {
    wx.navigateTo({
      url: '/pages/home-farmer/index'
    })
  },
  // 农场详情
  linkHomeFarm() {
    wx.navigateTo({
      url: '/pages/home-farm/index'
    })
  }
});
