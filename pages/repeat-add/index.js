import { request, imgUrl, https, httpsUrl} from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    repetaId: "",
    menuActiveId:"",//事件ID
    tempActiveId: "",
    secondaryListId: "",
    time: "请选择农事时间", 
    bottomList: "",//底部弹窗数据
    commonWorkInfoTemplList: "",//一级数据
    commonsList: "",//消毒投入品数据
    singlesList: "",//肥料投入品数据
    otherActiveId: "",//肥料投入品选择的ID
    oneAttachIndex: 0,//一级的单位
    twoAttachIndex: 0,//二级的单位
    threeAttachIndex: 0,//三级的单位
    flagList: [],//控制展开
    imgUrl: {
      down: imgUrl + '/arrow1.png',
      top: imgUrl + '/top.png',
    },
    formId: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      repetaId: options.repetaId || "" ,
      menuActiveId: options.menuActiveId || "",
      tempActiveId: options.tempActiveId || "",
      formId: options.formId || ""
    })
    if (this.data.repetaId){
      this.repeatInit()
    }else{
      this.init();
    }
  },
  init() {
    var that = this;
    request('/repeat/getAddWorkInfo', 'post', {
      formId: this.data.formId,
      token: wx.getStorageSync("token"),
      kxBatchId: wx.getStorageSync("kxBatchId"),
      workId1: this.data.menuActiveId,//一级ID
      workTemplId: this.data.tempActiveId,//模板ID 
    }).then(res => {
      console.log(res)
      this.setData({
        bottomList: res.objs,
        commonsList: res.objs.commons,
        singlesList: res.objs.singles,
        commonWorkInfoTemplList: res.objs.commonWorkInfoTemplList
      })

      //定义数组控制展开功能
      this.data.commonsList.forEach((item, index) => {
        that.data.flagList.push(false)
      })
    })
  },
  repeatInit(){
    var that = this;
    request('/repeat/getWorkInfo', 'post', {
      token: wx.getStorageSync("token"),
      kxBatchId: wx.getStorageSync("kxBatchId"),
      repetaId: this.data.repetaId,//一级ID
    }).then(res => {
      console.log(res)
      this.setData({
        bottomList: res.objs,
        commonsList: res.objs.commons,
        secondaryList: res.objs.singles,
        commonWorkInfoTemplList: res.objs.commonWorkInfoTemplList
      })
      //定义数组控制展开功能
      this.data.commonsList.forEach((item, index) => {
        that.data.flagList.push(false)
      })
    })
  },
  //选中
  selectFun(e){
    let id = e.target.dataset.id;
    let index = e.target.dataset.index;
    
    this.setData({
      selectActiveId: id,
      commonWorkInfoTemplList: this.data.selectList[index].kxRepeatWorkInfoTemplets
    })
 
  },
  //时间选择
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  //一级点击拍照
  chooseImg(e) {
    const index = e.target.dataset.index;
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
              // let resData = JSON.parse(res2.data);

              //上传成功后添加到每个子项的contextParams中
              let imgs = that.data.commonWorkInfoTemplList[index].imgs;
              imgs.push({ path: getUrl })
              //重新赋值整个对象
              // const obj = {...that.data.workParentList}
              that.setData({
                commonWorkInfoTemplList: that.data.commonWorkInfoTemplList
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
  // chooseImg(e) {
  //   const index = e.target.dataset.index;
  //   var that = this;
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['original'],
  //     sourceType: ['album', 'camera'],
  //     success(res) {
  //       // tempFilePath可以作为img标签的src属性显示图片
  //       console.log(res)
  //       wx.showLoading({
  //         title: '上传中',
  //         mask: true
  //       })
  //       wx.uploadFile({
  //         url: httpsUrl + '/upload/work', //仅为示例，非真实的接口地址
  //         filePath: res.tempFilePaths[0],
  //         name: 'file',
  //         formData: {
  //           token: wx.getStorageSync("token"),
  //           kxBatchId: wx.getStorageSync("kxBatchId")
  //         },
  //         success: function (res1) {
  //           console.log(res1)
  //           wx.hideLoading()
  //           let resData = JSON.parse(res1.data);

  //           //上传成功后添加到每个子项的contextParams中
  //           let imgs = that.data.commonWorkInfoTemplList[index].imgs;
  //           imgs.push({ path: resData.objs.fileName })
  //           //重新赋值整个对象
  //           // const obj = {...that.data.workParentList}
  //           that.setData({
  //             commonWorkInfoTemplList: that.data.commonWorkInfoTemplList
  //           })
  //         }
  //       })
  //     }
  //   })
  // },
  //一级删除图片
  oneDelImgFun(e) {
    const id = e.target.dataset.id;
    let oneIndex = e.target.dataset.oneindex;
    let twoIndex = e.target.dataset.twoindex;
    console.log(oneIndex, twoIndex)
    if (id) {
      request('/work/delWorkInfoImg', 'post', {
        token: wx.getStorageSync("token"),
        imgId: id
      }).then(res => {
        console.log(res)

        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
        this.bottomModalInit();
      })
    } else {
      this.data.commonWorkInfoTemplList[oneIndex].imgs.splice(twoIndex, 1)
      this.setData({
        commonWorkInfoTemplList: this.data.commonWorkInfoTemplList
      })
    }
  },
  // 一级添加文字信息
  changeTxt(e) {
    const index = e.target.dataset.index
    //添加到每个子项的contextParams中
    this.data.commonWorkInfoTemplList[index].context = e.detail.value;

    if (this.data.commonWorkInfoTemplList[index].attachArr.length) {
      this.data.commonWorkInfoTemplList[index].attachVal = this.data.commonWorkInfoTemplList[index].attachArr[0];
    }
    this.setData({
      commonWorkInfoTemplList: this.data.commonWorkInfoTemplList
    })
  },
  //一级覆膜
  oneAttachChange: function (e) {
    const index = e.target.dataset.index
    this.setData({
      oneAttachIndex: e.detail.value
    })
    this.data.commonWorkInfoTemplList[index].attachVal = this.data.commonWorkInfoTemplList[index].attachArr[e.detail.value];
    this.setData({
      commonWorkInfoTemplList: this.data.commonWorkInfoTemplList
    })
  },
  //一级单位
  onePickerChange(e) {
    const val = e.detail.value
    const index = e.target.dataset.index
    this.data.commonWorkInfoTemplList[index].attachVal = this.data.commonWorkInfoTemplList[index].attachArr[val[0]];
    this.setData({
      commonWorkInfoTemplList: this.data.commonWorkInfoTemplList
    })
  },
  //点击消毒投入品or斟酌投入品

  childTouruFun: function (e) {
    let index = e.target.dataset.index || e.currentTarget.dataset.index;
    this.data.commonsList[index].show = !this.data.commonsList[index].show;
    this.data.flagList[index] = !this.data.flagList[index]

    //重新赋值整个对象
    this.setData({
      flagList: this.data.flagList,
      commonsList: this.data.commonsList
    })
  },
  //消毒投入品点击拍照
  childChooseImg(e) {
    let oneIndex = e.target.dataset.oneindex;
    let twoIndex = e.target.dataset.twoindex;
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
              // let resData = JSON.parse(res2.data);

              //上传成功后添加到每个子项的contextParams中
              let imgs = that.data.commonsList[oneIndex].workInfoTempls[twoIndex].imgs;
              imgs.push({ path: getUrl })
              //重新赋值整个对象
              // const obj = {...that.data.workParentList}
              that.setData({
                commonsList: that.data.commonsList
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
  // childChooseImg(e) {
  //   let oneIndex = e.target.dataset.oneindex;
  //   let twoIndex = e.target.dataset.twoindex;
  //   console.log(e)
  //   var that = this;
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['original'],
  //     sourceType: ['album', 'camera'],
  //     success(res) {
  //       // tempFilePath可以作为img标签的src属性显示图片
  //       console.log(res)
  //       wx.showLoading({
  //         title: '上传中',
  //         mask: true
  //       })
  //       wx.uploadFile({
  //         url: httpsUrl + '/upload/work', //仅为示例，非真实的接口地址
  //         filePath: res.tempFilePaths[0],
  //         name: 'file',
  //         formData: {
  //           token: wx.getStorageSync("token"),
  //           kxBatchId: wx.getStorageSync("kxBatchId")
  //         },
  //         success: function (res1) {
  //           console.log(res1)
  //           wx.hideLoading()
  //           let resData = JSON.parse(res1.data);

  //           //上传成功后添加到每个子项的contextParams中
  //           let imgs = that.data.commonsList[oneIndex].workInfoTempls[twoIndex].imgs;
  //           imgs.push({ path: resData.objs.fileName })
  //           //重新赋值整个对象
  //           // const obj = {...that.data.workParentList}
  //           that.setData({
  //             commonsList: that.data.commonsList
  //           })
  //         }
  //       })
  //     }
  //   })
  // },
  //消毒投入品删除图片
  twoDelImgFun(e) {
    const id = e.target.dataset.id;
    let oneIndex = e.target.dataset.oneindex;
    let twoIndex = e.target.dataset.twoindex;
    if (id) {
      request('/work/delWorkInfoImg', 'post', {
        token: wx.getStorageSync("token"),
        imgId: id
      }).then(res => {
        console.log(res)

        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
        this.bottomModalInit();
      })
    } else {
      this.data.commonsList[oneIndex].workInfoTempls[twoIndex].imgs.splice(0, 1)
      this.setData({
        commonsList: this.data.commonsList
      })
    }
  },
  //消毒投入品添加文字信息
  childChangeTxt(e) {
    let oneIndex = e.target.dataset.oneindex;
    let twoIndex = e.target.dataset.twoindex;
    //添加到每个子项的contextParams中
    this.data.commonsList[oneIndex].workInfoTempls[twoIndex].context = e.detail.value;

    if (this.data.commonsList[oneIndex].workInfoTempls[twoIndex].attachArr.length) {
      this.data.commonsList[oneIndex].workInfoTempls[twoIndex].attachVal = this.data.commonsList[oneIndex].workInfoTempls[twoIndex].attachArr[0];
    }

    this.setData({
      commonsList: this.data.commonsList
    })
  },
  //消毒投入平附魔
  twoAttachChange: function (e) {
    let oneIndex = e.target.dataset.oneindex;
    let twoIndex = e.target.dataset.twoindex;
    this.setData({
      twoAttachIndex: e.detail.value
    })
    this.data.commonsList[oneIndex].workInfoTempls[twoIndex].attachVal = this.data.commonsList[oneIndex].workInfoTempls[twoIndex].attachArr[e.detail.value];
    this.setData({
      commonsList: this.data.commonsList
    })
  },
  //消毒投入平单位
  twoPickerChange(e) {
    const val = e.detail.value
    let oneIndex = e.target.dataset.oneindex;
    let twoIndex = e.target.dataset.twoindex;

    this.data.commonsList[oneIndex].workInfoTempls[twoIndex].attachVal = this.data.commonsList[oneIndex].workInfoTempls[twoIndex].attachArr[val[0]];
    this.setData({
      commonsList: this.data.commonsList
    })
  },
  //消毒投入品无限复制
  copyFun(e) {
    console.log(e)
    let id = e.target.dataset.id || e.currentTarget.dataset.id;
    let that = this;
    request('/repeat/updateWorkInfo', 'post', {
      workDate: this.data.time,
      token: wx.getStorageSync("token"),
      kxBatchId: wx.getStorageSync("kxBatchId"),
      repetaId: this.data.repetaId,//一级ID
      comms: JSON.stringify(this.data.commonsList),
      singles: JSON.stringify(this.data.singlesList),
      commonWorkInfoTemplList: JSON.stringify(this.data.commonWorkInfoTemplList)
    }).then(res => {
      console.log(res)
      request('/repeat/groudDuplicate', 'post', {
        token: wx.getStorageSync("token"),
        groudId: id
      }).then(res1 => {
        console.log(res1)
        that.bottomModalInit()
      })
    })
  },
  //消毒投入品保存
  copyResult() {
    var that = this;
    
    request('/repeat/saveWorkInfo', 'post', {
      workDate: this.data.time,
      token: wx.getStorageSync("token"),
      kxBatchId: wx.getStorageSync("kxBatchId"),
      workId1: this.data.menuActiveId,//一级ID
      workId2: this.data.secondaryListId,//步骤ID
      workTemplId: this.data.tempActiveId,//模板ID 
      singles: JSON.stringify(this.data.singlesList),
      comms: JSON.stringify(this.data.commonsList),
      commonWorkInfoTemplList: JSON.stringify(this.data.commonWorkInfoTemplList)
    }).then(res => {
      console.log(res)
      wx.showToast({
        title: "保存成功",
        icon: 'none',
        duration: 3000
      })
      setTimeout(()=>{
        this.setData({
          repetaId: res.objs.kxCropWorkTake.id
        })
        this.bottomModalInit()
      },2000)
    })
  },
  //点击肥料投入品
  otherTouruFun: function (e) {
    let index = e.target.dataset.index || e.currentTarget.dataset.index;
    this.data.singlesList[index].show = !this.data.singlesList[index].show;

    //重新赋值整个对象
    this.setData({
      singlesList: this.data.singlesList
    })

  },
  //点击选择什么肥料
  otherTitleFun(e) {
    let id = e.target.dataset.id || e.currentTarget.dataset.id;
    let oneIndex = e.target.dataset.oneindex || e.currentTarget.dataset.oneindex;
    let twoIndex = e.target.dataset.twoindex || e.currentTarget.dataset.twoindex;

    this.data.singlesList[oneIndex].showObj = this.data.singlesList[oneIndex].groudMapList[twoIndex].workInfoTempls;

    this.setData({
      otherActiveId: id,
      singlesList: this.data.singlesList
    })
  },
  //肥料投入品删除照片
  threeDelImgFun(e) {
    const id = e.target.dataset.id;
    let oneIndex = e.target.dataset.oneindex;
    let twoIndex = e.target.dataset.twoindex;
    if (id) {
      request('/work/delWorkInfoImg', 'post', {
        token: wx.getStorageSync("token"),
        imgId: id
      }).then(res => {
        console.log(res)

        wx.showToast({
          title: '删除成功',
          icon: 'none'

        })
        this.bottomModalInit();
      })
    } else {
      this.data.singlesList[oneIndex].showObj[twoIndex].imgs.splice(0, 1)
      this.setData({
        singlesList: this.data.singlesList
      })
    }
  },
  //肥料投入品点击拍照
  otherChooseImg(e) {
    let oneIndex = e.target.dataset.oneindex;
    let twoIndex = e.target.dataset.twoindex;
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
              // let resData = JSON.parse(res2.data);

              //上传成功后添加到每个子项的contextParams中
              let imgs = that.data.singlesList[oneIndex].showObj[twoIndex].imgs;
              imgs.push({ path: getUrl })
              //重新赋值整个对象
              // const obj = {...that.data.workParentList}
              that.setData({
                singlesList: that.data.singlesList
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
  // otherChooseImg(e) {
  //   let oneIndex = e.target.dataset.oneindex;
  //   let twoIndex = e.target.dataset.twoindex;
  //   console.log(e)
  //   var that = this;
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['original'],
  //     sourceType: ['album', 'camera'],
  //     success(res) {
  //       // tempFilePath可以作为img标签的src属性显示图片
  //       console.log(res)
  //       wx.showLoading({
  //         title: '上传中',
  //         mask: true
  //       })
  //       wx.uploadFile({
  //         url: httpsUrl + '/upload/work', //仅为示例，非真实的接口地址
  //         filePath: res.tempFilePaths[0],
  //         name: 'file',
  //         formData: {
  //           token: wx.getStorageSync("token"),
  //           kxBatchId: wx.getStorageSync("kxBatchId")
  //         },
  //         success: function (res1) {
  //           console.log(res1)
  //           wx.hideLoading()
  //           let resData = JSON.parse(res1.data);

  //           //上传成功后添加到每个子项的contextParams中
  //           let imgs = that.data.singlesList[oneIndex].showObj[twoIndex].imgs;
  //           imgs.push({ path: resData.objs.fileName })
  //           //重新赋值整个对象
  //           // const obj = {...that.data.workParentList}
  //           that.setData({
  //             singlesList: that.data.singlesList
  //           })
  //         }
  //       })
  //     }
  //   })
  // },
  //肥料投入品添加文字信息
  otherChangeTxt(e) {
    let oneIndex = e.target.dataset.oneindex;
    let twoIndex = e.target.dataset.twoindex;
    //添加到每个子项的contextParams中
    this.data.singlesList[oneIndex].showObj[twoIndex].context = e.detail.value;

    if (this.data.singlesList[oneIndex].showObj[twoIndex].attachArr.length) {
      this.data.singlesList[oneIndex].showObj[twoIndex].attachVal = this.data.singlesList[oneIndex].showObj[twoIndex].attachArr[0];
    }
    this.setData({
      singlesList: this.data.singlesList
    })
  },
  //肥料投入平覆膜
  threeAttachChange: function (e) {
    let oneIndex = e.target.dataset.oneindex;
    let twoIndex = e.target.dataset.twoindex;
    this.setData({
      threeAttachIndex: e.detail.value
    })
    this.data.singlesList[oneIndex].showObj[twoIndex].attachVal = this.data.singlesList[oneIndex].showObj[twoIndex].attachArr[e.detail.value];
    this.setData({
      singlesList: this.data.singlesList
    })
  },
  //肥料投入平单位
  threePickerChange(e) {
    const val = e.detail.value
    let oneIndex = e.target.dataset.oneindex;
    let twoIndex = e.target.dataset.twoindex;

    this.data.singlesList[oneIndex].showObj[twoIndex].attachVal = this.data.singlesList[oneIndex].showObj[twoIndex].attachArr[val[0]];
    this.setData({
      singlesList: this.data.singlesList
    })
    console.log(this.data.singlesList)
  },
  //初始化底部弹窗数据
  bottomModalInit() {
    var that = this;
    request('/repeat/getWorkInfo', 'post', {
      token: wx.getStorageSync("token"),
      kxBatchId: wx.getStorageSync("kxBatchId"),
      repetaId: this.data.repetaId,//一级ID
    }).then(res => {
      console.log(res)
      this.setData({
        bottomList: res.objs,
        singlesList: res.objs.singles,
        commonsList: res.objs.commons,
        commonWorkInfoTemplList: res.objs.commonWorkInfoTemplList
      })

      //定义数组控制展开功能
      this.data.commonsList.forEach((item, index) => {
        that.data.flagList.push(false)
      })


      if (this.data.singlesList.length) {
        this.data.singlesList.forEach((item, index) => {
          if (item.info == true) {
            item.groudMapList = JSON.parse(item.groudMapList)
            that.setData({
              singlesList: that.data.singlesList
            })
          }
        })
      }
    })
  },
  // 底部弹窗点击确定
  bottomConfigFun() {
    var that = this;
    if(this.data.time == "请选择农事时间"){
      wx.showToast({
        title: "请选择农事时间",
        icon: 'none'
      })
      return
    }else{
      setTimeout(() => {
        if (that.data.repetaId) {
          request('/repeat/updateWorkInfo', 'post', {
            workDate: that.data.time,
            token: wx.getStorageSync("token"),
            kxBatchId: wx.getStorageSync("kxBatchId"),
            repetaId: that.data.repetaId,//一级ID
            comms: JSON.stringify(that.data.commonsList),
            singles: JSON.stringify(that.data.singlesList),
            commonWorkInfoTemplList: JSON.stringify(that.data.commonWorkInfoTemplList)
          }).then(res => {
            console.log(res)
            wx.redirectTo({
              url: `/pages/repeat-result/index?repetaId=${res.objs.kxCropWorkTake.id}`
            })
          })
        } else {
          request('/repeat/saveWorkInfo', 'post', {
            workDate: that.data.time,
            token: wx.getStorageSync("token"),
            kxBatchId: wx.getStorageSync("kxBatchId"),
            workId1: that.data.menuActiveId,//一级ID
            workTemplId: that.data.tempActiveId,//模板ID 
            comms: JSON.stringify(that.data.commonsList),
            singles: JSON.stringify(that.data.singlesList),
            commonWorkInfoTemplList: JSON.stringify(that.data.commonWorkInfoTemplList)
          }).then(res => {
            console.log(res)
            wx.redirectTo({
              url: `/pages/repeat-result/index?repetaId=${res.objs.kxCropWorkTake.id}`
            })
          })
        }
      }, 500) 
    }
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