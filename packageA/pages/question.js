import { request, imgUrl, https } from '../../utils/request.js'
import { getNowDate, routerLink } from '../../utils/common.js'
const app = getApp()

Page({
  data: {
    num: 0,
    questionList: "",
    radioValue: "",
    newQuestionList: [],
    showQuest:{},
    radioFlag: -1,
    imgUrl: {
      logo: imgUrl + "/text1.png",
    },
  },
  onLoad(query) {
    if (query.order) {
      this.setData({
        order: Number(query.order)
      })
    }
    this.getQuestionList();
  },
  //获取题目列表
  getQuestionList() {
    var that = this;
    request('/user/getQuestions', 'post', {
      token: wx.getStorageSync("token")
    }).then(res => {
      console.log(res)

      this.setData({
        questionList: res.objs.quests,
        showQuest: res.objs.quests[this.data.num]
      })
 
    })
  },
  //选择题目
  radioChange(e) {
    console.log(e)
    this.setData({
      radioValue: e.detail.value,
      radioFlag: e.target.dataset.index
    })
  },
  //点击下一题的时候如果
  nextQuestion() {
    var that = this;
    
    
    if (that.data.radioValue == "") {
      wx.showToast({
        title: '请先选择您的答案',
        icon: 'none'
      })
      return
    } else {
      this.setData({
        radioValue: "",
        showQuest: this.data.questionList[this.data.num],
      })
      //把当前的添加到新数组中
      this.data.newQuestionList.push({ title: this.data.showQuest.title, context: this.data.radioValue })
      this.setData({
        newQuestionList: this.data.newQuestionList
      })
      //如果大于等于的长度直接结束
      if (this.data.num >= this.data.questionList.length-1) {
        request('/user/answerQuestions', 'post', {
          token: wx.getStorageSync("token"),
          context: JSON.stringify(this.data.newQuestionList)
        }).then(res => {
          console.log(res)
          routerLink();
          return
        })
      }else{
        this.data.num++;
        this.setData({
          num: this.data.num,
          showQuest: this.data.questionList[this.data.num],
          radioFlag: -1
        })
      }
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
