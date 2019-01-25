// pages/select/select.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',//公众号 id
    avatarUrl:'',//管理员头像
    nickName:'',//管理员网名
    title: '',
    name: '',
    headpath: '',
    describe: '',
    formId: ''
  },

  //文章管理
  articelOpertor: function () {
    wx.navigateTo({
      url: '../../pages/mycenter/mycenter?id=' + this.data.id + "&headpath=" + this.data.headpath + "&name=" + this.data.name + "&describe=" + this.data.describe
    })
  },
  
  //跳转留言页面
  messagesOpertor: function() {
    wx.navigateTo({
      url: '../../pages/myartical/myartical?id=' + this.data.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var optionId = options.id;
    var avatarUrls = options.avatarUrl;
    var nickNames = options.nickName;
    var names = options.name;
    var headpaths = options.headpath;
    var describes = options.describe
    that.setData({
      id: optionId,
      nickName: nickNames,
      avatarUrl: avatarUrls,
      name: names,
      headpath: headpaths,
      describe: describes
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