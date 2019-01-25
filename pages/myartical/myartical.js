// pages/myartical/myartical.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts_key: [],
    num: '',
    id: '' //公众号id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that = this;

    that.setData({
      type: '1',//获取列表标识
      id: option.id
    })
    wx.request({
      url: '自己服务器API', //获取文章列表
      data: {
        type: '1', //操作类型
        id: that.data.id //公众号id
      },
      header: {
        'content-type': 'application/json' // 数据格式（默认值）
      },
      method: 'post', //上传方式
      success: function (res) {   //回调成功
        console.log(res.data)
        if (res.statusCode == 200) {
          if (res.data.result == '1') {
            var posts_content = res.data;
            console.log('onLoad文章信息为:' + res.data.content)
            that.setData({
              posts_key: posts_content.content
            })
          } else {
            wx.showToast({
              title: '您还没有发表文章哦',
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

  //跳转留言页面
  to_message_list: function (event) {
    var that = this;
    console.log(event.currentTarget.dataset.index)
    var index = event.currentTarget.dataset.index
    console.log(that.data.posts_key[index])
    var title = that.data.posts_key[index].title
    var no = that.data.posts_key[index].no
    console.log('标题：' + index + title + " " + no)
    wx: wx.navigateTo({
      url: '../../pages/lookmessage/lookmessage?title=' + title + '&no=' + no + '&id=' + that.data.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标 
    var that = this;
    wx.request({
      url: '自己服务器API', //获取文章列表
      data: {
        type: '1',//获取列表标识
        id: that.data.id //公众号id
      },
      header: {
        'content-type': 'application/json' // 数据格式（默认值）
      },
      method: 'post', //上传方式
      success: function (res) {   //回调成功
        console.log(res.data)
        if (res.statusCode == 200) {
          if (res.data.result == '1') {
            console.log(res.data)
            var posts_content = res.data;
            console.log("文章信息为:" + posts_content.content)
            that.setData({
              posts_key: posts_content.content,
              num: posts_content.content.length
            })
          } else {
            wx.showToast({
              title: '您还没有发表文章哦',
              icon: 'none',
            })
          }
        } else {
          wx.showModal({
            title: '服务器错误',
            content: 'none',
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
      complete: function () {
        wx.hideNavigationBarLoading();          //完成停止加载 
        // 动态设置导航条标题 
        wx.stopPullDownRefresh();            //停止下拉刷新 
      }
    })
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
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标 
    var that = this;
    wx.request({
      url: '自己服务器API', //获取文章列表
      data: {
        type: '1',//获取列表标识
        id: that.data.id //公众号id
      },
      header: {
        'content-type': 'application/json' // 数据格式（默认值）
      },
      method: 'post', //上传方式
      success: function (res) {   //回调成功
        console.log(res.data)
        if (res.statusCode == 200) {
          if (res.data.result == '1') {
            var posts_content = res.data;
            console.log(posts_content)
            that.setData({
              posts_key: posts_content.content
            })
          } else {
            wx.showToast({
              title: '您还没有发表任何文章哦',
              icon: 'none',
            })
          }
        } else {
          wx.showModal({
            title: '服务器错误',
            content: 'none',
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
      complete: function () {
        wx.hideNavigationBarLoading();          //完成停止加载 
        // 动态设置导航条标题 
        wx.stopPullDownRefresh();            //停止下拉刷新 
      }
    })
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