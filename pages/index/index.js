import { request, imgUrl, https, httpsUrl} from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()

Page({
  data: {
    time: "请选择农事时间",
    imgUrl:{
      menu: imgUrl + '/menu.png',
      logo: imgUrl + '/logo.png',
      logo1: imgUrl + "/text1.png",
      camera: imgUrl + '/camera.png',
      user: imgUrl + '/user-2.png',
      complete: imgUrl + '/complete.png',
      nocomplete: imgUrl + '/no-complete.png',
      down: imgUrl + '/arrow1.png',
      top: imgUrl + '/top.png',
      close: imgUrl + '/close.png',
      xiala: imgUrl + '/xiala.png',
      jiankong: imgUrl + '/jiankong.png'
    },
    kxBatchId: "",//作物ID
    menuList: "",//一级菜单
    menuActiveId: "",//一级的ID
    templList: "",//模板list
    tempActiveId: "",//模板ID
    secondaryList: "",//步骤列表
    secondaryListId: "",//步骤ID
    otherActiveId: "",//肥料投入品选择的ID

    topModal:"",//头部弹窗
    repeatModal: "",//重复性事件弹窗
    bottomModal: "",//底部弹窗
    bottomList: "",//底部弹窗数据
    commonWorkInfoTemplList: "",//一级数据
    commonsList: "",//消毒投入品数据
    singlesList: "",//肥料投入品数据
    kxCropWorkTakeList: "",//采收数据

    status: "",//判断首页显示状态
    showImgs: "",//正常显示图文信息
    showInfos: "",//填写后的显示数据
    kxBatch: "",//批次信息

    cotesList: "",//所有的棚
    firstTree: [],//棚号
    secondTree: [],//农作物
    thirdTree: [],//批次
    threeList: [{ name: "暖棚", id: 0 }, { name: "冷棚", id: 1 }],
    pengActiveId: 0,//冷暖棚ID
    farmName: wx.getStorageSync("farmName"),//农场名称

    oneAttachIndex: 0,//一级的单位
    twoAttachIndex: 0,//二级的单位
    threeAttachIndex: 0,//三级的单位

    flagList: [],
    batchStatus: "",//批次状态
    recovery: "",//采收和底肥
    repetaId: "",//反复性事件id
    scrolltop: 0,//向下滚动的位置
    deviceNum: "",//设备数
    formId: "",//消息推送
    workTime: "",//农事时间
  },
  onLoad(query) {
    // wx.navigateTo({
    //   url: "/packageB/pages/add-plot"
    // })
    // return

    // 页面显示
    var that = this;

    if (wx.getStorageSync("farmId") || wx.getStorageSync("kxBatchId")) {
      this.init();
    } else {
      routerLink()
    }
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
  //点击监测按钮
  jianceFun(){
    wx.navigateTo({
       url: `/packageB/pages/facility-monitor?kxCote=${this.data.kxBatch.kxCote}`
    })
  },
  //页面初始化
  init(){
    var that = this;
    
    request('/work/getMenu', 'post', {
      formId: this.data.formId,
      token: wx.getStorageSync("token"),
      kxBatchId: wx.getStorageSync("kxBatchId") 
    }).then(res => {
      console.log(res)

      this.setData({
        menuList: res.objs.menuList,
        menuActiveId: res.objs.menuList[0].id,
        kxBatch: res.objs.kxBatch,
        deviceNum: res.objs.deviceNum
      })

      this.menuActiveInit(this.data.menuActiveId); 
    })
  },
  //主项点击
  menuActiveFun(e) {
    let id = e.target.dataset.id;
    this.setData({
      menuActiveId: id
    })
    this.menuActiveInit(id)
  },  
  //主项点击初始化
  menuActiveInit(id){
    request('/work/getStairInfo', 'post', {
      formId: this.data.formId,
      token: wx.getStorageSync("token"),
      kxBatchId: wx.getStorageSync("kxBatchId"),
      workId: id
    }).then(res => {
      console.log(res)
      wx.pageScrollTo({
        scrollTop: '0rpx', 
        duration: 100
      })
      this.setData({
        batchStatus: res.objs.batchStatus,
        kxCropWorkTakeList: res.objs.kxCropWorkTakeList,
        secondaryList: res.objs.secondaryList,
        templList: res.objs.templList,
        showInfos: res.objs.showInfos,
        showImgs: res.objs.showImgs,
        status: res.objs.status,
        workTime: res.objs.workTime
      })
      //如果有模板数据，默认选择第一个
      if (this.data.templList.length){
        this.setData({
          tempActiveId: res.objs.templList[0].id
        })
      }else{
        this.setData({
          tempActiveId: ""
        })
      } 
      //如果有步骤数据，默认选择第一个
      if (this.data.secondaryList.length){
        this.setData({
          secondaryListId: res.objs.secondaryList[0].id
        })
      }else {
        this.setData({
          secondaryListId: ""
        })
      } 
    })
  },
  //步骤点击
  secondaryActiveFun(e){
    let id = e.target.dataset.id || e.currentTarget.dataset.id;
    console.log(e)
    this.setData({
      secondaryListId: id
    })
    
    this.secondaryActiveInit(id)
  },
  //步骤点击初始化
  secondaryActiveInit(id){
    request('/work/getSecondInfo', 'post', {
      token: wx.getStorageSync("token"),
      kxBatchId: wx.getStorageSync("kxBatchId"),
      workId: id
    }).then(res => {
      console.log(res)
      wx.pageScrollTo({
        scrollTop: '0rpx',
        duration: 100
      })
      this.setData({
        status: res.objs.status,
        showInfos: res.objs.showInfos,
        showImgs: res.objs.showImgs,
        templList: res.objs.templList,
        workTime: res.objs.workTime
      })
      //如果有模板数据，默认选择第一个
      if (this.data.templList.length) {
        this.setData({
          tempActiveId: res.objs.templList[0].id
        })
        this.tempActiveInit(this.data.tempActiveId);
      } else {
        this.setData({
          tempActiveId: ""
        })
      }
    })
  },
  //模板点击的时候
  tempActiveFun(e){
    var that = this;
    let id = e.target.dataset.id || e.currentTarget.dataset.id;
    let name = e.target.dataset.name || e.currentTarget.dataset.name;

    this.setData({
      tempActiveId: id
    })
    if(name == "不消毒" || name == "无肥料"){
      wx.showModal({
        title: '提示',
        content: '您将直接结束当前农事环节，是否确定？',
        success(res) {
          if (res.confirm) {
            request('/work/workFinish', 'post', {
              token: wx.getStorageSync("token"),
              kxBatchId: wx.getStorageSync("kxBatchId"),
              workId1: that.data.menuActiveId,//一级ID
              workId2: that.data.secondaryListId,//步骤ID
            }).then(res1 => {
              console.log(res1)
              if (that.data.secondaryListId) {
                that.secondaryActiveInit(that.data.secondaryListId)
              } else {
                that.menuActiveInit(that.data.menuActiveId);
              }
            })
          } else {
            that.setData({
              tempActiveId: ""
            })
          }
        }
      })
    }else{
      this.tempActiveInit(id);
    }  
  },
  //模板数据初始化
  tempActiveInit(id){
    request('/work/getWorkTempletInfo', 'post', {
      token: wx.getStorageSync("token"),
      workTemplId: id
    }).then(res => {
      console.log(res)
      //如果没有workParentId，默认设置第一个，有的话循环整个数组，对应的显示
      this.setData({
        showImgs: res.objs.showImgs
      })
    })
  },
  //采收点击事件
  repeatFun(e) {
    let id = e.currentTarget.dataset.id;
    console.log(e)
    wx.navigateTo({
      url: `/pages/repeat-result/index?repetaId=${id}`
    })
  },
  // 点击拍照
  bottomModalFun() {
    this.setData({
      bottomModal: true
    })
    this.bottomModalInit();
  },
  //初始化底部弹窗数据
  bottomModalInit() { 
    var that = this;
    request('/work/getWorkInfo', 'post', {
      formId: this.data.formId,
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
        commonWorkInfoTemplList: res.objs.commonWorkInfoTemplList,
        recovery: res.objs.recovery
      })

      //定义数组控制展开功能
      this.data.commonsList.forEach((item,index)=>{
        that.data.flagList.push(false)
      })
    

      if (this.data.singlesList.length){
        this.data.singlesList.forEach((item,index)=>{
          if (item.info == true){
            item.groudMapList = JSON.parse(item.groudMapList)
            that.setData({
              singlesList: that.data.singlesList
            })
          }
        })
      }
    })
  },
  //下拉按钮
  xialaFun(){
    this.setData({
      scrolltop: this.data.scrolltop + 100
    })
  },
  //关闭底部弹窗
  closeBottom() {
    this.setData({
      bottomModal: false,
      flagList: [],
      // singlesList:[]
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
      sourceType: ['camera','album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
       
        const file = res.tempFiles[0];
        var lastIndex = file.path.lastIndexOf(".");
        var suffix = file.path.substr(lastIndex);

        request('/oss/info', 'post',{
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
              imgs.push({ path: getUrl})
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

    if (this.data.commonWorkInfoTemplList[index].attachArr.length){
      this.data.commonWorkInfoTemplList[index].attachVal = this.data.commonWorkInfoTemplList[index].attachArr[0];
    }
    this.setData({
      commonWorkInfoTemplList: this.data.commonWorkInfoTemplList
    })
  },
  //一级覆膜
  oneAttachChange: function (e) {
    const index = e.target.dataset.index
    console.log(index)
    this.setData({
      oneAttachIndex: e.detail.value
    })
    this.data.commonWorkInfoTemplList[index].attachVal = this.data.commonWorkInfoTemplList[index].attachArr[e.detail.value];
    this.setData({
      commonWorkInfoTemplList: this.data.commonWorkInfoTemplList
    })
  },
  //一级单位
  onePickerChange(e){
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
  copyFun(e){
    console.log(e)
    let id = e.target.dataset.id || e.currentTarget.dataset.id;
    let that = this;

    if (this.data.recovery == 1){
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
          that.repeatInit()
        })
      })
    }else{
      request('/work/saveWorkInfo', 'post', {
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
        request('/work/groudDuplicate', 'post', {
          token: wx.getStorageSync("token"),
          groudId: id
        }).then(res1 => {
          console.log(res1)
          that.bottomModalInit()
        })
      }) 
    }
  },
  //消毒投入品保存继续添加
  copyResult() {
    var that = this;
   
    request('/work/saveWorkInfo', 'post', {
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
      setTimeout(() => {
        if (this.data.recovery == 1) {
          this.setData({
            repetaId: res.objs.kxCropWorkTake.id
          })
          this.repeatInit()
        } else {
          this.bottomModalInit()
        }
      }, 2000)
    })
  },
  repeatInit() {
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
  otherTitleFun(e){
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
  // 底部弹窗点击确定
  bottomConfigFun() {
   
    var that = this;
    if (this.data.time == "请选择农事时间"){
      wx.showToast({
        title: "请选择农事时间",
        icon: 'none'
      })
      return
    }else{
      
      if (this.data.repetaId) {
        request('/repeat/updateWorkInfo', 'post', {
          formId: this.data.formId,
          workDate: this.data.time,
          token: wx.getStorageSync("token"),
          kxBatchId: wx.getStorageSync("kxBatchId"),
          repetaId: this.data.repetaId,//一级ID
          comms: JSON.stringify(this.data.commonsList),
          singles: JSON.stringify(this.data.singlesList),
          commonWorkInfoTemplList: JSON.stringify(this.data.commonWorkInfoTemplList)
        }).then(res => {
          console.log(res)
          this.setData({
            time: "请选择农事时间"
          })
          wx.redirectTo({
            url: `/pages/repeat-result/index?repetaId=${res.objs.kxCropWorkTake.id}`
          })
        })
      } else {
        request('/work/saveWorkInfo', 'post', {
          formId: this.data.formId,
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
          this.setData({
            bottomModal: false,
            flagList: [],
            time: "请选择农事时间"
          })

          if (this.data.secondaryListId) {
            this.secondaryActiveInit(this.data.secondaryListId)
          } else {
            this.menuActiveInit(this.data.menuActiveId)
          }
        })
      }
      
    } 
  },
 
  //单个节点点击完成
  childCompleted(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您将直接结束当前农事环节，是否确定？',
      success(res) {
        if (res.confirm) {
          request('/work/workFinish', 'post', {
            formId: that.data.formId,
            token: wx.getStorageSync("token"),
            kxBatchId: wx.getStorageSync("kxBatchId"),
            workId1: that.data.menuActiveId,//一级ID
            workId2: that.data.secondaryListId,//步骤ID
          }).then(res1 => {
            console.log(res1)
            if (that.data.secondaryListId) {
              that.secondaryActiveInit(that.data.secondaryListId)
            } else {
              that.menuActiveInit(that.data.menuActiveId);
            }           
          })
        } 
      }
    })
  },
  //头部弹窗
  choseBox(){
    this.setData({
      topModal: !this.data.topModal
    })
    if (this.data.topModal) {
      this.setData({
        pengActiveId: 0
      })
      this.topInit();
    }
  },
  //头部弹窗初始化
  topInit(){
    request('/work/getKxBatchChangeInfo', 'post', {
      token: wx.getStorageSync("token"),
      farmId: wx.getStorageSync("farmId")
    }).then(res => {
      console.log(res)
      this.setData({
        cotesList: res.objs,
        firstTree: res.objs.warmCotes
      })
      if (this.data.firstTree.length){
        this.setData({
          secondTree: res.objs.warmCotes[0].cropBatchs
        })
        if (this.data.secondTree.length){
          this.setData({
            thirdTree: res.objs.warmCotes[0].cropBatchs[0].batchs,
          })
          if (this.data.thirdTree.length){
            this.setData({
              kxBatchId: this.data.thirdTree[0].id
            })
          }
        }
      }else{
        this.setData({
          firstTree: [],
          secondTree: [],
          thirdTree: []
        })
      }  
    })
  },
  //点击冷暖棚
  choseBoxType(e){
    let id = e.target.dataset.id;
    this.setData({
      pengActiveId: id
    })
    if (id == 0) {
      this.setData({
        firstTree: this.data.cotesList.warmCotes,
      })
      if (this.data.firstTree.length){
        this.setData({
          secondTree: this.data.cotesList.warmCotes[0].cropBatchs
        })
        if (this.data.secondTree.length) {
          this.setData({
            thirdTree: this.data.secondTree[0].batchs,
            kxBatchId: this.data.secondTree[0].batchs[0].id
          })
        } else {
          this.setData({
            thirdTree: ""
          })
        }
      } else {
        this.setData({
          firstTree: [],
          secondTree: [],
          thirdTree: []
        })
      }
    } else {
     
      this.setData({
        firstTree: this.data.cotesList.coldCotes,
      })
      if (this.data.firstTree.length){
        this.setData({
          secondTree: this.data.cotesList.coldCotes[0].cropBatchs,
        })
        if (this.data.secondTree.length) {
          this.setData({
            thirdTree: this.data.secondTree[0].batchs,
            kxBatchId: this.data.secondTree[0].batchs[0].id
          })
        } else {
          this.setData({
            thirdTree: ""
          })
        }
      } else{
        this.setData({
          firstTree: [],
          secondTree: [],
          thirdTree: []
        })
      }
    }  
  },
  //选择种植作物
  bindChange: function (e) {
    let val = e.detail.value;
 
    if (this.data.pengActiveId == 0) {
      if (this.data.firstTree.length){
        this.setData({
          secondTree: this.data.cotesList.warmCotes[val[0]].cropBatchs,
        })
        if (this.data.secondTree.length) {
          this.setData({
            thirdTree: this.data.secondTree[val[1]].batchs,
            kxBatchId: this.data.secondTree[val[1]].batchs[val[2]].id
          })
        } else {
          this.setData({
            thirdTree: ""
          })
        }
      }
    } else {
      if (this.data.firstTree.length){
        this.setData({
          secondTree: this.data.cotesList.coldCotes[val[0]].cropBatchs,
        })
        if (this.data.secondTree.length) {
          this.setData({
            thirdTree: this.data.secondTree[val[1]].batchs,
            kxBatchId: this.data.secondTree[val[1]].batchs[val[2]].id
          })
        } else {
          this.setData({
            thirdTree: ""
          })
        }
      }
    }
 
  },
  //头部弹窗确定
  tapConfirm(){
    wx.setStorageSync("kxBatchId", this.data.kxBatchId);
    this.setData({
      topModal: !this.data.topModal,
    })

    this.init();
  },
  //tab弹出层
  repeatModalFun(){
    wx.navigateTo({
      url: "/pages/repeat-incident/index"
    })
  },
  //头部弹窗初始化
  tabModalInit(){
    request('/api/work/findRepeatFarmWork', 'get', {

    }).then(res => {
      console.log(res);
      this.setData({
        repetDate: res.data,
        repetActive: res.data[0].id
      })
    })
  },
  //关闭头部弹窗
  closeTap(){
    this.setData({
      tabModal: !this.data.tabModal
    }) 
  },
  //添加新批次
  linkPlantStartCrop(){
    wx.navigateTo({
      url: `/pages/plant-start/index?farmId=${this.data.farmId}`
    })
  },
  //管理农场
  linkHomeFarmList(){
    wx.navigateTo({
      url: "/packageB/pages/home-farm-lists"
    })
  },
  //点击user图标
  tapHome(){
    wx.navigateTo({
      url: `/packageB/pages/home?farmId=${this.data.farmId}`
    })
  },
  onReady() {
    // 页面加载完成
   
  },
  onShow() {
    var that = this
    wx.getStorage({
      key: 'farm',
      success(res) {
        console.log(res.data)
        that.setData({
          farmName: res.data.name
        })
      }
    })
    if (!wx.getStorageSync("farmId") || !wx.getStorageSync("kxBatchId")) {
      routerLink()
    }
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
    return { title: 'My App', desc: 'My App description', path: 'pages/index/index' };
  },
});
