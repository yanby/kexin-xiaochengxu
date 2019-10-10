import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()

Page({
  data: {
    id: "",
    name: "",//设别名
    type: "",//类型
    code: "",//编号
    result: "",//二维码数据
    shebeiId: "",//设备ID
    formId: ""
  },
  onLoad(query) {
    this.setData({
      id: query.id || "",
      name: query.name,
      type: query.type,
      code: query.code,
      result: query.result,
      shebeiId: query.shebeiId
    })
  },
  submitFormId(e) {
    console.log('formid', e.detail.formId)
    this.setData({
      formId: e.detail.formId
    })
  },
  //点击扫码
  // saomaFun(){
  //   var that = this;
  //   wx.scanCode({
  //     success(res) {
  //       console.log(res)
  //       that.setData({
  //         result: res.result
  //       })

  //       request('/inductor/getDeviceInfo', 'post', {
  //         token: wx.getStorageSync("token"),
  //         kxCote: that.data.id,
  //         qrCode: res.result
  //       }).then(res1 => {
  //         console.log(res1)
  //         that.setData({
  //           name: res1.objs.name,
  //           type: res1.objs.type,
  //           code: res1.objs.num,
  //           shebeiId: res1.objs.id
  //         })
  //       })
  //     },
  //     fail(res){
  //       that.setData({
  //         name: "",
  //         type: "",
  //         code: ""
  //       })
  //     }
  //   })
  // },
  //结束标注
  jieshuFun(){
    if (this.data.name == "" || this.data.type == "" || this.data.code == ""){
      wx.showToast({
        title: '请扫码识别设备',
        icon: 'none'
      })
    }else{
      request('/inductor/bindDevice', 'post', {
        formId: this.data.formId,
        token: wx.getStorageSync("token"),
        qrCode: this.data.result,
        name: this.data.name,
        num: this.data.code,
        type: this.data.type,
        kxCote: this.data.id,
        id: this.data.shebeiId
      }).then(res => {
        console.log(res)
        wx.showToast({
          title: '绑定成功',
          icon: 'none'
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1,
          })
        },2000)
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
