import {request} from './request.js'
const app = getApp()
let that = this;


//判断页面跳转
let routerLink = () =>{
  request('/user/getUserStatus', 'post', {
    token: wx.getStorageSync("token")
  }).then(res => {
    console.log(res);
    //未答题
    // if (!res.objs.kxUserScoreInfo) {
    //   wx.redirectTo({
    //     url: '/packageA/pages/question'
    //   })
    //   return
    // }
    //农场的
    if (res.objs.farmList.length == 0) {
      wx.redirectTo({
        url: '/packageA/pages/question-end'
      })
      return
    } else {
      if (!wx.getStorageSync("farmId")) {
        wx.setStorageSync("farm", res.objs.farmList[0])
        wx.setStorageSync("farmId", res.objs.farmList[0].id)
        wx.setStorageSync("farmName", res.objs.farmList[0].name)
      }
      //地块的
      if (res.objs.farmList[0].kxCoteList.length == 0) {
        wx.redirectTo({
          url: '/pages/create-ground/index'
        })
        return
      } else {
        request('/farm/getFarmInfo', 'post', {
          token: wx.getStorageSync("token"),
          farmId: wx.getStorageSync("farmId"),
        }).then(res1 => {
          console.log(res1)
          if (res1.objs.kxBatchs.length == 0) {
            wx.redirectTo({
              url: '/pages/plant-start/index'
            })
            return
          } else {
            wx.setStorageSync("kxBatchId", res1.objs.kxBatchs[0].id),
            //如果都有
            wx.redirectTo({
              url: '/pages/index/index'
            })
          }
        })
      }
    }
  })
}


//获取当前的时间
let getNowDate = ()=> {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}


module.exports = {
  routerLink,
  getNowDate
}