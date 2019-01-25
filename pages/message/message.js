// pages/message/message.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonDisabled: false,
    modalHidden: true,
    userInfo: {},
    hasUserInfo: false,
    //判断小程序的组件在当前版本是否可用
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    messages: [],
    no: '',
    title: '',
    authormessages: new Array(),//作者回复信息
    authorBool: new Array(),//显示回复数组
    ishave: false , //是否有筛选留言（是否显示赞）
    status: new Array(),//点赞的状态
    goodarray: new Array(),//所有点赞数
    isTop: new Array(),//置顶留言
    g_id: '' //公众号id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that = this;
    console.log("留言页面的公众号编号为:" + option.g_id)
    that.setData({
      title: option.title,
      no: option.no,
      g_id: option.g_id
    })

    //获取已精选留言内容
    that.getChooseCotent();

    // 如果获取到用户信息就存储
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      wx.setStorageSync('username', that.data.userInfo.nickName)
      wx.setStorageSync('headpath', that.data.userInfo.avatarUrl)
      console.log("在index页面全局app1中获取到的用户信息为：" + that.data.userInfo.nickName + " " + that.data.userInfo.avatarUrl);
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        // console.log("用户名2：" + res.userInfo.nickName + " " + res.userInfo.avatarUrl)
        // wx.setStorageSync('username', res.userInfo.nickName)
        // wx.setStorageSync('headpath', res.userInfo.avatarUrl)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('username', that.data.userInfo.nickName)
        wx.setStorageSync('headpath', that.data.userInfo.avatarUrl)
        console.log("在index页面全局app2中获取到的用户信息为：" + that.data.userInfo.nickName + " " + that.data.userInfo.avatarUrl);
      }
    } else {
      // 没有获取到用户信息就发起授权窗口
      wx.getUserInfo({
        success: res => {
          // console.log("用户名3：" + res.userInfo.nickName + " " + res.userInfo.avatarUrl)
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          wx.setStorageSync('username', that.data.userInfo.nickName)
          wx.setStorageSync('headpath', that.data.userInfo.avatarUrl)
          console.log("在index页面全局app3中获取到的用户信息为：" + that.data.userInfo.nickName + " " + that.data.userInfo.avatarUrl);
        },
      })
    }
  },

  //授权弹窗
  //点击按钮授权
  getUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      wx.setStorageSync('username', that.data.userInfo.nickName)
      wx.setStorageSync('headpath', that.data.userInfo.avatarUrl)
      console.log("在index页面临时授权中获取到的用户信息为：" + that.data.userInfo.nickName + " " + that.data.userInfo.avatarUrl);
    } else {
      console.log('用户取消授权');
      return;
    }
  },

  //获取已精选留言内容
  getChooseCotent: function (){
    var that = this;
    wx.request({
      url: '自己服务器API', //获取已精选留言内容
      data: {
        no: that.data.no,  //文章编号 
        ischeckmessage: '1', //留言是否经过筛选
        g_id: that.data.g_id,  //公众号 id
        openid: wx.getStorageSync('openid'), //用户唯一标识
      },
      header: {
        'content-type': 'application/json' // 数据格式（默认值）
      },
      method: 'post', //上传方式
      success: function (res) {   //回调成功
        console.log(res.data)
        if (res.statusCode == 200) {
          if (res.data.result == '1') {
            var posts_message = res.data.content;
            console.log(posts_message)
            if (posts_message.length == 0) {
              wx.showToast({
                title: '还没有用户留言',
                icon: 'none',
              })
            } else {
              var arraymessage = new Array(res.data.content.length);
              var isReplyArray = new Array(res.data.content.length);
              var isstatus = new Array(res.data.content.length);
              var goodarr = new Array(res.data.content.length);
              var istop = new Array(res.data.content.length);
              for (var i = 0; i < res.data.content.length; i++) {
                goodarr[i] = posts_message[i].zanCounts
                if (posts_message[i].istop == "1") {
                  //判断是否置顶
                  console.log(posts_message[i].istop)
                  istop[i] = true
                } else {
                  istop[i] = false
                }
                if (posts_message[i].iszan == "1") {
                  
                  isstatus[i] = false;
                } else {
                  isstatus[i] = true;
                }
                if (posts_message[i].authorMesContent != "") {
                  isReplyArray[i] = true;
                  arraymessage[i] = posts_message[i].authorMesContent;
                } else {
                  isReplyArray[i] = false;
                }
              }
              that.setData({
                ishave: true,
                status: isstatus,//是否已经点赞
                messages: posts_message,//所有留言信息
                authormessages: arraymessage,//作者回复内容
                authorBool: isReplyArray,//作者是否回复
                goodarray: goodarr,//赞的总数
                isTop: istop //是否置顶
              })
            }
          } else {
            wx.showToast({
              title: '获取失败',
              icon: 'none',
            })
          }
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: 'none',
          })
        }
      },
      //回调失败
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '联网失败',
          icon: 'fail',
        })
      },
    })
  },

  //写留言
  writemessage: function () {
    var that = this;
    wx: wx.navigateTo({//this.data.title  this.data.no
      url: '../../pages/write/write?title=' + that.data.title + '&no=' + that.data.no + '&g_id=' + that.data.g_id,
    })
  },

  //悬浮按钮（回到主页）
  onPostClick:function (){
    wx: wx.navigateTo({
      url: '../../pages/index/index'
    })
  },

  // 实现点赞功能
  setGood: function (event) {
    var that = this;
    console.log(event.currentTarget.dataset.index)
    var u_index = event.currentTarget.dataset.index;
    console.log(this.data.messages[0].p_id)
    //判断如果没有点赞
    if (this.data.status[u_index] == true){
      //转换成已点赞状态
      that.data.status[u_index] = !that.data.status[u_index]
      // //计数+1
      // that.data.goodarray[u_index] = that.data.goodarray[u_index] + 1
      // //更新数据
      that.setData({
        status: that.data.status,
      })
      //获得一个赞
      that.getChooseCotent();
      wx.request({
        url: '自己服务器API', //url
        data: {
          p_id: that.data.messages[u_index].p_id,//用户的 id
          openid: wx.getStorageSync('openid'),//点赞用户
          status: 1, //获得一个赞
          no: that.data.no,  //文章编号 
          g_id: that.data.g_id,  //公众号 id
        },
        header: {
          'content-type': 'application/json' // 数据格式（默认值）
        },
        method: 'post', //上传方式
        success: function (res) {   //回调成功
          console.log(res.data)
          if (res.statusCode == 200) {
            if (res.data.result == '1') {
              // that.getChooseCotent();
            } else {
              that.getChooseCotent();
              //点赞失败（回复原来未点赞状态）
              // that.data.status[u_index] = !that.data.status[u_index]
              // that.data.goodarray[u_index] = that.data.goodarray[u_index] - 1
              // that.setData({
              //   status: that.data.status,
              //   goodarray: that.data.goodarray
              // })
              wx.showToast({
                title: '点赞失败',
                icon: 'none',
              })
            }
          } else {
            that.getChooseCotent();
            wx.showToast({
              title: '服务器错误',
              icon: 'none',
            })
          }
        },
        //回调失败
        fail: function (res) {
          console.log(res)
          that.data.status[u_index] = !that.data.status[u_index]
          that.data.goodarray[u_index] = that.data.goodarray[u_index] - 1
          that.setData({
            status: that.data.status,
            goodarray: that.data.goodarray
          })
          wx.showToast({
            title: '请检查网络连接',
            icon: 'fail',
          })
        },
      })
    }else{
      wx.showToast({
        title: '您已经点过赞哦',
        icon: 'none',
      })
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
    var that = this;
    that.getChooseCotent();
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
    var that = this;
    that.getChooseCotent();

    //完成停止加载
    wx.hideNavigationBarLoading();

    //停止下拉刷新 
    wx.stopPullDownRefresh();    
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