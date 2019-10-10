import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()



Page({
  data: {
    imgUrl:{
      icon1: imgUrl +"/icon1.png",
      star: imgUrl+ "/star.png",
    },
    time: getNowDate(new Date()),
    concat: "",//联系人
    phone: "",//手机号
    email: "",//邮箱
    kxFarmStatus: "",//农场状态
    dataList: "",
    formId: ""
  },
  onLoad(query) {
 
    this.init();
  },
  submitFormId(e) {
    console.log('formid', e.detail.formId)
    this.setData({
      formId: e.detail.formId
    })
  },
  //页面初始化
  init() {
    request('/farm/getFarmImgInfo', 'post', {
      token: wx.getStorageSync("token"),
      farmId: wx.getStorageSync("farmId")
    }).then(res => {
      console.log(res)
      
      this.setData({
        kxFarmStatus: res.objs.kxFarmStatus,
        dataList: res.objs.farmImgInfo,
        time: res.objs.farmImgInfo.operatingDateStr,
        concat: res.objs.farmImgInfo.contactsPersion,//联系人
        phone: res.objs.farmImgInfo.contactsPhone,//手机号
        email: res.objs.farmImgInfo.contactsMail,//邮箱
      })
      if (this.data.time == null){
        this.setData({
          time: getNowDate(new Date())
        })
      }
    })
  },
  //获取input的值
  onBlur(e) {
    const param = e.target.dataset.param
    if (param == 'time') {
      this.setData({
        time: e.detail.value
      })
    } else if (param == 'concat') {
      this.setData({
        concat: e.detail.value
      })
    } else if (param == 'phone') {
      this.setData({
        phone: e.detail.value
      })
    } else if (param == 'email') {
      this.setData({
        email: e.detail.value
      })
    }
  },
  // chooseImage(e) {
  //   var that = this;
  //   let name = e.target.dataset.name;
  //   console.log(name)
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['original'],
  //     sourceType: ['album', 'camera'],
  //     success(res) {
  //       // tempFilePath可以作为img标签的src属性显示图片
  //       console.log(res)
  //       wx.showLoading({
  //         title: '保存中',
  //         mask: true
  //       })
  //       wx.uploadFile({
  //         url: https + '/farm/upload', //仅为示例，非真实的接口地址
  //         filePath: res.tempFilePaths[0],
  //         name: 'file',
  //         formData: {
  //           token: wx.getStorageSync("token"),
  //           farmId: wx.getStorageSync("farmId")
  //         },
  //         success: function (res1) {
  //           console.log(res1)
  //           wx.hideLoading()
  //           let resData = JSON.parse(res1.data);

  //           if (name =="userIdCardBack"){
  //             that.data.dataList.userIdCardBack = resData.objs.fileName;
  //           } else if (name == "userIdCardForword") {
  //             that.data.dataList.userIdCardForword = resData.objs.fileName;
  //           } else if (name == "userQuaBusiness") {
  //             that.data.dataList.userQuaBusiness = resData.objs.fileName;
  //           } else if (name == "userQuaOther") {
  //             that.data.dataList.userQuaOther = resData.objs.fileName;
  //           } else if (name == "userGradeCert") {
  //             that.data.dataList.userGradeCert = resData.objs.fileName;
  //           } else if (name == "userGradeOther") {
  //             that.data.dataList.userGradeOther = resData.objs.fileName;
  //           } else if (name == "userFarmBack") {
  //             that.data.dataList.userFarmBack = resData.objs.fileName;
  //           } else if (name == "userFarmForward") {
  //             that.data.dataList.userFarmForward = resData.objs.fileName;
  //           } else if (name == "represent") {
  //             that.data.dataList.represent = resData.objs.fileName;
  //           } else if (name == "log") {
  //             that.data.dataList.log = resData.objs.fileName;
  //           }

  //           that.setData({
  //             dataList: that.data.dataList
  //           })
  //         }
  //       })
  //     }
  //   })
  // },
  chooseImage(e) {
    let nameStr = e.target.dataset.name;
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['camera', 'album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        
        const file = res.tempFiles[0];
        var lastIndex = file.path.lastIndexOf(".");
        var suffix = file.path.substr(lastIndex);

        request('/oss/info', 'post', {
          token: wx.getStorageSync("token"),
          kxBatchId: wx.getStorageSync("kxBatchId"),
        }).then(res1 => {
          console.log(res1)
          wx.showLoading({
            title: '上传中',
            mask: true
          })
          var json = res1.objs.oss
          var ossUrl = json.host
          var nameStart = new Date().getTime() + "" + Math.ceil(Math.random() * 100)
          var name = "/" + nameStart + suffix
          var getUrl = json.host + "/" + json.dir + "/" + name

          wx.uploadFile({
            url: res1.objs.oss.host, //仅为示例，非真实的接口地址
            filePath: res.tempFilePaths[0],
            name: 'file',
            header: {
              "Access-Control-Allow-Origin": "*"
            },
            formData: {
              "OSSAccessKeyId": json.accessid,
              "policy": json.policy,
              "Signature": json.signature,
              "keys": json.dir + "/",
              "key": json.dir + "/" + name,
              "success_action_status": 200,
              // "callback": json.callback,
              "type": "image/jpeg",
            },
            success: function (res2) {
              console.log(res2)
              wx.hideLoading()
              if (nameStr == "userIdCardBack") {
                that.data.dataList.userIdCardBack = getUrl;
              } else if (nameStr == "userIdCardForword") {
                that.data.dataList.userIdCardForword = getUrl;
              } else if (nameStr == "userQuaBusiness") {
                that.data.dataList.userQuaBusiness = getUrl;
              } else if (nameStr == "userQuaOther") {
                that.data.dataList.userQuaOther = getUrl;
              } else if (nameStr == "userGradeCert") {
                that.data.dataList.userGradeCert = getUrl;
              } else if (nameStr == "userGradeOther") {
                that.data.dataList.userGradeOther = getUrl;
              } else if (nameStr == "userFarmBack") {
                that.data.dataList.userFarmBack = getUrl;
              } else if (nameStr == "userFarmForward") {
                that.data.dataList.userFarmForward = getUrl;
              } else if (nameStr == "represent") {
                that.data.dataList.represent = getUrl;
              } else if (nameStr == "log") {
                that.data.dataList.log = getUrl;
              }

              that.setData({
                dataList: that.data.dataList
              })
            },
            fail: function (err) {
              console.log(err)
              wx.showToast({
                title: "上传失败",
                icon: 'none'
              })
            }
          })
        })
      }
    })
  },
  //时间选择
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  btnFun(){
    var that = this;
    let tel = /^\d{11}$/;
    let email = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    console.log(this.data.phone)
    if (this.data.phone != "" && this.data.phone != null ){
      if (tel.test(this.data.phone) == false) {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
          duration: 3000
        })
        return
      }
    } 
    if (this.data.email != "" && this.data.email != null){
      if (email.test(this.data.email) == false) {
        wx.showToast({
          title: '请输入正确的邮箱',
          icon: 'none',
          duration: 3000
        })
        return 
      }
    }

    request('/farm/saveFarmImgInfo', 'post', {
      formId: this.data.formId,
      token: wx.getStorageSync("token"),
      id: this.data.dataList.id,
      userIdCardForword: this.data.dataList.userIdCardForword,
      userIdCardBack: this.data.dataList.userIdCardBack,
      userQuaBusiness: this.data.dataList.userQuaBusiness,
      userQuaOther: this.data.dataList.userQuaOther,
      userGradeCert: this.data.dataList.userGradeCert,
      userGradeOther: this.data.dataList.userGradeOther,
      userFarmForward: this.data.dataList.userFarmForward,
      userFarmBack: this.data.dataList.userFarmBack,
      represent: this.data.dataList.represent,
      log: this.data.dataList.log,
      operatingDateStr: this.data.time,
      contactsPhone: this.data.phone,
      contactsMail: this.data.email,
      contactsPersion: this.data.concat
    }).then(res => {
      console.log(res)
      wx.showToast({
        title: '提交成功',
        duration: 3000
      })

      setTimeout(() => {
        that.init();
      }, 1000)
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
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
});
